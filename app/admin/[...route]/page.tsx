'use client'
import { UniversityManagement } from '@/app/components/Select/ManageUniversities/UniversityManagement';
import { usePathname } from 'next/navigation';
import React from 'react'


const NotIntegrated = () => {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            Not Integrated Yet.......
        </div>
    )
}


const page = () => {
    const pathname = usePathname();


    switch (true) {
        case pathname.endsWith("/select"):
            return <UniversityManagement />;

        case pathname.endsWith("/stay"):
            return <NotIntegrated />

        case pathname.endsWith("/connect"):
            return <NotIntegrated />

        case pathname.endsWith("/community"):
            return <NotIntegrated />

        case pathname.endsWith("/lenders"):
            return <NotIntegrated />
    }

    return (
        <div>
            Not Integrated Yet.......
        </div>
    )
}

export default page