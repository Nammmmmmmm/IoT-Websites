import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <p>This is Dashboard</p> 
      <Link to="/profile">Go to Profile</Link>
    </div>
  )
}
