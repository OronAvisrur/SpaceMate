export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
  };
  token: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}