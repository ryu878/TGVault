/**
 * Exchange Telegram initData for JWT
 */

import { getInitData } from "./init";
import { apiClient } from "../api/client";

export async function getAuthToken(): Promise<string | null> {
  const initData = getInitData();
  if (!initData) return null;
  try {
    const { token } = await apiClient.post<{ token: string }>("/auth/login", {
      initData,
    });
    return token;
  } catch {
    return null;
  }
}
