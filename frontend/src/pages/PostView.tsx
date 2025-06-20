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
import toast from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { CommentsAPI } from "../services/API/Comments";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { StoreContext } from "../context/StoreContext";
import { API_URL } from "../constants/API_URL";

dayjs.locale("fr");

const EMOJI_LIST = [
  "👍",
  "❤️",
  "😊",
  "🎉",
  "👏",
  "🔥",
  "💯",
  "🙌",
  "😂",
  "😍",
  "🤔",
  "😢",
  "🎵",
  "🌟",
  "🥳",
  "😎",
  "🤗",
  "😴",
  "😭",
  "😡",
  "🤓",
  "😱",
  "🤯",
  "😴",
  "🤮",
  "🤠",
  "😷",
  "🤢",
  "😳",
  "🥺",
  "🙄",
  "😬",
  "🤥",
  "😶",
  "😐",
  "😕",
  "😏",
  "😚",
  "😋",
  "😜",
  "🤪",
  "😝",
  "🤤",
  "😈",
  "👿",
  "👹",
  "💀",
  "☠️",
  "👽",
  "🤖",
  "🎃",
  "👻",
  "🦇",
  "🕷️",
  "🌹",
  "💐",
  "🌷",
  "🌸",
  "🌺",
  "🌼",
  "🌻",
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍕",
  "🍔",
  "🍟",
  "🌮",
  "🍣",
  "🍩",
  "🎂",
  "🍰",
  "☕",
  "🍺",
  "🍷",
  "🍹",
  "🎧",
  "📱",
  "💻",
  "🎮",
  "📸",
  "🎬",
  "🎤",
  "🎸",
  "🎹",
  "🎻",
  "🏀",
  "⚽",
  "🏈",
  "🏊",
  "🏋️",
  "🚗",
  "🚀",
  "✈️",
  "⛵",
  "🏝️",
  "🌍",
  "🌕",
  "🌞",
  "🌝",
  "🌈",
  "⚡",
  "💥",
  "⭐",
  "🌟",
  "💫",
  "💧",
  "🔥",
  "💨",
  "❄️",
  "🌬️",
  "🍂",
  "🍁",
  "🎄",
  "🎅",
  "🔔",
  "🎁",
  "🎆",
  "🎇",
  "💖",
  "💕",
  "💞",
  "💓",
  "💗",
  "💙",
  "💚",
  "💛",
  "💜",
  "🖤",
  "💔",
  "💌",
  "💍",
  "💎",
];

type Post = {
  id: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  likeCount: number;
  viewCount: number;
  createdAt: string;
  [key: string]: any;
};

type Theme = {
  backgroundColor: string;
  textColor: string;
  secondaryColor?: string;
  [key: string]: any;
};

type Reaction = {
  emoji: string;
  count: number;
};

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");

  const fetchPost = async () => {
    try {
      const response = await PostsAPI.getOnePost(id!);
      setPost(response.data.post || {});
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await CommentsAPI.getAllComments(id!);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchReactions = async () => {
    try {
      const response = await PostsAPI.getReactions(id!);
      setReactions(response.data.reactions || []);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  const fetchActiveTheme = async () => {
    try {
      const response = await ThemesAPI.getActiveTheme();
      if (response.data?.theme) {
        setActiveTheme(response.data.theme);
      } else {
        console.warn("No active theme found, using default theme.");
        setActiveTheme(null);
      }
    } catch (error) {
      console.error("Error fetching active theme:", error);
    }
  };

  const incrementViewCount = async () => {
    try {
      await PostsAPI.incrementViewPost(id!);
      fetchPost();
    } catch (error) {
      console.error("Error increment view:", error);
    }
  };

  const handleLike = async () => {
    // fetchPost();
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
      setShowShareMenu(false);
    } catch (err) {
      console.error(`Failed to share on ${platform}:`, err);
      toast.error(`Failed to share on ${platform}`);
    }
  };

  const handleEmojiSelect = async (emoji: string) => {
    try {
      await PostsAPI.addReaction(id!, emoji);
      fetchReactions();
      setShowEmojiPicker(false);
      toast.success("Reaction added!");
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  const handleCommentEmojiSelect = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await CommentsAPI.createComment({
        postId: id,
        text: commentText,
      });

      fetchComments();
      setCommentText("");
      setShowCommentEmojiPicker(false);
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format("D MMMM YYYY");
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      fetchReactions();
      fetchActiveTheme();
      incrementViewCount();
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
      <div className="max-w-4xl mx-auto py-12 px-4">
        <article className="space-y-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div
            className="prose max-w-none"
            style={{ color: activeTheme?.textColor }}
          >
            {post.content
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
          </div>

          {post.mediaUrls?.map((media: any, index: number) => (
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
                  className="w-full rounded-xl shadow-lg object-cover h-full"
                  style={{ pointerEvents: "none" }}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          ))}

          <div
            className="flex items-center justify-between py-6 border-t border-b"
            style={{ borderColor: activeTheme?.secondaryColor || "#e5e7eb" }}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 hover:opacity-75"
              >
                <ThumbsUp className="w-6 h-6" />
                <span>{post.likeCount}</span>
              </button>

              <div className="relative">
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
                  <span>{totalReactions}</span>
                </button>

                {showEmojiPicker && (
                  <div className="absolute w-44 top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-xl grid grid-cols-4 gap-2 overflow-y-auto max-h-64">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-2xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {showReactionDetails && (
                  <div className="absolute w-44 top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-xl">
                    {reactions.length > 0 ? (
                      reactions.map((reaction) => (
                        <div
                          key={reaction.emoji}
                          className="flex items-center justify-between text-lg"
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
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
                  className="flex items-center space-x-2 hover:opacity-75"
                >
                  <Share2 className="w-6 h-6" />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute w-48 top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-xl flex flex-col gap-2">
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                    >
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("x")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                    >
                      <X className="w-5 h-5" />
                      <span>X</span>
                    </button>
                    <button
                      onClick={() => handleShare("instagram")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                    >
                      <Instagram className="w-5 h-5" />
                      <span>Instagram</span>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare("reddit")}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                    >
                      <Link className="w-5 h-5" />
                      <span>Reddit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm opacity-75">
              <span>{post.viewCount} views</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {reactions.map((reaction) => (
              <div
                key={reaction.emoji}
                className="text-xl bg-white bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center"
              >
                {reaction.emoji}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comments</h3>
            <div className="flex flex-wrap gap-2">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="text-lg bg-white bg-opacity-10 rounded-lg p-2"
                >
                  {comment.text}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{
                  color: activeTheme?.textColor,
                  backgroundColor: activeTheme?.backgroundColor || "#f3f4f6",
                }}
                rows={2}
              />
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCommentEmojiPicker(!showCommentEmojiPicker);
                    setShowEmojiPicker(false);
                    setShowReactionDetails(false);
                    setShowShareMenu(false);
                  }}
                  className="hover:opacity-75"
                >
                  <Smile className="w-6 h-6" />
                </button>
                {showCommentEmojiPicker && (
                  <div className="absolute w-44 top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl grid grid-cols-4 gap-2 overflow-y-auto max-h-64">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleCommentEmojiSelect(emoji)}
                        className="text-2xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={addComment}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                disabled={!commentText.trim()}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostView;
