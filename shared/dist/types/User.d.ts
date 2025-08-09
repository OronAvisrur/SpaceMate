export interface User {
    _id?: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface UserResponse {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isActive: boolean;
}
