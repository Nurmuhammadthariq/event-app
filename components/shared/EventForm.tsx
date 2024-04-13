"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { eventFormSchema } from '@/lib/validator'
import * as z from "zod"
import { eventDefaultValues } from '@/constants'
import Image from 'next/image'

import { useRouter } from 'next/navigation'
import { IEvent } from '@/lib/database/models/event.models'
import Dropdown from './Dropdown'

type EventFormProps = {
	userId: string
	type: "Create" | "Update"
	event?: IEvent
	eventId?: string
}


const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
	const initialValues = eventDefaultValues

	const form = useForm<z.infer<typeof eventFormSchema>>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: initialValues
	})

	async function onSubmit(values: z.infer<typeof eventFormSchema>) {
		console.log(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
				<div className="flex flex-col gap-5 md:flex-row">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<Input placeholder="Event Title" {...field} className='input-field' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<Dropdown onChangeHandler={field.onChange} value={field.value} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

				</div>

				<div className="flex flex-col gap-5 md:flex-row">
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<Textarea placeholder="Description" {...field} className='textarea ' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button
					type="submit"
					size="lg"
					disabled={form.formState.isSubmitting}
					className='button col-span-2 w-full'>
					Submit
				</Button>
			</form>
		</Form>
	)
}

export default EventForm