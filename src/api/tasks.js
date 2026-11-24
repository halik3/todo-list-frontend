import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: Menyisipkan token JWT ke setiap request jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Menangani error response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "?";
    const status = error.response?.status ?? "network";
    console.error(`[api] ${error.config?.method?.toUpperCase()} ${url} → ${status}`, error);
    
    // Jika token expired atau tidak valid (401), paksa logout
    if (status === 401 && !url.includes("/login")) {
      localStorage.removeItem("token");
      window.location.reload(); 
    }
    return Promise.reject(error);
  }
);

//FUNGSI AUTHENTICATION 
export const loginUser = async (email, password) => {
  // Standar OAuth2 FastAPI menggunakan FormData
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

export const registerUser = async (email, password) => {
  const response = await api.post("/register", { email, password });
  return response.data;
};

// FUNGSI TASKS 
export const getTasks     = () => api.get("/tasks/").then((r) => r.data);
export const getTask      = (id) => api.get(`/tasks/${id}`).then((r) => r.data);
export const createTask   = (data) => api.post("/tasks/", data).then((r) => r.data);
export const updateTask   = (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data);
export const deleteTask   = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`).then((r) => r.data);

export default api;