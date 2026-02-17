import axios from "axios";
import { PUBLIC_BACKEND_URL } from "@env";
import { getAppToken, removeAppToken } from "../utils/storage/authStorage";
import { navigate } from "../utils/NavigationUtils";
export const apiClient = axios.create({
  baseURL: `${'https://nanaksaramritghar.com'}/api`,
  timeout: 45000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(async config => {
  const token = await getAppToken();

  if (token) {
    config.headers['X-APP-TOKEN'] = token;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch {
        console.warn('Response is not valid JSON');
      }
    }
    return response;
  },
  error => {
    const status = error.response?.status;
    // console.log('Axios error:', {
    //   message: error.message,
    //   code: error.code,
    //   hasResponse: !!error.response,
    //   url: `${PUBLIC_BACKEND_URL}/api`,

    // });

    // 🔐 App-level auth failed
    if (status === 401 || status === 403) {
      removeAppToken();
      navigate('Splash');
    }

    // 🌐 Network issue
    // if (!error.response) {
    //   Alert.alert(
    //     'Network Error',
    //     'Please check your internet connection.'
    //   );
    // }

    return Promise.reject(error);
  }
);
export const backendUrl = `${PUBLIC_BACKEND_URL}/api`;
