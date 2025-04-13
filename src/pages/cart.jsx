import React, { useEffect, useState } from "react";

const Cart = () => {
  const [location, setLocation] = useState("📍 Fetching your location...");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              console.log("Coordinates:", latitude, longitude); // Log coordinates to check if they are correct
              // Using PositionStack API with your API key
              const res = await fetch(
                `https://api.positionstack.com/v1/reverse?access_key=f85a36a35dc189e854e7aaabb3e29fb6&query=${latitude},${longitude}`
              );
              const data = await res.json();
              console.log("PositionStack geocode data:", data);

              // Check the complete address details
              if (data && data.data && data.data.length > 0) {
                const address = data.data[0];
                console.log("📦 Detailed Address: ", address); // Log to inspect the full address data
                const area =
                  address.neighbourhood ||
                  address.locality ||
                  address.street ||
                  address.district ||
                  address.region ||
                  address.city ||
                  "your area"; // Fallback to a default value if nothing is found

                const state = address.region || address.state || "";
                setLocation(`📍 Delivering to: ${area}, ${state}`);
              } else {
                console.log("No detailed address found, falling back to IP location.");
                fallbackToIP();
              }
            },
            (error) => {
              console.log("Geolocation failed: ", error.message);
              fallbackToIP();
            }
          );
        } else {
          console.log("Geolocation is not supported.");
          fallbackToIP();
        }
      } catch (error) {
        console.error("Error fetching geolocation:", error);
        fallbackToIP();
      }
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        console.log("IP geolocation data:", data);

        if (data && data.city && data.region) {
          setLocation(`📍 Delivering to: ${data.city}, ${data.region}`);
        } else {
          setLocation("📍 Unable to detect your location.");
        }
      } catch (error) {
        console.error("Error fetching IP location:", error);
        setLocation("📍 Unable to detect your location.");
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mb-4 text-lg font-semibold text-gray-700">{location}</div>

      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {/* Sample Cart Items */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center">
          <span>🍔 Zinger Burger</span>
          <span>Rs. 500</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center">
          <span>🥤 Pepsi</span>
          <span>Rs. 100</span>
        </div>
      </div>

      {/* Total */}
      <div className="text-right font-bold text-xl">Total: Rs. 600</div>
    </div>
  );
};

export default Cart;
