import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom"

const Destination = ({}) => {
    const [data, setData] = useState([]);
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

    return (
        <> 
            {data.individualImages && data.individualImages.map((image, index) => (
             <div className="card shadow-sm" key={index}> 
                <img src={image} className="card-img-top" alt="..." /> 
                <div className="card-body text-center"> 
                    <p className="card-text">{data.individualDescriptions[index]}</p> 
                </div> 
            </div> ))}
        </>
    );
}

export default Destination;