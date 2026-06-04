const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("dori_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Request failed");
  }

  return res.json();
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // Visitors
  registerVisitor: (data: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
    company?: string;
    purpose: string;
    face_image?: string;
  }) =>
    request<Visitor>("/api/visitors/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getVisitors: (params?: {
    search?: string;
    purpose?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.purpose) query.set("purpose", params.purpose);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return request<Visitor[]>(`/api/visitors/${qs ? `?${qs}` : ""}`);
  },

  getVisitor: (id: string) => request<Visitor>(`/api/visitors/${id}`),

  updateVisitor: (
    id: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
      company: string;
      purpose: string;
      status: string;
    }>
  ) =>
    request<Visitor>(`/api/visitors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteVisitor: (id: string) =>
    request<{ detail: string }>(`/api/visitors/${id}`, {
      method: "DELETE",
    }),

  // Chat
  chat: (message: string, history?: Array<{ role: string; content: string }>) =>
    request<{ response: string }>("/api/chat/", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  // Dashboard
  getStats: () =>
    request<DashboardStats>("/api/dashboard/stats"),

  // Notifications
  getNotifications: () =>
    request<Notification[]>("/api/notifications/"),

  getUnreadCount: () =>
    request<{ count: number }>("/api/notifications/unread-count"),

  markRead: (id: number) =>
    request<{ detail: string }>(`/api/notifications/${id}/read`, {
      method: "PUT",
    }),

  markAllRead: () =>
    request<{ detail: string }>("/api/notifications/read-all", {
      method: "PUT",
    }),
};

// Types
export interface Visitor {
  id: number;
  visitor_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  purpose: string;
  qr_code: string | null;
  status: string;
  created_at: string;
}

export interface DashboardStats {
  total_visitors: number;
  active_today: number;
  meetings: number;
  technical_requests: number;
  weekly_visitors: number;
  monthly_visitors: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  visitor_id: string | null;
  created_at: string;
}
