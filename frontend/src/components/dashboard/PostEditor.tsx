/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Image as ImageIcon, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { PostsAPI } from "../../services/API/Posts";
import { StoreContext } from "../../context/StoreContext";
import Illustration from "../Illustration";
import { API_URL } from "../../constants/API_URL";

const PostEditor = () => {
  const { token } = useContext(StoreContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
  });
  const [illustrations, setIllustrations] = useState<any>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleAddComponent = () => {
    if (illustrations.length < 5) {
      setIllustrations([...illustrations, { content: "", media: null }]);
    }
  };

  const handleIllustrationChange = (index: number, updatedValues: any) => {
    const updatedData = illustrations.map((item: object, i: number) =>
      i === index ? updatedValues : item
    );
    setIllustrations(updatedData);
  };

  const fetchPost = async () => {
    try {
      const response = await PostsAPI.getOnePost(id!, token!);
      setPost(response.data.post || {});
      setIllustrations(response.data.post.media_urls || []);
    } catch (error) {
      toast.error("Failed to fetch post");
      console.error("Error fetching post:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = new FormData();
    newPost.append("title", post.title);
    newPost.append("content", post.content);

    const illustrationContents = illustrations.map((i: any) => ({
      content: i.content,
    }));
    newPost.append("illustrations", JSON.stringify(illustrationContents));

    illustrations.forEach((i: any) => {
      if (i.media) {
        newPost.append("media", i.media);
      }
    });

    if (id) {
      try {
        await PostsAPI.updatePost(id, newPost, token);
        toast.success("Post updated successfully");
        navigate("/dashboard/posts");
      } catch (error) {
        toast.error("Failed to update post");
        console.error("Error updating post:", error);
      }
    } else {
      try {
        await PostsAPI.createPost(newPost, token);
        toast.success("Post saved successfully");
        navigate("/dashboard/posts");
      } catch (error) {
        toast.error("Failed to create post");
        console.error("Error creating post:", error);
      }
    }
  };

  const handleDelete = (index: number) => {
    setItemToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      setIllustrations(illustrations.filter((_, i) => i !== itemToDelete));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      toast.success("Illustration removed successfully");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {id ? "Edit Post" : "New Post"}
        </h2>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Post
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-64"
            required
          />
        </div>

        <div>
          {!id && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Illustrations
            </label>
          )}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {illustrations.map((media: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={
                    media.url
                      ? `${API_URL}/Uploads/${media.url}`
                      : media.media
                      ? URL.createObjectURL(media.media)
                      : ""
                  }
                  alt={`Media ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  crossOrigin="anonymous"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {illustrations.map((illustration: any, index: number) => (
            <Illustration
              key={index}
              index={index}
              values={illustration}
              onChange={handleIllustrationChange}
              id={id}
            />
          ))}
          {illustrations.length < 5 && !id && (
            <div className="w-full flex justify-end">
              <span
                onClick={handleAddComponent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </span>
            </div>
          )}
        </div>
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
              Are you sure you want to delete this illustration? This action
              cannot be undone.
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
    </form>
  );
};

export default PostEditor;
