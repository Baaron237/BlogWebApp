/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Share2, Smile } from "lucide-react";
import toast from "react-hot-toast";
import { PostsAPI } from "../services/API/Posts";
import { CommentsAPI } from "../services/API/Comments";
import { ThemesAPI } from "../services/API/Themes";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { StoreContext } from "../context/StoreContext";

dayjs.locale('fr');

const EMOJI_LIST = ["👍", "❤️", "😊", "🎉", "👏", "🔥", "💯", "🙌"];

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
  const [comments, setComments] = useState([]);


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
      setActiveTheme(response.data?.theme || null);
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
    // if (!post) return;

    // const { error } = await supabase
    //   .from("posts")
    //   .update({ like_count: post.like_count + 1 })
    //   .eq("id", post.id);

    // if (error) {
    //   toast.error("Failed to like post");
    //   return;
    // }

    fetchPost();
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

  const addComment = async (emoji: string) => {
    try {
      await CommentsAPI.createComment({
        postId: id,
        emoji: emoji,
      });

      fetchComments();
      setShowEmojiPicker(false);
      toast.success("Comment added!");

    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format('D MMMM YYYY');
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      fetchActiveTheme();
      incrementViewCount();
    }
  }, [id]);

  if (!post || !activeTheme) return null;

  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.textColor,
        minHeight: "100vh",
      }}
      onClick={showEmojiPicker ? () => setShowEmojiPicker(false) : undefined}
    >
      <div className="max-w-4xl mx-auto py-12 px-4">
        <article className="space-y-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>

          {post.mediaUrls?.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full rounded-xl shadow-lg"
              style={{ pointerEvents: "none" }}
            />
          ))}

          <div
            className="prose max-w-none"
            style={{ color: activeTheme.textColor }}
          >
            {post.content
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
          </div>

          <div
            className="flex items-center justify-between py-6 border-t border-b"
            style={{ borderColor: activeTheme.secondaryColor }}
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
                  <div className="absolute w-44 top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-xl grid grid-cols-4 gap-2">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addComment(emoji)}
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
              <span>{formatDate(post.created_at)}</span>
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
                  {comment.emoji}
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostView;
