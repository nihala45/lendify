import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/userside/Home';
import Register from './pages/userside/Register'
import Login from './pages/userside/Login'
import OtpVerification from './pages/userside/OtpVerification';
import Layout from './pages/adminside/Layout';
import AdminDashboard from './pages/adminside/AdminDashboard';
import ManageUsers from './pages/adminside/ManageUsers';
import AdminLogin from './pages/adminside/AdminLogin';
import ManageCategories from './pages/adminside/ManageCategories';
import AddBook from './pages/adminside/AddBook';
import ManageBooks from './pages/adminside/ManageBooks'
import AdminBookDetailPage from './pages/adminside/AdminBookDetailPage';
const App = () => {
  return (
    <div>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
       <Route path="/otp/:id" element={<OtpVerification />} />
       <Route path="/admin/login" element={<AdminLogin />} />
       <Route path="/admin/bookdetail/:id" element={<AdminBookDetailPage />} />



       <Route
        path="/admin"
        element={
         
            <Layout />
    
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-categories" element={<ManageCategories />} />
        <Route path="manage-books" element={<ManageBooks />} />


        
        
      </Route>

      <Route path="/admin/add-book" element={<AddBook />} />


      </Routes>
 
    </div>
  )
}

export default App
