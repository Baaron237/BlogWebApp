/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "../../helpers/axios";

export class AnalyticsAPI {
  static getAnalytics = (token: string) => {
    return Axios.get("/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

}