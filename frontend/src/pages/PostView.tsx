import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  Share2,
  Smile,
  Send,
  MessageCircle,
  Facebook,
  X,
  Instagram,
  Linkedin,
  Link,
} from "lucide-react";
import Picker from "emoji-picker-react";
import toast, { Toaster } from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { CommentsAPI } from "../services/API/Comments";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { API_URL } from "../constants/API_URL";
import { StoreContext } from "../context/StoreContext";

interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrls?: { url: string; content: string }[];
  likeCount: number;
  viewCount: number;
  created_at: Date;
}

interface Comment {
  id: string;
  message: string;
  author: { username: string; profilePicture?: string };
  created_at: Date;
}

interface Reaction {
  emoji: string;
  count: number;
}

interface Theme {
  backgroundColor: string;
  textColor: string;
  secondaryColor: string;
}

dayjs.locale("en");

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { token } = useContext(StoreContext);

  const fetchPost = async () => {
    if (!id || !token) return;
    try {
      const response = await PostsAPI.getOnePost(id, token);
      setPost(response.data.post || null);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    try {
      const response = await CommentsAPI.getAllComments(id);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const fetchReactions = async () => {
    if (!id) return;
    try {
      const response = await PostsAPI.getReactions(id);
      setReactions(response.data.reactions || []);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      toast.error("Failed to load reactions");
    }
  };

  const fetchActiveTheme = async () => {
    try {
      const response = await ThemesAPI.getActiveTheme();
      setActiveTheme(response.data?.theme || null);
    } catch (error) {
      console.error("Error fetching active theme:", error);
      toast.error("Failed to load theme");
    }
  };

  const handleLike = async () => {
    if (!id || !token) return;
    try {
      const response = await PostsAPI.likePost(id, token);
      setIsLiked(response.data.liked);
      fetchPost();
      toast.success(response.data.liked ? "Post liked!" : "Like removed");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;

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
      setShowShareMenu(false);
    } catch (err) {
      console.error(`Failed to share on ${platform}:`, err);
      toast.error(`Failed to share on ${platform}`);
    }
  };

  const handleEmojiSelect = async (emojiData: { emoji: string }) => {
    if (!id) return;
    try {
      await PostsAPI.addReaction(id, emojiData.emoji);
      fetchReactions();
      setShowEmojiPicker(false);
      toast.success("Reaction added!");
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  const handleCommentEmojiSelect = (emojiData: { emoji: string }) => {
    setCommentText((prev) => prev + emojiData.emoji);
    setShowCommentEmojiPicker(false);
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!id || !token) return;

    try {
      await CommentsAPI.createComment(
        {
          postId: id,
          message: commentText,
        },
        token
      );
      fetchComments();
      setCommentText("");
      setShowCommentEmojiPicker(false);
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const formatDate = (date: Date) => {
    return dayjs(date).format("MMMM D, YYYY");
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      fetchReactions();
      fetchActiveTheme();
    }
  }, [id]);

  if (!post) return null;

  const totalReactions = reactions.reduce(
    (sum, reaction) => sum + reaction.count,
    0
  );

  return (
    <div
      style={{
        backgroundColor: activeTheme?.backgroundColor || "#f3f4f6",
        color: activeTheme?.textColor || "#111827",
        minHeight: "100vh",
      }}
      onClick={
        showEmojiPicker ||
        showCommentEmojiPicker ||
        showReactionDetails ||
        showShareMenu
          ? () => {
              setShowEmojiPicker(false);
              setShowCommentEmojiPicker(false);
              setShowReactionDetails(false);
              setShowShareMenu(false);
            }
          : undefined
      }
    >
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="space-y-6 bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <div
            className="prose max-w-none"
            style={{ color: activeTheme?.textColor }}
          >
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
          {post.mediaUrls?.map((media, index) => (
            <div key={index} className="space-y-4">
              {media.content.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="mb-2 text-gray-700"
                  style={{ color: activeTheme?.textColor }}
                >
                  {paragraph}
                </p>
              ))}
              <div className="h-64 sm:h-80">
                <img
                  src={`${API_URL}/Uploads/${media.url}`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full rounded-xl shadow-lg object-cover"
                  style={{ pointerEvents: "none" }}
                  crossOrigin="anonymous"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/600x400")
                  }
                />
              </div>
            </div>
          ))}
          <div
            className="flex items-center justify-between py-4 border-t border-b"
            style={{ borderColor: activeTheme?.secondaryColor || "#e5e7eb" }}
          >
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <ThumbsUp
                  className={`w-5 h-5 ${
                    isLiked ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                <span className="text-sm">{post.likeCount} Likes</span>
              </button>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowReactionDetails(false);
                    setShowCommentEmojiPicker(false);
                    setShowShareMenu(false);
                  }}
                  className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
                  aria-label="Open emoji picker for reactions"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">{totalReactions} Reactions</span>
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 max-h-[70vh] overflow-y-auto">
                    <Picker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReactionDetails(!showReactionDetails);
                    setShowEmojiPicker(false);
                    setShowCommentEmojiPicker(false);
                    setShowShareMenu(false);
                  }}
                  className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
                  aria-label="View reaction details"
                >
                  <span className="text-sm text-gray-600">Details</span>
                </button>
                {showReactionDetails && (
                  <div className="absolute w-44 top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl">
                    {reactions.length > 0 ? (
                      reactions.map((reaction) => (
                        <div
                          key={reaction.emoji}
                          className="flex items-center justify-between text-base py-1"
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-gray-600">
                            {reaction.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No reactions yet</p>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareMenu(!showShareMenu);
                    setShowEmojiPicker(false);
                    setShowCommentEmojiPicker(false);
                    setShowReactionDetails(false);
                  }}
                  className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
                  aria-label="Open share menu"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Share</span>
                </button>
                {showShareMenu && (
                  <div className="absolute w-44 top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-xl flex flex-col gap-1">
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                      aria-label="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 text-gray-600" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("x")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                      aria-label="Share on X"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                      <span>X</span>
                    </button>
                    <button
                      onClick={() => handleShare("instagram")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                      aria-label="Share on Instagram"
                    >
                      <Instagram className="w-4 h-4 text-gray-600" />
                      <span>Instagram</span>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-gray-600" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare("reddit")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded text-sm"
                      aria-label="Share on Reddit"
                    >
                      <Link className="w-4 h-4 text-gray-600" />
                      <span>Reddit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{post.viewCount} views</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {reactions.map((reaction) => (
              <div
                key={reaction.emoji}
                className="text-lg bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                aria-label={`Reaction ${reaction.emoji}`}
              >
                {reaction.emoji}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
            <div className="flex flex-col gap-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-3 bg-gray-100 bg-opacity-50 rounded-lg p-3"
                  >
                    <img
                      src={
                        comment.author.profilePicture ||
                        "https://via.placeholder.com/32"
                      }
                      alt={`Avatar of ${comment.author.username}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-base text-gray-800">
                        {comment.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {comment.author.username} •{" "}
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                style={{
                  color: activeTheme?.textColor || "#111827",
                  backgroundColor: activeTheme?.backgroundColor || "#f3f4f6",
                }}
                rows={2}
                aria-label="Field to add a comment"
              />
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommentEmojiPicker(!showCommentEmojiPicker);
                    setShowEmojiPicker(false);
                    setShowReactionDetails(false);
                    setShowShareMenu(false);
                  }}
                  className="hover:opacity-75 transition-opacity"
                  aria-label="Open emoji picker for comments"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                {showCommentEmojiPicker && (
                  <div className="absolute top-full right-0 mt-2 z-50 max-h-[70vh] overflow-y-auto">
                    <Picker onEmojiClick={handleCommentEmojiSelect} />
                  </div>
                )}
              </div>
              <button
                onClick={addComment}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={!commentText.trim()}
                aria-label="Submit comment"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </article>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default PostView;
