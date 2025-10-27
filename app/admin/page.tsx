'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter();
    setTimeout(() => {
        router.push("/admin/select");
    }, 100);
  return (
    <div>
        Redirecting to select.........
    </div>
  )
}
export default page;