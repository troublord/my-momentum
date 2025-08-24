const API_BASE = "http://localhost:8080";

export type AuthResponse = {
  accessToken: string;
};

export const authenticateWithGoogle = async (
  idToken: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Auth failed with status ${response.status}`);
  }

  return response.json();
};
