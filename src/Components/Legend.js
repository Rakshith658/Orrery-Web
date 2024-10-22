import React from "react";

const Legend = () => {
  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 p-4 rounded-lg text-white z-50">
      <h3 className="text-lg font-bold mb-2">Space Objects Legend</h3>
      <div className="space-y-2">
        <div
          className="flex items-center"
          style={{ display: "flex", marginTop: 10 }}
        >
          <div
            // className="w-4 h-4 rounded-full mr-2"
            style={{
              backgroundColor: "#dbe9f4",
              width: 25,
              height: 25,
              borderRadius: 25,
              marginRight: 15,
            }}
          ></div>
          <span>NEAs (Near-Earth Asteroids)</span>
        </div>
        <div
          className="flex items-center"
          style={{ display: "flex", marginTop: 10 }}
        >
          <div
            className="w-4 h-4 rounded-full mr-2 bg-white"
            style={{
              backgroundColor: "#dbe9f4",
              width: 25,
              height: 25,
              borderRadius: 25,
              marginRight: 15,
            }}
          ></div>
          <span>NECs (Near-Earth Comets)</span>
        </div>
        <div
          className="flex items-center"
          style={{ display: "flex", marginTop: 10 }}
        >
          <div
            className="w-4 h-4 rounded-full mr-2 bg-gray-500"
            style={{
              backgroundColor: "#dbe9f4",
              width: 25,
              height: 25,
              borderRadius: 25,
              marginRight: 15,
            }}
          ></div>
          <span>PHAs (Potentially Hazardous Asteroids)</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
