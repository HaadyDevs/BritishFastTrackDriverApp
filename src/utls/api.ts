// api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = 'https://britishfasttrack.co.uk/admin/backend/web/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// // Optional: auth token interceptor
// api.interceptors.request.use(async (config) => {
//   // const token = await getToken();
//   // if (token) {
//   //   config.headers.Authorization = `Bearer ${token}`;
//   // }
//   return config;
// });

export interface ApiResponse<T> {
  status: "success" | "failed";
  data: T | null;
  error: string | null;
}

const handleRequest = async <T>(
  method: () => Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await method();
    if(response.status === 200) {
        return { status: "success", data: response.data, error: null };
    } else {
        return { status: "failed", data: response.data, error: null };
    }
        
  } catch (error: any) {
    let message = 'Something went wrong';

    if (error.response) {
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.statusText;
    } else if (error.request) {
      message = 'No response from server';
    } else {
      message = error.message;
    }

    return { status: "failed", data: null, error: message };
  }
};

const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    handleRequest<T>(() => api.get(url, config)),

  postForm: <T>(url: string, formData: FormData) =>
    handleRequest<T>(() =>
      api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),

  putForm: <T>(url: string, formData: FormData) =>
    handleRequest<T>(() =>
      api.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),

  patchForm: <T>(url: string, formData: FormData) =>
    handleRequest<T>(() =>
      api.patch(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),

  delete: <T>(url: string) =>
    handleRequest<T>(() => api.delete(url)),
};

export default apiClient;
