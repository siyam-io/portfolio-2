import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Automatically inject token to request headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication
export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

export const verifyToken = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};

// Profile
export const getProfile = async () => {
  const res = await api.get("/portfolio/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/portfolio/profile", data);
  return res.data;
};

// Skills
export const getSkills = async () => {
  const res = await api.get("/portfolio/skills");
  return res.data;
};

export const addSkill = async (data) => {
  const res = await api.post("/portfolio/skills", data);
  return res.data;
};

export const updateSkill = async (id, data) => {
  const res = await api.put(`/portfolio/skills/${id}`, data);
  return res.data;
};

export const deleteSkill = async (id) => {
  const res = await api.delete(`/portfolio/skills/${id}`);
  return res.data;
};

// Experience
export const getExperiences = async () => {
  const res = await api.get("/portfolio/experience");
  return res.data;
};

export const addExperience = async (data) => {
  const res = await api.post("/portfolio/experience", data);
  return res.data;
};

export const updateExperience = async (id, data) => {
  const res = await api.put(`/portfolio/experience/${id}`, data);
  return res.data;
};

export const deleteExperience = async (id) => {
  const res = await api.delete(`/portfolio/experience/${id}`);
  return res.data;
};

// Projects
export const getProjects = async () => {
  const res = await api.get("/portfolio/projects");
  return res.data;
};

export const addProject = async (data) => {
  const res = await api.post("/portfolio/projects", data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.put(`/portfolio/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/portfolio/projects/${id}`);
  return res.data;
};

// Services
export const getServices = async () => {
  const res = await api.get("/portfolio/services");
  return res.data;
};

export const addService = async (data) => {
  const res = await api.post("/portfolio/services", data);
  return res.data;
};

export const updateService = async (id, data) => {
  const res = await api.put(`/portfolio/services/${id}`, data);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/portfolio/services/${id}`);
  return res.data;
};

export const getGithubRepos = async (username) => {
  const res = await api.get(`/portfolio/github-repos/${username}`);
  return res.data;
};

// Contact Messages
export const submitContact = async (data) => {
  const res = await api.post("/messages", data);
  return res.data;
};

export const getMessages = async () => {
  const res = await api.get("/messages");
  return res.data;
};

export const deleteMessage = async (id) => {
  const res = await api.delete(`/messages/${id}`);
  return res.data;
};

// Image Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// CV Upload
export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("cv", file);
  const res = await api.post("/upload/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Credentials Keys Management
export const getKeys = async () => {
  const res = await api.get("/keys");
  return res.data;
};

export const saveKeys = async (keys) => {
  const res = await api.post("/keys", { keys });
  return res.data;
};

export const getEmailJSKeys = async () => {
  const res = await api.get("/portfolio/emailjs-keys");
  return res.data;
};

export const CV_DOWNLOAD_URL = `${API_BASE}/portfolio/cv`;

export default api;
