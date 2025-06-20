/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "../../helpers/axios";

export class PostsAPI {
    static getAllPosts = () => {
        return Axios.get("/posts");
    };

    static getOnePost = (id: string, token: string) => {
        return Axios.get(`/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    static createPost = (data: any, token: string) => {
        return Axios.post("/posts", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    static updatePost = (id: string, data: any, token: string) => {
        return Axios.put(`/posts/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    static deletePost = (id: string, token: string) => {
        return Axios.delete(`/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    static likePost = (postId: string, token: string) => {
        return Axios.put(`/posts/like/${postId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}