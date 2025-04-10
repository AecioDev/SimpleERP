import api from "./api";

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  module: string;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

const RoleService = {
  async getRoles(): Promise<Role[]> {
    const response = await api.get("/roles");
    return response.data.data;
  },

  async getRoleById(id: number): Promise<Role> {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  async createRole(role: {
    name: string;
    description?: string;
  }): Promise<Role> {
    const response = await api.post("/roles", role);
    return response.data;
  },

  async updateRole(
    id: number,
    role: { name?: string; description?: string }
  ): Promise<Role> {
    const response = await api.put(`/roles/${id}`, role);
    return response.data;
  },

  async deleteRole(id: number): Promise<void> {
    await api.delete(`/roles/${id}`);
  },

  async getPermissions(): Promise<Permission[]> {
    const response = await api.get("/permissions");
    return response.data;
  },

  async getPermissionsByModule(): Promise<Record<string, Permission[]>> {
    const response = await api.get("/permissions/by-module");
    return response.data;
  },

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const response = await api.get(`/roles/${roleId}/permissions`);
    return response.data;
  },

  async updateRolePermissions(
    roleId: number,
    permissionIds: number[]
  ): Promise<void> {
    await api.put(`/roles/${roleId}/permissions`, {
      permissions: permissionIds,
    });
  },
};

export default RoleService;
