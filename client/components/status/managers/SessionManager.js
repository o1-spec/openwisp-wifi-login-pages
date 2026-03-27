import axios from "axios";
import handleSession from "../../../utils/session";
import {
  getUserRadiusSessionsUrl,
  getUserRadiusUsageUrl,
} from "../../../constants";

class SessionManager {
  static async getSessions(orgSlug, authToken, cookies, params = {}) {
    const url = getUserRadiusSessionsUrl(orgSlug);
    handleSession(orgSlug, authToken, cookies);
    
    return axios({
      method: "get",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${authToken}`,
      },
      url,
      params,
    });
  }

  static async getUsage(orgSlug, authToken, cookies) {
    const url = getUserRadiusUsageUrl(orgSlug);
    handleSession(orgSlug, authToken, cookies);

    return axios({
      method: "get",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${authToken}`,
      },
      url,
    });
  }
}

export default SessionManager;
