
import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import StudentPage from './pages/studentDashboard/StudentPage';
import AdminPage from './pages/adminDashboard/AdminPage';
import AdminStudents from './pages/adminDashboard/AdminStudents';
import AdminInstructors from './pages/adminDashboard/AdminInstructors';
import CreateInstructors from './pages/adminDashboard/CreateInstructors';
import AdminCourses from './pages/adminDashboard/AdminCourses';
import CreateCourses from './pages/adminDashboard/CreateCourses';
import InstructorPage from './pages/instructorDashboard/InstructorPage';
import CourseClassroom from './pages/instructorDashboard/CourseClassroom';
import ClassworkPage from './pages/instructorDashboard/ClassworkPage';
import EditAssignmentPage from './pages/instructorDashboard/editAssignment';
import CreateAssignment from './pages/instructorDashboard/CreateAssignment';
import PeoplePage from './pages/instructorDashboard/PeoplePage';

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
      <Route path='/admin-instructors' element={<AdminInstructors />}/>
      <Route path='/create-instructor' element={<CreateInstructors />}/>
      <Route path='/admin-courses' element={<AdminCourses />}/>
      <Route path='/create-course' element={<CreateCourses />}/>
      <Route path='/instructor' element={<InstructorPage />}/>
      <Route path="/course/:courseId" element={<CourseClassroom />} />
      <Route path="/course/:courseId" element={<ClassworkPage />} />
      <Route path="/edit-assignment/:assignmentId" element={<EditAssignmentPage />} />
      <Route path="/create-assignment/:courseId" element={<CreateAssignment />} />
      <Route path="/course/:courseId" element={<PeoplePage />} />
      <Route path='/*' element={<h1>Not Found</h1>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App