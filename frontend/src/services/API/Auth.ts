/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from "../../helpers/axios";

export class AuthAPI {
  static login = (body: Record<string, any>) => {
    return Axios.post("/auth/login", body);
  };
}
