import { client } from "@/api/client";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  university?: string | null;
  role: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string; // "bearer"
  expires_in: number;
  user: User;
};

const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";

function saveSession(token: string, user: User) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors (private mode, etc)
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

export async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>("/auth/signup", { email, password, name });
  // Persist session on successful signup
  saveSession(res.access_token, res.user);
  return res;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>("/auth/login", { email, password });
  // Persist session on successful login
  saveSession(res.access_token, res.user);
  return res;
}

export function logout(): void {
  clearSession();
}