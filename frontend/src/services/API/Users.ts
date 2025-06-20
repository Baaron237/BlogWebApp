/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "../../helpers/axios";

export class UsersAPI {
    static getAllUsers = (token: string) => {
        return Axios.get("/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };
    
    static getOneUser = (id: string, token: string) => {
        return Axios.get(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };
    
    static deleteUser = (id: string, token: string) => {
        return Axios.delete(`/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    };
}
