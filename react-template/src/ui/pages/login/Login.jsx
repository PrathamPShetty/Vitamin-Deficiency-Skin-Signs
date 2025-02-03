import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import the toast CSS

function Login() {
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Hook for navigation

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register/', registerData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Registration Successful:', response.data);
      toast.success("Registration Successful!");  // Display success toast
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error("Registration Failed!");  // Display error toast
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', loginData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Login Successful:', response.data);
      toast.success("Login Successful!");  // Display success toast
      navigate('/check');
    } catch (error) {
      if (error.response) {
        console.error('Login Error:', error.response.data);  // Log the response data
        toast.error("Login Failed: " + error.response.data);  // Display error toast with response
      } else {
        console.error('Login Error:', error.message);  // Log the error message if no response
        toast.error("Login Failed: " + error.message);  // Display error toast with message
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-purple-700">Welcome</h1>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-purple-700 font-medium">Home</Link>
            <a href="#about" className="text-gray-600 hover:text-purple-700 font-medium">About</a>
            <a href="#contact" className="text-gray-600 hover:text-purple-700 font-medium">Contact</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-800">User Registration</h2>
          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
            <input type="text" name="name" placeholder="Name" value={registerData.name} onChange={handleRegisterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
            <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
            <input type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
            <input type="text" name="phone" placeholder="Phone Number" value={registerData.phone} onChange={handleRegisterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
            <textarea name="address" placeholder="Address" value={registerData.address} onChange={handleRegisterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"></textarea>
            <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-600 font-bold">Register</button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-800">User Login</h2>
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" required />
            <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-600 font-bold">Login</button>
          </form>
        </div>
      </div>

      {/* ToastContainer to display toasts */}
      <ToastContainer />
    </div>
  );
}

export default Login;
