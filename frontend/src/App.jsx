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
import UserBookList from './pages/userside/UserBookList';
import BorrowBookDetails from './pages/userside/BorrowBookDetails';
import AdminManageRequest from './pages/adminside/AdminManageRequest';
import DetailBook from './pages/userside/DetailBook';

import UserProtectedRoute from './routes/UserProtectedRoute';
import UserLoginRedirect from './routes/UserLoginRedirect';
import AdminProtectedRoute from './routes/AdminProtectedRoute';

const App = () => {
  return (
    <div>
      <Routes>
      
        <Route 
          path="/" 
          element={
            <UserLoginRedirect>
              <Home />
            </UserLoginRedirect>
          } 
        />
        <Route 
          path="/register" 
          element={
            <UserLoginRedirect>
              <Register />
            </UserLoginRedirect>
          } 
        />
        <Route 
          path="/login" 
          element={
            <UserLoginRedirect>
              <Login />
            </UserLoginRedirect>
          } 
        />
        <Route 
          path="/otp/:id" 
          element={<OtpVerification />} 
        />

        <Route 
          path="/admin/login" 
          element={<AdminLogin />} 
        />

 
        <Route 
          path="/user/book-list/" 
          element={
            <UserProtectedRoute>
              <UserBookList />
            </UserProtectedRoute>
          } 
        />
        <Route 
          path="/user/borrow-book-detail/" 
          element={
            <UserProtectedRoute>
              <BorrowBookDetails />
            </UserProtectedRoute>
          } 
        />

        <Route 
          path="/user/book-detail/:id" 
          element={
            <UserProtectedRoute>
              <DetailBook />
            </UserProtectedRoute>
          } 
        />

       
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Layout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="manage-books" element={<ManageBooks />} />
          <Route path="manage-requests/" element={<AdminManageRequest />} />
        </Route>

        <Route 
          path="/admin/add-book" 
          element={
            <AdminProtectedRoute>
              <AddBook />
            </AdminProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

export default App;
