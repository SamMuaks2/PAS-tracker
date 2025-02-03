import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const CellLocator = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [tracking, setTracking] = useState(false);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState({ country: "", city: "" });

    const fetchPhoneLocation = async () => {
        if (!phoneNumber) {
          alert("Please enter a phone number to track.");
          return;
        }
      
        try {
          // Step 1: Fetch MCC, MNC, LAC, and Cell ID
          const numLookupResponse = await fetch(
            `https://api.numlookupapi.com/v1/validate/${phoneNumber}?apikey=num_live_DHVZaR7ztpBEV5oVeVTRHMtyb981rXH7wPI3LXNY`
          );
          const numLookupData = await numLookupResponse.json();

          console.log("NumLookUpAPI Response:", numLookupData);
      
          if (!numLookupData.valid) {
            alert("Invalid phone number.");
            return;
          }
      
          const { mcc, mnc, lac, cell_id } = numLookupData;
      
          if (!mcc || !mnc || !lac || !cell_id) {
            alert("Could not retrieve network details.");
            return;
          }
      
          // Step 2: Fetch location from OpenCellID
          const openCellIDResponse = await fetch(
            `https://opencellid.org/cell/get?key=pk.5b8599952bb7a033c6efffc54ac134a0&mcc=${mcc}&mnc=${mnc}&lac=${lac}&cellid=${cell_id}&format=json`
          );
          const locationData = await openCellIDResponse.json();

          console.log("OpenCellID Response:", locationData);
      
          if (locationData.lat && locationData.lon) {
            setLocation({ latitude: locationData.lat, longitude: locationData.lon });
            alert(`Location Found: Lat ${locationData.lat}, Lon ${locationData.lon}`);
          } else {
            alert("Unable to fetch location.");
          }
        } catch (error) {
          console.error("Error fetching phone location:", error);
        }
      };


      const handleStartTracking = () => {
        setTracking(true);
        fetchPhoneLocation();
        const intervalId = setInterval(fetchPhoneLocation, 5000);
        return () => clearInterval(intervalId);
      };


      const handleStopTracking = () => {
        setTracking(false);
        setLocation(null);
        setAddress({ country: "", city: "" });
      };


      const getMapLink = (latitude, longitude) => {
        return `https://www.google.com/maps?q=${latitude},${longitude}`;
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
  )
}

export default CellLocator