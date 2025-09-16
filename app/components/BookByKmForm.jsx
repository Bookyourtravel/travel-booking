"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

export default function BookByKmForm() {
  const carOptions = {
    swift: { name: "Swift Dzire", rate: 12, capacity: 4 },
    amaze: { name: "Honda Amaze", rate: 13, capacity: 4 },
    innova: { name: "Innova Crysta", rate: 19, capacity: 6 },
    tempo: { name: "Tempo Traveller", rate: 30, capacity: 12 },
  };

  const [car, setCar] = useState("swift");
  const [passengers, setPassengers] = useState(2);
  const [error, setError] = useState("");
  const [fare, setFare] = useState(0);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState(0);

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  // validate passengers
  useEffect(() => {
    const cap = carOptions[car].capacity;
    if (Number(passengers) > cap) {
      setError(`⚠️ ${carOptions[car].name} supports max ${cap} passengers.`);
      navigator.vibrate?.(200); // vibration on mobile
    } else {
      setError("");
    }
  }, [passengers, car]);

  // calculate fare
  useEffect(() => {
    if (!distance) return;
    let total = distance * carOptions[car].rate;
    const now = new Date();
    if (now.getHours() >= 21) total += 350; // night charge
    setFare(Math.round(total));
  }, [distance, car]);

  // get distance from Google Maps
  const calculateDistance = () => {
    if (!pickup || !drop) return;
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pickup],
        destinations: [drop],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const distText = response.rows[0].elements[0].distance.text;
          const distVal = response.rows[0].elements[0].distance.value / 1000; // meters to km
          setDistance(distVal);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (error) return;
          alert("Booking submitted!");
        }}
        className="space-y-4"
      >
        {/* Car selection */}
        <label className="block text-sm font-medium">Select Car</label>
        <select
          value={car}
          onChange={(e) => setCar(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          {Object.entries(carOptions).map(([key, c]) => (
            <option key={key} value={key}>
              {c.name} (₹{c.rate}/km) — {c.capacity} seats
            </option>
          ))}
        </select>

        {/* Passengers */}
        <label className="block text-sm font-medium">Number of Passengers</label>
        <input
          type="number"
          value={passengers}
          min="1"
          max={carOptions[car].capacity}
          onChange={(e) => setPassengers(e.target.value)}
          className={`w-full border rounded-md px-3 py-2 ${error ? "border-red-500" : ""}`}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {/* Pickup & Drop */}
        <label className="block text-sm font-medium">Pickup Location</label>
        <Autocomplete
          onLoad={(ref) => (pickupRef.current = ref)}
          onPlaceChanged={() => {
            setPickup(pickupRef.current.getPlace().formatted_address);
            calculateDistance();
          }}
        >
          <input className="w-full border rounded-md px-3 py-2" placeholder="Enter pickup" />
        </Autocomplete>

        <label className="block text-sm font-medium">Drop Location</label>
        <Autocomplete
          onLoad={(ref) => (dropRef.current = ref)}
          onPlaceChanged={() => {
            setDrop(dropRef.current.getPlace().formatted_address);
            calculateDistance();
          }}
        >
          <input className="w-full border rounded-md px-3 py-2" placeholder="Enter drop" />
        </Autocomplete>

        {/* Fare Display */}
        {distance > 0 && (
          <div className="bg-gray-50 border rounded-md p-3 text-sm">
            Distance: <b>{distance.toFixed(1)} km</b>  
            <br />
            Estimated Fare: <span className="font-semibold">₹{fare}</span>
          </div>
        )}

        {/* Terms */}
        <div className="text-xs text-gray-600 bg-gray-50 border rounded-md p-3 space-y-1">
          <div>• Toll tax to be paid by customer</div>
          <div>• Parking charges to be paid by customer</div>
          <div>• Night charge ₹350 applies after 9 PM</div>
          <div>• Driver food allowance on trips beyond 200 km/day</div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!!error}
          className={`w-full px-4 py-2 rounded-md font-medium ${
            error ? "bg-gray-300 cursor-not-allowed" : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          Continue to Book
        </button>
      </form>
    </LoadScript>
  );
}
