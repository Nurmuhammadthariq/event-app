'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.models";
import Event from "@/lib/database/models/event.models";

import { CreateEventParams } from "@/types";
import { handleError } from "../utils";

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