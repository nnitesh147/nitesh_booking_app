import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const IndexPage = () => {
  const [places, setplaces] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setplaces(response.data);
      setloading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id} key={place}>
            <div className="bg-gray-300 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={place.photos?.[0]}
                />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm turncate text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold"> ₹{place.price} per night</span>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default IndexPage;
