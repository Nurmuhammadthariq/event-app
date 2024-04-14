import React from 'react'
import EventForm from '@/components/shared/EventForm'
import { auth } from '@clerk/nextjs'

const CreateEvent = () => {
	const { sessionClaims } = auth();

	const { userId }: any = sessionClaims?.userId

	// console.log(userId)

	return (
		<>
			<section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
				<h3 className='wrapper h3-bold sm:text-left text-center'>Create Event</h3>

				<div className="wrapper my-8">
					<EventForm userId={userId} type='Create' />
				</div>
			</section>
		</>
	)
}

export default CreateEvent