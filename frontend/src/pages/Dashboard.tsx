import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Image, Palette, BarChart3, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Analytics from '../components/dashboard/Analytics';
import PostManager from '../components/dashboard/PostManager';
import ThemeEditor from '../components/dashboard/ThemeEditor';
import MediaLibrary from '../components/dashboard/MediaLibrary';

const Dashboard = () => {
  const { logout } = useAuthStore();

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
            to="/dashboard/media"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Image className="w-5 h-5 mr-3" />
            Media
          </Link>
          <Link
            to="/dashboard/themes"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Palette className="w-5 h-5 mr-3" />
            Themes
          </Link>
          <button
            onClick={logout}
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
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/themes" element={<ThemeEditor />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;