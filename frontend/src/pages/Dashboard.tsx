import React, { useContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Palette,
  BarChart3,
  LogOut,
} from "lucide-react";

import Analytics from "../components/dashboard/Analytics";
import PostManager from "../components/dashboard/PostManager";
import ThemeEditor from "../components/dashboard/ThemeEditor";
import UserAccounts from "../components/dashboard/UserAccounts";
import { StoreContext } from "../context/StoreContext";

const Dashboard = () => {
  const { logout } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </Link>
          <Link
            to="/dashboard/posts"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Posts
          </Link>
          <Link
            to="/dashboard/useraccounts"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <User className="w-5 h-5 mr-3" />
            UserAccounts
          </Link>
          <Link
            to="/dashboard/themes"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Palette className="w-5 h-5 mr-3" />
            Themes
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/posts/*" element={<PostManager />} />
          <Route path="/useraccounts" element={<UserAccounts />} />
          <Route path="/themes" element={<ThemeEditor />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
