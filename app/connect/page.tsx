import React from 'react'
import Hero from '../components/Connect/Page/Hero'
import ComingSoon from '@/components/ui/comingsoon'
// import PeopleList from '../components/Connect/Page/PeopleList'

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
    <Hero/>
    {/* <PeopleList/> */}
    <ComingSoon/>
    </div>
  )
}

export default Page