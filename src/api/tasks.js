import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "?";
    const status = error.response?.status ?? "network";
    console.error(`[api] ${error.config?.method?.toUpperCase()} ${url} → ${status}`, error);
    return Promise.reject(error);
  }
);

// GET    /tasks/
// POST   /tasks/
// GET    /tasks/{id}
// PUT    /tasks/{id}
// DELETE /tasks/{id}
// PATCH  /tasks/{id}/complete

export const getTasks     = () => api.get("/tasks/").then((r) => r.data);
export const getTask      = (id) => api.get(`/tasks/${id}`).then((r) => r.data);
export const createTask   = (data) => api.post("/tasks/", data).then((r) => r.data);
export const updateTask   = (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data);
export const deleteTask   = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`).then((r) => r.data);

export default api;