import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';


const postCustomersData = () => {
  axios
      .get("https://localhost:8000/")
      .then(data => console.log(data.data))
      .catch(error => console.log(error));
};


function UserHomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-purple-700">Vitamin Deficiency</h1>
          <div className="space-x-6">
            {/* <a href="#model-performance" className="text-gray-600 hover:text-purple-700 font-medium">Model Performance</a> */}
            <a href="#image-classification" className="text-gray-600 hover:text-purple-700 font-medium">Image Classification</a>
            <Link to="/" className="text-gray-600 hover:text-purple-700 font-medium">
              Logout
            </Link>
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
              <img
                src="https://via.placeholder.com/200"
                alt="Uploaded"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="mb-4">
              <p><strong>Results:</strong> Pitting</p>
              <p><strong>Vitamin Suggestion:</strong> Vitamin - A, C, D</p>
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
            <form className="space-y-4">
              <div>
                <input
                  type="file"
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
