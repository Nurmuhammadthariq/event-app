import React from 'react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'

const Search = ({ placeholder = 'Searct for events, speakers, and more' }: { placeholder?: string }) => {
	return (
		<div className='flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
			<Image
				src="/assets/icons/search.svg"
				alt='search'
				width={24}
				height={24}
			/>
			<Input
				type='text'
				placeholder={placeholder}
				className='p-regular-16 border-0 bg-gray-50 outline-offset-0 placeholder:text-gray-500	focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
			/>
    </div>
	)
}

export default Search