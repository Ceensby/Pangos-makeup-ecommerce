// src/config.js

// Backend base URL (only change here or via .env)
export const BACKEND_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

// API base URL
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

// Helper: build full image URL from DB value
export const resolveImageUrl = (pathOrUrl) => {
  if (!pathOrUrl) return '';

  // If it's already a full URL (http/https), just return it
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  // Ensure it starts with a single slash
  if (!pathOrUrl.startsWith('/')) {
    pathOrUrl = `/${pathOrUrl}`;
  }

  return `${BACKEND_BASE_URL}${pathOrUrl}`;
};
