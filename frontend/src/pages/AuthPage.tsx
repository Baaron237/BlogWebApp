import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { StoreContext } from "../context/StoreContext";
import { AuthAPI } from "../services/API/Auth";

const AuthPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const { setUser, isLoading, setIsLoading, setToken } =
    useContext(StoreContext);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthAPI.login({
        username: credentials.username,
        password: credentials.password,
      });

      setUser(response.data.user);
      setToken(response.data.token);
      setShowModal(false);
      toast.success("Login successful!");
      navigate(response.data.user.isAdmin ? "/dashboard" : "/blog");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(credentials.email)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await AuthAPI.signup({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });

      toast.success("Account created successfully! Please log in.");
      setCredentials({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsSignup(false);
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Signup failed. Please try again.");
      }
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectClick = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to LeontineSH Blog
        </h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleConnectClick}
            className="w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors bg-purple-600 text-white hover:bg-purple-700"
          >
            <Lock className="w-5 h-5" />
            <span>Connect</span>
          </button>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              {isSignup ? "Create Account" : "Connect"}
            </h2>

            <motion.form
              key={isSignup ? "signup" : "login"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={isSignup ? handleSignup : handleLogin}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={credentials.confirmPassword}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading
                  ? isSignup
                    ? "Creating..."
                    : "Connecting..."
                  : isSignup
                  ? "Create Account"
                  : "Connect"}
              </button>
            </motion.form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                {isSignup
                  ? "Already have an account? Connect"
                  : "Don’t have an account? Sign up"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
