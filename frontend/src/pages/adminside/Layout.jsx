import React from 'react'
import Sidebar from '../../components/adminside/AdminSidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/adminside/AdminNavbar'
import Footer from '../../components/userside/Footer' 

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 h-full overflow-auto'>
          <Outlet/>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout