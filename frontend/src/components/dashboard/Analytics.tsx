/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { BarChart, Users, ThumbsUp, MessageCircle } from "lucide-react";
import { AnalyticsAPI } from "../../services/API/Analytics";
import { StoreContext } from "../../context/StoreContext";
import { Post } from "../../types";
import { PostsAPI } from "../../services/API/Posts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const { token, setIsLoading } = useContext(StoreContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    popularPosts: [],
  });

  const navigate = useNavigate();

  const fetchStats = async () => {
      try{
        const response = await AnalyticsAPI.getAnalytics(token);
        
        setStats(prev => {
          return {
            totalViews: response.data.totalViews,
            totalLikes: response.data.totalLikes,
            totalComments: response.data.totalComments,
            popularPosts: response.data.popularPosts,
          };
        });

      }catch (error) {
        
        console.error("Error fetching analytics:", error);

      }
    };

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await PostsAPI.getAllPosts();
        const sortedPosts = response.data.posts.sort((a: any, b: any) => b.likeCount - a.likeCount);
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    const detailsPost = (postId: string) => {
      navigate(`/post/${postId}`);
    }


  useEffect(() => {
    if (!token) return;

    fetchStats();
    fetchPosts();
  }, [token]);



  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BarChart className="w-10 h-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalViews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ThumbsUp className="w-10 h-10 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalLikes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <MessageCircle className="w-10 h-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalComments}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Popular Posts
        </h3>
        <div className="space-y-4">
          {posts.length > 0 ? 
            posts.map((post: any) => (
              <div
                key={post.id}
                onClick={() => detailsPost(post.id)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 border-b cursor-pointer"
              >
                <span className="text-gray-800">{post.title}</span>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <BarChart className="w-4 h-4 mr-1" />
                    {post.viewCount}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {post.likeCount}
                  </span>
                </div>
              </div>
            )) 
            : 
              <p className="text-gray-500">No posts available</p>
            }
        </div>
      </div>
    </div>
  );
};

export default Analytics;
