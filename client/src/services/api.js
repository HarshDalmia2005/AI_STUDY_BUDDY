const BASE_URL = '/api';

export const notesAPI = {
  upload: (formData) =>
    fetch(`${BASE_URL}/notes/upload`, {
      method: 'POST',
      body: formData
    }).then(r => r.json()),

  getAll: (page = 1, limit = 10) =>
    fetch(`${BASE_URL}/notes?page=${page}&limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  getById: (id) =>
    fetch(`${BASE_URL}/notes/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  delete: (id) =>
    fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  search: (q) =>
    fetch(`${BASE_URL}/notes/search?q=${encodeURIComponent(q)}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())
};


export const quizAPI = {
  generate: (noteId) =>
    fetch(`${BASE_URL}/quiz/generate/${noteId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  submit: (quizId, answers) =>
    fetch(`${BASE_URL}/quiz/submit/${quizId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    }).then(r => r.json()),

  history: () =>
    fetch(`${BASE_URL}/quiz/history`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  getById: (id) =>
    fetch(`${BASE_URL}/quiz/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())
};


export const analyticsAPI = {
  dashboard: () =>
    fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  weakTopics: () =>
    fetch(`${BASE_URL}/analytics/weak-topics`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),

  progress: () =>
    fetch(`${BASE_URL}/analytics/progress`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())
};
