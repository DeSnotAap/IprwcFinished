export interface User {
    id?: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    role: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    address?: string;
} 