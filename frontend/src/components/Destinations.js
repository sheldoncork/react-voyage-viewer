import React, { useState, useEffect } from 'react';

function Destinations() {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await fetch('http://localhost:8081/destinations');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDestinations(data);
            setFilteredDestinations(data); // Initialize filtered destinations with all data
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase(); // Use a different name for the local variable
        setSearchTerm(value);
        const filtered = destinations.filter(destination =>
            destination.location.toLowerCase().includes(value)
        );
        setFilteredDestinations(filtered);
    };

    return (
        <div className="container">
            <h2>Destinations</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="row">
                {filteredDestinations.map((destination) => (
                    <div key={destination._id} className="col">
                        <div className="card">
                            <img 
                                src={destination.image} 
                                className="card-img-top" 
                                alt={destination.location} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{destination.location}</h5>
                                <p className="card-text">{destination.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Destinations;
