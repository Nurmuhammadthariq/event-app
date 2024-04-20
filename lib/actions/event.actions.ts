'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.models";
import Event from "@/lib/database/models/event.models";
import Category from "@/lib/database/models/category.models";

import { CreateEventParams, DeleteEventParams, GetAllEventsParams, UpdateEventParams } from "@/types";
import { handleError } from "../utils";

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

//CREATE EVENT
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE EVENT
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()
    
    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updateEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updateEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// DELETE EVENT
export const deleteEvent = async ({ eventId, path}: DeleteEventParams) => {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)

    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}


// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const conditions = {}

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(0)
      .limit(limit)
    
    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)


    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}
