import AboutUs from '@/components/AboutUs'
import Footer from '@/components/Footer'
import { MainNav } from '@/components/ui/navigation-menu'
import React from 'react'

const page = () => {
  return (
    <div>
      <MainNav/>
      <AboutUs/>
      <Footer/>
    </div>
  )
}

export default page