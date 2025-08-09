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
    user: UserResponse;
    token: string;
    expiresIn: number;
}
export interface TokenPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
}
