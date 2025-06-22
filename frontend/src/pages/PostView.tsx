/* eslint-disable @typescript-eslint/no-explicit-any */
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
import toast, { Toaster } from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { CommentsAPI } from "../services/API/Comments";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { API_URL } from "../constants/API_URL";
import { Post, Theme } from "../types";
import { StoreContext } from "../context/StoreContext";



dayjs.locale("en");

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { token, user } = useContext(StoreContext)
  const [reactionCount, setReactionCount] = useState(0);

  const fetchPost = async () => {
    if (!id || !token) return;
    try {
      const response = await PostsAPI.getOnePost(id!, token!);

      setReactionCount(response.data.post.reactionsByUsers?.length || 0);
      const hasLiked = response.data.post.likedByUsers.some(u => u.id === user.id);
      
      setIsLiked(hasLiked);

      setPost(response.data.post || {});
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

  const handleEmojiSelect = async (emoji: string ) => {
    if (!id) return;
    try {
      await PostsAPI.addReaction(id!, emoji, token!);
      fetchPost();
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
      fetchActiveTheme();
    }
  }, [id]);

  if (!post) return null;


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

          {post.media_urls?.map((media: any, index: number) => (
            <div key={index}>
              {media.content
                .split("\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="mb-2"
                    style={{ color: activeTheme?.textColor }}
                  >
                    {paragraph}
                  </p>
                ))}
              <div className="h-96">
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
                {
                  (post.reactionsByUsers?.length ?? 0) > 0 ? (
                    <button
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowReactionDetails(false);
                        setShowCommentEmojiPicker(false);
                        setShowShareMenu(false);
                      }}
                      className="flex justify-between items-center hover:opacity-75"
                    >
                      <p className="text-lg mr-4 flex">
                        <span className="z-30">
                          {post.reactionsByUsers?.[0]?.Reaction.emoji}
                        </span>
                        <span className="z-20 !-ml-2">
                          {post.reactionsByUsers?.[1]?.Reaction.emoji}
                        </span>
                        <span className=" !-ml-3">
                          {post.reactionsByUsers?.[2]?.Reaction.emoji}
                        </span>
                      </p>
                      <p>{reactionCount}</p>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowReactionDetails(false);
                        setShowCommentEmojiPicker(false);
                        setShowShareMenu(false);
                      }}
                      className="flex items-center space-x-2 hover:opacity-75"
                    >
                      <Smile className="w-6 h-6" />
                      <span>{reactionCount}</span>
                    </button>
                  ) 
                }

                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 max-h-[70vh] overflow-y-auto">
                    <Picker onEmojiClick={handleEmojiSelect} />
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


          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comments</h3>
            <div className="flex flex-col flex-wrap gap-2">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="text-lg bg-gray-400 bg-opacity-10 rounded-lg p-2 w-full"
                >
                  <p className="text-gray-500 text-sm">{comment.author.username}</p>
                  <p className="ml-3 my-1">{comment.message}</p>
                  <p className="text-gray-500 text-[12px]">{formatDate(comment.created_at)}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-1 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
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
