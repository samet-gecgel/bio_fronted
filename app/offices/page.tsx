import Footer from '@/components/Footer'
import Offices from '@/components/officeData'
import { MainNav } from '@/components/ui/navigation-menu'
import React from 'react'

const page = () => {
  return (
    <div>
      <MainNav/>
      <Offices/>
      <Footer/>
    </div>
  )
}

export default page