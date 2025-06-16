import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import PostView from './pages/PostView';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  // const { initialized, checkAuth } = useAuthStore();

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // if (!initialized) {
  //   return <LoadingScreen />;
  // }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;