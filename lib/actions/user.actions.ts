'use server'

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.models";
import Event from "@/lib/database/models/event.models";
import Order from "@/lib/database/models/order.models";
import { handleError } from "@/lib/utils";

import { CreateUserParams, UpdateUserParams } from "@/types";

export async function createUser(user: CreateUserParams) {
	try {
		await connectToDatabase();

		const newUser = await User.create(user);
		return JSON.parse(JSON.stringify(newUser));
	} catch (error) {
		handleError(error);
	}
}

export async function getUserById(userId: string) {
	try {
		await connectToDatabase()

		const user = User.findById(userId)

		if (!user) throw new Error('User not found')
		return JSON.parse(JSON.stringify(user))
	} catch (error) {
		handleError(error)
	}
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
	try {
		await connectToDatabase();

		const updateUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });

		if (!updateUser) throw new Error('User Update failed');
		return JSON.parse(JSON.stringify(updateUser))
	} catch (error) {
		handleError(error);
	}
}

export async function deleteUser(clerkId: string) {
	try {
		await connectToDatabase();

		// Find user to delete
		const userToDelete = await User.findOne({ clerkId });

		if (!userToDelete) throw new Error('User Delete failed');

		await Promise.all([
			// Update the events collection
			Event.updateMany(
				{ _id: { $in: userToDelete.events } },
				{ $pull: { organizer: userToDelete._id } }
			)
		])

		// Update the orders collection to remove preferences the user
		

	} catch (error) {
		
	}
}