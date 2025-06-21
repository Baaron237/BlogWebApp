import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Facebook,
  X,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  MessageSquare,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { StoreContext } from "../context/StoreContext";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { API_URL } from "../constants/API_URL";

type Theme = {
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  [key: string]: any;
};

type Reaction = {
  count: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  media_urls?: { url: string }[];
  likeCount: number;
  commentCount: number;
  created_at: string;
  reactions?: Reaction[];
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const { isLoading, setIsLoading, token } = useContext(StoreContext);

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
      toast.error("Failed to load theme");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    if (!token) return;
    try {
      const response = await PostsAPI.likePost(id, token);
      setLikedPosts((prev) => ({ ...prev, [id]: response.data.liked }));
      fetchPosts();
      toast.success(response.data.liked ? "Post liked!" : "Like removed");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handlePlatformShare = (platform: string, post: Post) => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = `${post.title} - ${post.content.substring(0, 100)}...`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "x":
        url = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "instagram":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied! Open Instagram to paste it.");
        url = "https://www.instagram.com";
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "reddit":
        url = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(
          post.title
        )}`;
        break;
      case "native":
        navigator
          .share({
            title: post.title,
            text: shareText,
            url: shareUrl,
          })
          .catch((err) => console.error("Native share failed:", err));
        setShareMenuOpen((prev) => ({ ...prev, [post.id]: false }));
        return;
      default:
        return;
    }

    try {
      window.open(url, "_blank");
      if (platform !== "instagram") {
        toast.success(
          `Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`
        );
      }
      setShareMenuOpen((prev) => ({ ...prev, [post.id]: false }));
    } catch (err) {
      console.error(`Failed to share on ${platform}:`, err);
      toast.error(`Failed to share on ${platform}`);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  useEffect(() => {
    fetchPosts();
    fetchActiveTheme();
  }, []);

  const totalReactions = (post: Post) => {
    return (
      post.reactions?.reduce((sum, reaction) => sum + reaction.count, 0) || 0
    );
  };

  return (
    <div
      style={{
        backgroundColor: activeTheme?.backgroundColor || "#f3f4f6",
        color: activeTheme?.textColor || "#111827",
        minHeight: "100vh",
      }}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest(".share-menu")) {
          setShareMenuOpen({});
        }
      }}
    >
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-12 sm:text-4xl">Blog</h1>
        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundColor: activeTheme?.primaryColor || "#ffffff",
              }}
            >
              {post.media_urls?.[0] && (
                <img
                  src={`${API_URL}/Uploads/${post.media_urls[0].url}`}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                  crossOrigin="anonymous"
                  style={{ pointerEvents: "none" }}
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/600x400")
                  }
                />
              )}
              <div className="p-6">
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-2xl font-bold mb-4 hover:text-blue-600">
                    {post.title}
                  </h2>
                </Link>
                <p className="mb-6 text-gray-700">
                  {post.content.substring(0, 200)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      aria-label={
                        likedPosts[post.id] ? "Unlike post" : "Like post"
                      }
                    >
                      <ThumbsUp
                        className={`w-5 h-5 ${
                          likedPosts[post.id] ? "text-blue-600" : ""
                        }`}
                      />
                      <span className="text-sm">
                        {post.likeCount || 0} Likes
                      </span>
                    </button>
                    <Link
                      to={`/post/${post.id}`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      aria-label="View comments"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">
                        {post.commentCount || 0} Comments
                      </span>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareMenuOpen((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }));
                        }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="Open share menu"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                      </button>
                      {shareMenuOpen[post.id] && (
                        <div className="share-menu absolute w-44 top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl flex flex-col gap-1 z-50 max-h-[70vh] overflow-y-auto">
                          <button
                            onClick={() =>
                              handlePlatformShare("whatsapp", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Share on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() =>
                              handlePlatformShare("facebook", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Share on Facebook"
                          >
                            <Facebook className="w-4 h-4 text-gray-600" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handlePlatformShare("x", post)}
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Share on X"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                            <span>X</span>
                          </button>
                          <button
                            onClick={() =>
                              handlePlatformShare("instagram", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Share on Instagram"
                          >
                            <Instagram className="w-4 h-4 text-gray-600" />
                            <span>Instagram</span>
                          </button>
                          <button
                            onClick={() =>
                              handlePlatformShare("linkedin", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Share on LinkedIn"
                          >
                            <Linkedin className="w-4 h-4 text-gray-600" />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={() => handlePlatformShare("reddit", post)}
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Share on Reddit"
                          >
                            <LinkIcon className="w-4 h-4 text-gray-600" />
                            <span>Reddit</span>
                          </button>
                          <button
                            onClick={() => handlePlatformShare("native", post)}
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                            aria-label="Native Share"
                          >
                            <Share2 className="w-4 h-4 text-gray-600" />
                            <span>Native Share</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {totalReactions(post)} Reactions
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Blog;
