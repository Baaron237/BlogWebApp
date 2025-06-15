import React, { useEffect, useState } from "react";
import { BarChart, Users, ThumbsUp, MessageCircle } from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    popularPosts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [viewsData, commentsData, postsData] = await Promise.all([
        supabase
          .from("posts")
          .select("view_count, like_count")
          .order("view_count", { ascending: false }),
        supabase.from("comments").select("count", { count: "exact" }),
        supabase
          .from("posts")
          .select("title, view_count, like_count")
          .order("view_count", { ascending: false })
          .limit(5),
      ]);

      const totalViews =
        viewsData.data?.reduce((sum, post) => sum + post.view_count, 0) || 0;
      const totalLikes =
        viewsData.data?.reduce((sum, post) => sum + post.like_count, 0) || 0;

      setStats({
        totalViews,
        totalLikes,
        totalComments: commentsData.count || 0,
        popularPosts: postsData.data || [],
      });
    };

    fetchStats();
  }, []);

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
          {stats.popularPosts.map((post: any) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
            >
              <span className="text-gray-800">{post.title}</span>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <BarChart className="w-4 h-4 mr-1" />
                  {post.view_count}
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {post.like_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
