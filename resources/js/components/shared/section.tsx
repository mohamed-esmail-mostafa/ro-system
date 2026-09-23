import React from 'react'

export default function Section({ children }: { children?: React.ReactNode }) {
    return (
        <div className='bg-white '>
            <div>
                {children}
            </div>
        </div>
    )
}
