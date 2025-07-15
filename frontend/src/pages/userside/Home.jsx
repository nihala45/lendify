import React from 'react'
import Navbar from '../../components/userside/Navbar'
import Header from '../../components/userside/Header'
import Footer from '../../components/userside/Footer'
import BookRecommended from '../../components/userside/BookRecommended'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Header/>
      <BookRecommended/>
      <Footer/>
      
    </div>
  )
}

export default Home
