import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom"

const Destination = ({ username }) => {
    const [data, setData] = useState([]);
    const [saved, setSaved] = useState(false);
    const [savedDestinations, setSavedDestinations] = useState([]);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
    const fetchDestination = async () => {
        try {
            const response = await fetch(`http://localhost:8081/destination?id=${id}`);
            if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.error);
            }
            setData(await response.json());
          } catch (error) {
            console.error('Error fetching destination:', error);
          }
    }
    fetchDestination();
}, [id]);

    const handleSaveDestination = async () => {
        setSaved(true);
        setSavedDestinations((prevDestinations) => [...prevDestinations, data]);

    try {
        const response = await fetch("http://localhost:8081/save-destination", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            destinationID: data.id,
          }),
        });
  
        const result = await response.json();
        if (response.ok) {
          console.log("Destination saved:", result);
        } else {
          console.error("Failed to save destination:", result.message);
        }
      } catch (error) {
        console.error("Error saving destination:", error);
      }
    };

    

return (
    <>
    {data.location ? (
    <div className="container my-5">
        <h1 className='text-center'>{data.location}</h1>
      {/* Images Section */}
      <div className="row mb-4">
        {data.individualImages &&
          data.individualImages.map((image, index) => (
            <div className="col-md-3 mb-3" key={index}>
              <div className="card shadow-sm">
                <img
                  src={image}
                  className="card-img-top"
                  alt={`Destination ${index}`}
                />
                <div className="card-body text-center">
                  <p className="card-text">
                    {data.individualDescriptions[index]}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Activities / Pros and Cons */}
      <div className="row">
        {/* Activities */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header text-center bg-success text-white">
              Activities
            </div>
            <ul className="list-group list-group-flush">
              {data.activities &&
                data.activities.map((activity, index) => (
                  <li className="list-group-item" key={index}>
                    {activity}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Pros / Cons */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header text-center bg-danger text-white">
              Pros and Cons
            </div>
            <ul className="list-group list-group-flush">
              {data.pros_cons &&
                data.pros_cons.map((pro, index) => (
                  <li className="list-group-item" key={index}>
                    {pro}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

        {/* Buttons */}
        <div className="justify-content-center d-flex mt-4 mb-4">
            <div className="row">
            <a
                  href={`https://duckduckgo.com/?q=flights+for+${data.location}`}
                  className="btn btn-primary w-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Trip
                </a>
            <button
                  onClick={handleSaveDestination}
                  className="btn btn-secondary w-100"
                >
                  {saved ? "Destination Saved!" : "Save Destination"}
                </button>
            </div>
        </div>
    </div>

    
            ) : (
            <h1 className='text-center'>404! <p>No data found</p></h1>
    )}
</>
  );
};

export default Destination;