import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material/Card";
import { Button } from "@mui/material/Button";

const LiveTracker = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);

  // Function to fetch actual location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getMapLink = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const handleStartTracking = () => {
    if (!phoneNumber) {
      alert("Please enter a phone number to track.");
      return;
    }
    setTracking(true);
    fetchLocation();

    // Simulate periodic tracking every 5 seconds
    const intervalId = setInterval(() => {
      if (tracking) fetchLocation();
    }, 5000);

    // Stop tracking when the component unmounts
    return () => clearInterval(intervalId);
  };

  const handleStopTracking = () => {
    setTracking(false);
    setLocation(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-4">
          <h1 className="text-xl font-bold text-center mb-4">
            Emergency Rescue Service
          </h1>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Phone Number to Track
            </label>
            <input
              type="text"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter phone number"
            />
          </div>

          {tracking ? (
            <div className="text-center mb-4">
              <p className="text-green-600 font-medium">Tracking Active...</p>
              {location && (
                <div>
                  <p className="text-sm text-gray-700">
                    Location: Latitude {location.latitude}, Longitude {location.longitude}
                  </p>
                  <a
                    href={getMapLink(location.latitude, location.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View on Map
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-4">
              Not currently tracking.
            </p>
          )}

          <div className="flex justify-between">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleStartTracking}
              disabled={tracking}
            >
              Start Tracking
            </Button>
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleStopTracking}
              disabled={!tracking}
            >
              Stop Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTracker;