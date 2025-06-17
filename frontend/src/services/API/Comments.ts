/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "../../helpers/axios";

export class CommentsAPI {
    static getAllComments = (postId: string) => {
        return Axios.get(`/comments/${postId}`);
    };


    static createComment = (data: any) => {
        return Axios.post("comments/", data);
    }

}