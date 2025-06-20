import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, X, Smile, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { StoreContext } from "../context/StoreContext";
import { AuthAPI } from "../services/API/Auth";

const EMOJI_LIST = [
  "😊",
  "👍",
  "❤️",
  "🎉",
  "😎",
  "🌟",
  "🥳",
  "😂",
  "😍",
  "🤗",
  "🔥",
  "💯",
  "🙌",
  "😜",
  "🤓",
  "😢",
  "🎵",
  "🌈",
  "⚡",
  "⭐",
  "💫",
  "🍎",
  "🍕",
  "☕",
  "🎸",
  "🏀",
  "🚀",
  "🌍",
  "🎄",
  "🎁",
  "💖",
  "💙",
];

const FONTS = [
  { name: "Lobster", value: "'Lobster', cursive" },
  { name: "Amatic SC", value: "'Amatic SC', cursive" },
  { name: "Shadows Into Light", value: "'Shadows Into Light', cursive" },
  { name: "Bangers", value: "'Bangers', cursive" },
  { name: "Satisfy", value: "'Satisfy', cursive" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Poppins", value: "'Poppins', sans-serif" },
  { name: "Nunito", value: "'Nunito', sans-serif" },
];

const AuthPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
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

  const handleEmojiSelect = (emoji: string) => {
    setCredentials({ ...credentials, username: credentials.username + emoji });
    setShowEmojiPicker(false);
  };

  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
    setShowFontMenu(false);
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
      <link
        href="https://fonts.googleapis.com/css2?family=Amatic+SC&family=Bangers&family=Lobster&family=Roboto&family=Poppins&family=Nunito&family=Satisfy&family=Shadows+Into+Light&display=swap"
        rel="stylesheet"
      />

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
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{ fontFamily: selectedFont }}
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute w-44 top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl grid grid-cols-4 gap-2 overflow-y-auto max-h-64 z-10">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleEmojiSelect(emoji)}
                            className="text-2xl hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowFontMenu(!showFontMenu)}
                      className="p-2 hover:bg-gray-100 rounded-full flex items-center"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    {showFontMenu && (
                      <div className="absolute w-40 top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl flex flex-col gap-1 z-10">
                        {FONTS.map((font) => (
                          <button
                            key={font.name}
                            type="button"
                            onClick={() => handleFontSelect(font.value)}
                            className="text-left px-2 py-1 hover:bg-gray-100 rounded"
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
