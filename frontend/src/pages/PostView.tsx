import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Share2, Smile } from "lucide-react";
import toast from "react-hot-toast";

const EMOJI_LIST = ["👍", "❤️", "😊", "🎉", "👏", "🔥", "💯", "🙌"];

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [activeTheme, setActiveTheme] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      fetchActiveTheme();
      incrementViewCount();
    }
  }, [id]);

  const fetchPost = async () => {

  };

  const fetchComments = async () => {

  };

  const fetchActiveTheme = async () => {

  };

  const incrementViewCount = async () => {

  };

  const handleLike = async () => {

  };

  const handleShare = async () => {

  };

  const addComment = async (emoji: string) => {

  };

  if (!post || !activeTheme) return null;

  return (
    <div
      style={{
        backgroundColor: activeTheme.background_color,
        color: activeTheme.text_color,
        minHeight: "100vh",
      }}
    >
      <div className="max-w-4xl mx-auto py-12 px-4">
        <article className="space-y-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>

          {post.media_urls?.map((url: string, index: number) => (
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
            style={{ color: activeTheme.text_color }}
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
            style={{ borderColor: activeTheme.secondary_color }}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 hover:opacity-75"
              >
                <ThumbsUp className="w-6 h-6" />
                <span>{post.like_count}</span>
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
                  <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-xl grid grid-cols-4 gap-2">
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
              <span>{post.view_count} views</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
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
