import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchActiveTheme();
  }, []);

  const fetchPosts = async () => {

  };

  const fetchActiveTheme = async () => {

  };

  const handleLike = async (postId: string) => {

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

  return (
    <div
      style={{
        backgroundColor: activeTheme?.background_color || "#f3f4f6",
        color: activeTheme?.text_color || "#111827",
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
                backgroundColor: activeTheme?.primary_color || "#ffffff",
              }}
            >
              {post.media_urls?.[0] && (
                <img
                  src={post.media_urls[0]}
                  alt={post.title}
                  className="w-full h-64 object-cover"
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
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.like_count || 0}</span>
                    </button>

                    <Link
                      to={`/post/${post.id}`}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comment_count || 0}</span>
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
                    {new Date(post.created_at).toLocaleDateString()}
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
