import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from 'react-icons/fa'; // You can use a map icon from react-icons

function Cart() {
  const [location, setLocation] = useState("Detecting...");
  const [error, setError] = useState(null);
  const [manualCity, setManualCity] = useState(""); // for manual input
  const [needManual, setNeedManual] = useState(false); // show manual input?
  const [locationFetched, setLocationFetched] = useState(false); // Track if location is fetched

  // Try to get location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data?.address?.city) {
              setLocation(data.address.city);
              setLocationFetched(true);
            } else {
              setError("City not found");
              fallbackToIP();
            }
          } catch (err) {
            setError("Reverse geocoding failed");
            fallbackToIP();
          }
        },
        (err) => {
          console.error(err);
          setError("GPS Blocked");
          fallbackToIP();
        }
      );
    } else {
      setError("Geolocation not supported");
      fallbackToIP();
    }
  }, []);

  // Fallback to IP-based geolocation if GPS fails
  const fallbackToIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data?.city) {
        setLocation(data.city);
        setLocationFetched(true);
      } else {
        throw new Error("City not found");
      }
    } catch (e) {
      setError("IP detection failed too 😭");
      setNeedManual(true); // allow manual entry
    }
  };

  // Handle manual location submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCity.trim() !== "") {
      setLocation(manualCity.trim());
      setNeedManual(false);
      setLocationFetched(true); // Mark location as fetched
    }
  };

  // Reset location to allow re-fetch or manual entry
  const resetLocation = () => {
    setLocation("Detecting...");
    setNeedManual(false);
    setLocationFetched(false);
  };

  return (
    <div className="p-4">
      <p className="text-sm text-gray-600">
        📍 Delivering to: <strong>{location}</strong>
      </p>

      {error && <p className="text-xs text-red-500">Error: {error}</p>}

      {/* Show manual input or button to change location */}
      {needManual && !locationFetched && (
        <form onSubmit={handleManualSubmit} className="mt-2">
          <label className="text-sm text-gray-700">Enter your city manually:</label>
          <input
            type="text"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            className="border rounded p-1 mx-2"
            placeholder="e.g. Lahore"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Submit
          </button>
        </form>
      )}

      {/* Location Icon Button */}
      {locationFetched && (
        <div className="mt-2 flex items-center">
          <FaMapMarkerAlt
            className="cursor-pointer text-blue-500 mr-2"
            onClick={resetLocation} // Click to change location
          />
          <span className="text-sm text-gray-700">Change location</span>
        </div>
      )}

      {/* Only show the manual input button if needed */}
      {!locationFetched && !needManual && (
        <button
          onClick={() => setNeedManual(true)}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Enter Location Manually
        </button>
      )}

      <div className="mt-4">🛒 Your cart items here</div>
    </div>
  );
}

export default Cart;
