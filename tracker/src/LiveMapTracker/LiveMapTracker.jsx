import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";


// import { Card, CardContent } from "@mui/material/Card";
// import { Button } from "@mui/material/Button";



const LiveMapTracker = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({ country: "", city: "" });

  const fetchMccMnc = async (phoneNumber) => {
    try {
      const response = await fetch(`https://api.numlookupapi.com/v1/validate/${phoneNumber}?apikey=num_live_DHVZaR7ztpBEV5oVeVTRHMtyb981rXH7wPI3LXNY`);
      const data = await response.json();
  
  //     if (data.success) {
  //       return { mcc: data.mcc, mnc: data.mnc };
  //     } else {
  //       console.error("MCC & MNC not found.");
  //       return { mcc: null, mnc: null };
  //     }
  //   } catch (error) {
  //     console.error("Error fetching MCC and MNC:", error);
  //     return { mcc: null, mnc: null };
  //   }
  // };

  if (data.valid) {
    return { mcc: data.mcc, mnc: data.mnc };
  } else {
    console.error("Invalid phone number.");
    return { mcc: null, mnc: null };
  }
} catch (error) {
  console.error("Error fetching MCC and MNC:", error);
  return { mcc: null, mnc: null };
}
};

const fetchCellTowerLocation = async (mcc, mnc, lac, cellId) => {
  const API_KEY = "pk.5b8599952bb7a033c6efffc54ac134a0"; 

  try {
    const response = await fetch(
      `https://opencellid.org/cell/get?key=${API_KEY}&mcc=${mcc}&mnc=${mnc}&lac=${lac}&cellid=${cellId}&format=json`
    );
    const data = await response.json();

    if (data.lat && data.lon) {
      return { latitude: data.lat, longitude: data.lon, accuracy: data.range || "Unknown" };
    } else {
      console.error("Cell location not found.");
      return { latitude: null, longitude: null, accuracy: null };
    }
  } catch (error) {
    console.error("Error fetching cell tower location:", error);
    return { latitude: null, longitude: null, accuracy: null };
  }
};


const fetchPhoneLocation = async () => {
  if (!phoneNumber) {
    alert("Please enter a phone number to track.");
    return;
  }

  try {
    // Step 1: Get MCC & MNC
    const { mcc, mnc } = await fetchMccMnc(phoneNumber);

    // Step 2: Get LAC & Cell ID (hardcoded for testing, replace with actual method)
    const { lac, cellId } = ${lac} ${cellId} ; //{ lac: "7033", cellId: "17811" }; // Replace with actual data source

    if (!mcc || !mnc || !lac || !cellId) {
      alert("Could not retrieve network details.");
      return;
    }

    // Step 3: Get location from OpenCellID
    const locationData = await fetchCellTowerLocation(mcc, mnc, lac, cellId);

    if (locationData.latitude && locationData.longitude) {
      setLocation({ latitude: locationData.latitude, longitude: locationData.longitude });
      alert(`Location Found: Lat ${locationData.latitude}, Lon ${locationData.longitude}`);
    } else {
      alert("Unable to fetch location.");
    }
  } catch (error) {
    console.error("Error fetching phone location:", error);
  }
};

  

//   const fetchPhoneLocation = async () => {
//     if (!phoneNumber) {
//       alert("Please enter a phone number to track.");
//       return;
//     }

//     const API_KEY = "pk.5b8599952bb7a033c6efffc54ac134a0"; 

//     try {
//       // Step 1: Get MCC & MNC
//       const { mcc, mnc } = await fetchMccMnc(phoneNumber);
  
//       // Step 2: Get LAC & Cell ID from device (for mobile apps)
//       const { lac, cellId } = await getLacAndCellId();
  
//       if (!mcc || !mnc || !lac || !cellId) {
//         alert("Could not retrieve network details.");
//         return;
//       }
  
//       // Step 3: Get location from OpenCellID
//       const response = await fetch(
//         `https://opencellid.org/cell/get?key=${API_KEY}&mcc=${mcc}&mnc=${mnc}&lac=${lac}&cellid=${cellId}`
//       );
//     const data = await response.json();

//     if (data.lat && data.lon) {
//       setLocation({ latitude: data.lat, longitude: data.lon });
//       setAddress({ country: data.country || "Unknown", city: data.city || "Unknown" });
//     } else {
//       alert("Unable to fetch location. Invalid data or service unavailable.");
//     }
//   } catch (error) {
//     console.error("Error fetching phone location:", error);
//     alert("Error fetching location. Please try again later.");
//   }
// };
  
  const handleStartTracking = () => {
    setTracking(true);
    fetchPhoneLocation();
    const intervalId = setInterval(fetchPhoneLocation, 5000);
    return () => clearInterval(intervalId);
  };
  

  // Function to fetch actual location
  // const fetchLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setLocation({ latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) });
  //         fetchAddress(latitude, longitude);
  //       },
  //       (error) => {
  //         console.error("Error fetching location:", error);
  //         alert("Unable to fetch location. Please enable location services.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // };

  // // Function to fetch country and city using reverse geocoding
  // const fetchAddress = async (latitude, longitude) => {
  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //     );
  //     const data = await response.json();
  //     const country = data.address?.country || "Unknown";
  //     const city = data.address?.city || data.address?.town || data.address?.village || "Unknown";

  //     setAddress({ country, city });
  //     console.log(`Country: ${country}, City: ${city}`);
  //   } catch (error) {
  //     console.error("Error fetching address:", error);
  //   }
  // };

  const getMapLink = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  // const handleStartTracking = () => {
  //   if (!phoneNumber) {
  //     alert("Please enter a phone number to track.");
  //     return;
  //   }
  //   setTracking(true);
  //   fetchLocation();

  //   // Simulate periodic tracking every 5 seconds
  //   const intervalId = setInterval(() => {
  //     if (tracking) fetchLocation();
  //   }, 5000);

  //   // Stop tracking when the component unmounts
  //   return () => clearInterval(intervalId);
  // };

  const handleStopTracking = () => {
    setTracking(false);
    setLocation(null);
    setAddress({ country: "", city: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-4">
          <h1 className="text-xl font-bold text-center mb-4 text-blue-600 dark:text-sky-400">
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
                  <p className="text-sm text-gray-700 mt-2">
                    Country: {address.country}, City: {address.city}
                  </p>
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

export default LiveMapTracker;
