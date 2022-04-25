import apiFactory from "../../utils/api";
import tokenService from "./token.service";

class AuthService {
  public login(email: string, password: string) {
    const data = { email, password };
    return apiFactory().post(`api/login`, data);
  }

  public logout() {
    tokenService.removeUser();
  }

  public getCurrentUser() {
    return tokenService.getUser();
  }
}

export default new AuthService();
