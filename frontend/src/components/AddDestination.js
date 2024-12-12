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
        formData.individualImages.forEach((file, index) => {
            data.append(`individualImage${index}`, file);
        });

        // Append individual descriptions
        data.append('individualDescriptions', JSON.stringify(formData.individualDescriptions));

        try {
            const response = await
            fetch("http://localhost:8081/destination", {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data", },
            body: data,
            });
            console.log('Upload successful', response.data);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                required
            />
            <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Type"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
            />
            
            {/* Main Image Upload */}
            <input
                type="file"
                name="image"
                onChange={handleMainImageChange}
            />

            {/* Individual Images Upload */}
            <input
                type="file"
                multiple
                onChange={handleIndividualImagesChange}
            />

            {/* Individual Descriptions */}
            {[1, 2, 3, 4].map((_, index) => (
                <textarea
                    key={index}
                    value={formData.individualDescriptions[index] || ''}
                    onChange={(e) => handleIndividualDescriptionChange(e, index)}
                    placeholder={`Individual Description ${index + 1}`}
                />
            ))}

            <button type="submit">Upload Destination</button>
        </form>
    );
}

export default AddDestination;