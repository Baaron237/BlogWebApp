/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { StoreContext } from "../context/StoreContext";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { API_URL } from "../constants/API_URL";

dayjs.locale('fr');

type Theme = {
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  [key: string]: any;
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const { isLoading, setIsLoading, token } = useContext(StoreContext);
  const [isLiked, setIsLiked] = useState(false);

  

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await PostsAPI.getAllPosts();
      setPosts(response.data?.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");  
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveTheme = async () => {
    setIsLoading(true);
    try {
      const response = await ThemesAPI.getActiveTheme();
      setActiveTheme(response.data?.theme || null);
    } catch (error) {
      console.error("Error fetching active theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
      try {
        const response = await PostsAPI.likePost(id!, token!);
        setIsLiked(response.data.liked);
        fetchPosts();
      } catch (error) {
        console.error("Error liking post:", error);
      }
    };

  const handleShare = async (post: any) => {
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 100) + "...",
      url: `${window.location.origin}/post/${post.id}`,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const formatDate = (dateString: Date) => {
      return dayjs(dateString).format('D MMMM YYYY');
  };

  useEffect(() => {
    fetchPosts();
    fetchActiveTheme();
  }, []);

  return (
    <div
      style={{
        backgroundColor: activeTheme?.backgroundColor || "#f3f4f6",
        color: activeTheme?.textColor || "#111827",
      }}
    >
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        <div className="space-y-12">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundColor: activeTheme?.primaryColor || "#ffffff",
              }}
            >
              {post.media_urls?.[0] && (
                <img
                  src={`${API_URL}/uploads/${post.media_urls[0].url}`}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                  crossOrigin="anonymous"
                  style={{ pointerEvents: "none" }}
                />
              )}

              <div className="p-6">
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                </Link>

                <p className="mb-6">{post.content.substring(0, 200)}...</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                    >
                      <ThumbsUp
                        className={`w-6 h-6 ${isLiked ? "text-blue-600" : ""}`}
                      />
                      <span>{post.likeCount || 0}</span>
                    </button>

                    <Link
                      to={`/post/${post.id}`}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.commentCount || 0}</span>
                    </Link>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  <span className="text-sm text-gray-500">
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
