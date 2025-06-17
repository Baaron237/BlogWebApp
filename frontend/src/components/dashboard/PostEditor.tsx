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
  const { token } = useContext(StoreContext)
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    media_urls: [] as string[],
  });

  const [illustrations, setIllustrations] = useState<any>([]);

  const handleAddComponent = () => {  
    if(illustrations.length < 5) {
      setIllustrations([...illustrations, { content: "", media: null }]);
    }
  }

 const handleIllustrationChange = (index: number, updatedValues: any) => {
        const updatedData = illustrations.map((item: object, i: number) => (i === index ? updatedValues : item));
        setIllustrations(updatedData);
    };

  const fetchPost = async () => {
    try {
      const response = await PostsAPI.getOnePost(id!);
      setPost(response.data.post || {});
    } catch (error) {
      toast.error("Failed to fetch post");
      console.error("Error fetching post:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id) {
      try {
        await PostsAPI.updatePost(id, post, token);
        toast.success("Post updated successfully");
        navigate("/dashboard/posts");
      } catch (error) {
        toast.error("Failed to update post");
        console.error("Error updating post:", error);
      }
    } else {
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
          {
            !id && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Illustrations
              </label>
            )
          }
          <div className="grid grid-cols-4 gap-4 mb-4">
            {post.media_urls?.map((media: any, index: number) => (
              <div key={media.id} className="relative">
                <img
                  src={`${API_URL}/uploads/${media.url}`}
                  alt={`Media ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  crossOrigin="anonymous"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPost({
                      ...post,
                      media_urls: post.media_urls.filter((_, i) => i !== index),
                    })
                  }
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {/* <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Add Media</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              // onChange={handleMediaUpload}
            />
          </label> */}
          {
            illustrations.map((illustration: any, index: number) => (
              <Illustration
                key={index}
                index={index}
                values={illustration}
                onChange={handleIllustrationChange}
              />
            ))
          }
          {
            (illustrations.length  < 5 && !id ) && (
              <div className="w-full flex justify-end">
                  <span onClick={handleAddComponent} className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer'>
                      <Plus className="w-5 h-5" />
                  </span>
              </div>
            ) 
          }
        </div>
      </div>
    </form>
  );
};

export default PostEditor;
