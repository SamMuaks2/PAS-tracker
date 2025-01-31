import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
// import EmergencyRescueApp from './Tracker/Tracker'
// import LiveTracker from './LiveTracker/LiveTracker';
import LiveMapTracker from './LiveMapTracker/LiveMapTracker';

function App() {
  return (
    <Router>
      {/* <EmergencyRescueApp /> */}

      {/* <LiveTracker /> */}
      
      <LiveMapTracker />
    </Router>
  )
}

export default App
