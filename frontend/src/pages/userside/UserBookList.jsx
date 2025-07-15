import React from 'react'
import Navbar from '../../components/userside/Navbar'
import BookList from '../../components/userside/BookList'
import Footer from '../../components/userside/Footer'

const UserBookList = () => {
  return (
    <div>
      <Navbar/>
      <BookList/>
      <Footer/>
    </div>
  )
}

export default UserBookList
