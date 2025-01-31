import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
// import EmergencyRescueApp from './Tracker/Tracker'
import LiveTracker from './LiveTracker/LiveTracker';

function App() {
  return (
    <Router>
      {/* <EmergencyRescueApp /> */}
      <LiveTracker />
    </Router>
  )
}

export default App
