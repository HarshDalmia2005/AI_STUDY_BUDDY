const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('mentormate_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('mentormate_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const authAPI = {
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  signup: (name, email, password) =>
    fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ name, email, password })
    }).then(r => r.json()),

  profile: () =>
    fetch(`${BASE_URL}/auth/profile`, { headers: getHeaders() }).then(r => r.json()),

  forgotPassword: (email) =>
    fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ email })
    }).then(r => r.json())
};


export const notesAPI = {
  upload: (formData) =>
    fetch(`${BASE_URL}/notes/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    }).then(r => r.json()),

  getAll: (page = 1, limit = 10) =>
    fetch(`${BASE_URL}/notes?page=${page}&limit=${limit}`, { headers: getHeaders() }).then(r => r.json()),

  getById: (id) =>
    fetch(`${BASE_URL}/notes/${id}`, { headers: getHeaders() }).then(r => r.json()),

  delete: (id) =>
    fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),

  search: (q) =>
    fetch(`${BASE_URL}/notes/search?q=${encodeURIComponent(q)}`, { headers: getHeaders() }).then(r => r.json())
};


export const quizAPI = {
  generate: (noteId) =>
    fetch(`${BASE_URL}/quiz/generate/${noteId}`, {
      method: 'POST', headers: getHeaders()
    }).then(r => r.json()),

  submit: (quizId, answers) =>
    fetch(`${BASE_URL}/quiz/submit/${quizId}`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ answers })
    }).then(r => r.json()),

  history: () =>
    fetch(`${BASE_URL}/quiz/history`, { headers: getHeaders() }).then(r => r.json()),

  getById: (id) =>
    fetch(`${BASE_URL}/quiz/${id}`, { headers: getHeaders() }).then(r => r.json())
};


export const analyticsAPI = {
  dashboard: () =>
    fetch(`${BASE_URL}/analytics/dashboard`, { headers: getHeaders() }).then(r => r.json()),

  weakTopics: () =>
    fetch(`${BASE_URL}/analytics/weak-topics`, { headers: getHeaders() }).then(r => r.json()),

  progress: () =>
    fetch(`${BASE_URL}/analytics/progress`, { headers: getHeaders() }).then(r => r.json())
};
