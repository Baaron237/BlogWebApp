import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Share2, Smile, Send } from "lucide-react";
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

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const handleShare = async () => {
    if (!post) return;

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

  const handleEmojiSelect = (emoji: string) => {
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
      setShowEmojiPicker(false);
      setCommentText("");
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
      fetchActiveTheme();
      incrementViewCount();
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
      onClick={showEmojiPicker ? () => setShowEmojiPicker(false) : undefined}
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
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 hover:opacity-75"
                >
                  <Smile className="w-6 h-6" />
                  <span>{comments.length}</span>
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
              </div>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 hover:opacity-75"
              >
                <Share2 className="w-6 h-6" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm opacity-75">
              <span>{post.viewCount} views</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comments</h3>
            <div className="flex flex-wrap gap-2">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="text-2xl bg-white bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center"
                >
                  {comment.emoji || comment.text}
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
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="hover:opacity-75"
              >
                <Smile className="w-6 h-6" />
              </button>
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
