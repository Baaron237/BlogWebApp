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
import toast from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { StoreContext } from "../context/StoreContext";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { API_URL } from "../constants/API_URL";

dayjs.locale("fr");

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

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<{
    [key: string]: boolean;
  }>({});
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
        toast.success(
          "Link copied! Open Instagram to paste it in a Story or message."
        );
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
        setShowShareMenu({ ...showShareMenu, [post.id]: false });
        return;
      default:
        return;
    }

    try {
      window.open(url, "_blank");
      if (platform !== "instagram") {
        toast.success(
          `Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`
        );
      }
      setShowShareMenu({ ...showShareMenu, [post.id]: false });
    } catch (err) {
      console.error(`Failed to share on ${platform}:`, err);
      toast.error(`Failed to share on ${platform}`);
    }
  };

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format("D MMMM YYYY");
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
      }}
      onClick={() => setShowShareMenu({})}
    >
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
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
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareMenu({
                            ...showShareMenu,
                            [post.id]: !showShareMenu[post.id],
                          });
                        }}
                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                      {showShareMenu[post.id] && (
                        <div className="absolute w-48 top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl flex flex-col gap-2 z-10">
                          <button
                            onClick={() =>
                              handlePlatformShare("whatsapp", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() =>
                              handlePlatformShare("facebook", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <Facebook className="w-5 h-5" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handlePlatformShare("x", post)}
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <X className="w-5 h-5" />
                            <span>X</span>
                          </button>
                          <button
                            onClick={() =>
                              handlePlatformShare("instagram", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <Instagram className="w-5 h-5" />
                            <span>Instagram</span>
                          </button>
                          <button
                            onClick={() =>
                              handlePlatformShare("linkedin", post)
                            }
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={() => handlePlatformShare("reddit", post)}
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <LinkIcon className="w-5 h-5" />
                            <span>Reddit</span>
                          </button>
                          <button
                            onClick={() => handlePlatformShare("native", post)}
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                          >
                            <Share2 className="w-5 h-5" />
                            <span>Native Share</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      Reactions: {totalReactions(post)}
                    </span>
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
