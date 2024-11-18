
import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import StudentPage from './pages/studentDashboard/StudentPage';
import AdminPage from './pages/adminDashboard/AdminPage';
import AdminStudents from './pages/adminDashboard/AdminStudents';

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginPage />}/>
      <Route path='/home' element={<HomePage />}/>
      <Route path='/register' element={<RegisterPage />}/>
      <Route path='/student' element={<StudentPage />}/>
      <Route path='/admin' element={<AdminPage />}/>
      <Route path='/admin-students' element={<AdminStudents />}/>
      <Route path='/*' element={<h1>Not Found</h1>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App