const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

async function request(path, { method="GET", body, auth=true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || (data.errors ? data.errors.map(e => e.msg).join(", ") : "Request failed");
    throw new Error(msg);
  }
  return data;
}

export const api = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload, auth: false }),
  workoutsList: () => request("/api/workouts"),
  workoutsCreate: (payload) => request("/api/workouts", { method: "POST", body: payload }),
  workoutsUpdate: (id, payload) => request(`/api/workouts/${id}`, { method: "PUT", body: payload }),
  workoutsDelete: (id) => request(`/api/workouts/${id}`, { method: "DELETE" }),
  goalsList: () => request("/api/goals"),
  goalsCreate: (payload) => request("/api/goals", { method: "POST", body: payload }),
  goalsUpdate: (id, payload) => request(`/api/goals/${id}`, { method: "PUT", body: payload }),
  goalsDelete: (id) => request(`/api/goals/${id}`, { method: "DELETE" }),
  progressSummary: () => request("/api/progress/summary"),
  recommendations: (payload) => request("/api/recommendations", { method: "POST", body: payload })
};
