import api from "./api";
import { Pagination } from "./pagination-service";
import { Role } from "./role-service";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role_id: number;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserList {
  users: User[];
  pagination: Pagination;
}

export interface CreateUserDto {
  username: string;
  password: string;
  name: string;
  email?: string;
  phone?: string;
  role_id: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  role_id?: number;
  is_active?: boolean;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const UserService = {
  async getUsers(page = 1, limit = 10): Promise<UserList> {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);

    return response.data.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(user: CreateUserDto): Promise<User> {
    const response = await api.post("/users", user);
    return response.data;
  },

  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    await api.put(`/users/${id}/password`, data);
  },
};

export default UserService;
