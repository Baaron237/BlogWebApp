import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import PostEditor from "./PostEditor";
import toast from "react-hot-toast";
import { PostsAPI } from "../../services/API/Posts";
import { StoreContext } from "../../context/StoreContext";
import LoadingScreen from "../LoadingScreen";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { isLoading, setIsLoading, token } = useContext(StoreContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await PostsAPI.getAllPosts();
      setPosts(response.data?.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setPostToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsLoading(true);
    try {
      await PostsAPI.deletePost(postToDelete, token);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format("D MMMM YYYY");
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      {isLoading && <LoadingScreen />}
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
                {formatDate(post.created_at)}
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
                onClick={() => handleDelete(post.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the post "
              {posts.find((post: any) => post.id === postToDelete)?.title ||
                "Unknown"}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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
