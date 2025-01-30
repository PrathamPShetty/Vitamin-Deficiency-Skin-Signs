import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';



function UserHomePage() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [vitamins, setVitamins] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("https://0.0.0.0:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.predicted_class);
      setVitamins(response.data.vitamins);
      setImageUrl(URL.createObjectURL(image)); // Show uploaded image
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-purple-700">Vitamin Deficiency</h1>
          <div className="space-x-6">
            <a href="#image-classification" className="text-gray-600 hover:text-purple-700 font-medium">Image Classification</a>
            <Link to="/" className="text-gray-600 hover:text-purple-700 font-medium">Logout</Link>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Uploaded Image and Results */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Uploaded Image</h2>
            <div className="mb-6">
              {loading && imageUrl==null ? (
               <Skeleton variant="rectangular" width={210} height={60} />
              ) : (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>
            <div className="mb-4">
              <p><strong>Results:</strong> {loading ? <Skeleton width={200} /> : result || "N/A"}</p>
              <p><strong>Vitamin Suggestion:</strong> {loading ? <Skeleton width={200} /> : vitamins.join(", ") || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">Foods that may help support overall skin and nail health include:</p>
              <ol className="list-decimal list-inside text-gray-700">
                <li>Vegetables: Leafy greens, carrots, tomatoes</li>
                <li>Biotin-rich foods: Whole grains, nuts, egg yolks, mushrooms</li>
                <li>Protein sources: Lean meats, poultry, fish, tofu, legumes</li>
              </ol>
            </div>
          </div>

          {/* Image Classification Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Image Classification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-600 font-bold"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;
