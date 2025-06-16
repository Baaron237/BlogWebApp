/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import PostEditor from "./PostEditor";
import toast from "react-hot-toast";
import { PostsAPI } from "../../services/API/Posts";
import { StoreContext } from "../../context/StoreContext";
import LoadingScreen from "../LoadingScreen";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
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

  const deletePost = async (id: string) => {
    setIsLoading(true);
    try {
      await PostsAPI.deletePost(id, token);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      {
        isLoading && <LoadingScreen />
      }
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
        <button
          onClick={() => navigate("new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="border-b last:border-0 p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`edit/${post.id}`)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PostManager = () => {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/new" element={<PostEditor />} />
      <Route path="/edit/:id" element={<PostEditor />} />
    </Routes>
  );
};

export default PostManager;
