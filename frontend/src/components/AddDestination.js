import React, { useState } from 'react';

function AddDestination() {
    const [formData, setFormData] = useState({
        location: '',
        type: '',
        description: '',
        image: null,
        individualImages: [],
        individualDescriptions: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMainImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleIndividualImagesChange = (e) => {
        setFormData(prev => ({
            ...prev,
            individualImages: Array.from(e.target.files)
        }));
    };

    const handleIndividualDescriptionChange = (e, index) => {
        const newDescriptions = [...formData.individualDescriptions];
        newDescriptions[index] = e.target.value;
        setFormData(prev => ({
            ...prev,
            individualDescriptions: newDescriptions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('location', formData.location);
        data.append('type', formData.type);
        data.append('description', formData.description);
        
        // Append main image
        if (formData.image) {
            data.append('image', formData.image);
        }
    
        // Append individual images
        formData.individualImages.forEach((file) => {
            data.append('individualImages', file);
        });
    
        // Append individual descriptions
        data.append('individualDescriptions', JSON.stringify(formData.individualDescriptions));
    
        try {
            console.log(data);
            const response = await fetch("http://localhost:8081/destination", {
                method: "POST",
                body: data,
            });
            console.log('Upload successful', await response.json());
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <div className="container my-5">
          <h2 className="text-center mb-4">Add a New Destination</h2>
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter the location"
                required
              />
            </div>
    
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <input
                type="text"
                name="type"
                id="type"
                className="form-control"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Enter the type"
                required
              />
            </div>
    
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a detailed description"
                required
              />
            </div>
    
            {/* Main Image Upload */}
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Main Image
              </label>
              <input
                type="file"
                name="image"
                id="image"
                className="form-control"
                onChange={handleMainImageChange}
                required
              />
            </div>
    
            {/* Individual Images Upload */}
            <div className="mb-3">
              <label htmlFor="individualImages" className="form-label">
                Individual Images
              </label>
              <input
                type="file"
                multiple
                name="individualImages"
                id="individualImages"
                className="form-control"
                onChange={handleIndividualImagesChange}
              />
            </div>
    
            {/* Individual Descriptions */}
            <div className="mb-3">
              <label className="form-label">Individual Descriptions</label>
              {[1, 2, 3, 4].map((_, index) => (
                <textarea
                  key={index}
                  className="form-control mb-2"
                  value={formData.individualDescriptions[index] || ""}
                  onChange={(e) => handleIndividualDescriptionChange(e, index)}
                  placeholder={`Individual Description ${index + 1}`}
                />
              ))}
            </div>
    
            <button type="submit" className="btn btn-primary w-100 mt-4">
              Upload Destination
            </button>
          </form>
        </div>
      );
    };

export default AddDestination;