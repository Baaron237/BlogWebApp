/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "../../helpers/axios";

export class ThemesAPI {
    static getAllThemes = () => {
        return Axios.get("/themes");
    };

    static createTheme = (data: any, token: string) => {
        return Axios.post("/themes", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    static updateTheme = (id: string, data: any, token: string) => {
        return Axios.put(`/themes/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    static getActiveTheme = () => {
        return Axios.get("/themes/activedTheme");
    };

    static deleteTheme = (id: string, token: string) => {
        return Axios.delete(`/themes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

}