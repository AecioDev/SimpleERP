import api from "../common/api";
import { Permission } from "./permission-schema";
import { Role } from "./role-schema";

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
