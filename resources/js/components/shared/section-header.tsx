import React from 'react'

export default function SectionHeader({title}:{title:string}) {
  return (
    <div className='bg-gray-200 p-2'>
        <h5>{title}</h5>
    </div>
  )
}
