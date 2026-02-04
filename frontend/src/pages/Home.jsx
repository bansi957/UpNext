import React from 'react'
import { useSelector } from 'react-redux'
import StudentHome from '../components/StudentHome'
import MentorHome from '../components/MentorHome'

function Home() {
    const {userData}=useSelector(state=>state.user)
  return (
    <div>
    {userData?.role=="student"?<StudentHome/>:<MentorHome/>}
    </div>
  )
}

export default Home
