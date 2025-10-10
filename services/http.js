import axios from "axios";
import { store } from "@/redux/store";

function getToken() {
  const cname = "token";
  if (typeof window !== "undefined") {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  return "";
}

// ✅ new function to get token from redux
function getTokenFromRedux() {
  const state = store.getState();
  return state.user?.user?.token || "";
}

// ✅ new function to get frontend domain
function getFrontendDomain() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_URL || "";
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BASE_URL;

const http = axios.create({
  baseURL: baseURL + `/api`,
  timeout: 30000,
});

http.interceptors.request.use(
  (config) => {
    const token = getTokenFromRedux() || getToken();
    const frontendDomain = getFrontendDomain();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add frontend domain to headers
    if (frontendDomain) {
      config.headers["X-Frontend-Domain"] = frontendDomain;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
