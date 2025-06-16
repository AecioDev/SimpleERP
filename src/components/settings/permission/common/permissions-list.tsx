// src/components/settings/permissions-list.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Permission } from "@/services/auth/permission-schema";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { usePermissionsPagination } from "@/hooks/permissions/use-permissions-pagination";
import { PermissionsTable } from "../tables/permissions-table";
import { Role } from "@/services/auth/role-schema";
import RoleService from "@/services/auth/role-service";
import PermissionService from "@/services/auth/permission-service";

export function PermissionsList() {
  const {
    permissions,
    isLoading,
    currentPage,
    totalPages,
    searchName,
    setSearchName,
    searchModule,
    setSearchModule,
    searchRoleId, // Novo filtro por Role ID
    setSearchRoleId, // Setter para Role ID
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    fetchPermissions, // Usado para recarregar após exclusão
  } = usePermissionsPagination({ pageSize: 10 });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  async function getModules() {
    try {
      //setIsLoading(true);
      const data = await PermissionService.getAvailableModules();
      setAvailableModules(data);
    } catch (error) {
      console.log(error);
    } finally {
      //setIsLoading(false);
    }
  }

  async function getRoles() {
    try {
      //setIsLoading(true);
      const data = await RoleService.getRoles();
      setAvailableRoles(data);
    } catch (error) {
      console.log(error);
    } finally {
      //setIsLoading(false);
    }
  }

  useEffect(() => {
    getModules();
    getRoles();
  }, []);

  const confirmDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePermission = async () => {
    if (!selectedPermission) return;

    try {
      await PermissionService.deletePermission(selectedPermission.ID);
      fetchPermissions(); // Recarrega a lista após a exclusão
    } catch (error: any) {
      // O toast já é exibido pelo service ou pelo hook de paginação
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPermission(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-6 p-4 rounded-lg border bg-card shadow-sm grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="grid gap-2">
          <Label
            htmlFor="search-permission"
            className="text-sm font-medium text-foreground"
          >
            Buscar por Permissão
          </Label>
          <Input
            id="search-permission"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nome da permissão (ex: users.view)"
            className="border-input focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="search-module"
            className="text-sm font-medium text-foreground"
          >
            Filtrar por Módulo
          </Label>
          <Select value={searchModule} onValueChange={setSearchModule}>
            <SelectTrigger id="search-module">
              <SelectValue placeholder="Selecione um módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="T">Todos os Módulos</SelectItem>
              {availableModules.map((module) => (
                <SelectItem key={module} value={module}>
                  {module}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="search-role"
            className="text-sm font-medium text-foreground"
          >
            Filtrar por Perfil
          </Label>
          <Select value={searchRoleId} onValueChange={setSearchRoleId}>
            <SelectTrigger id="search-role">
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="T">Todos os Perfis</SelectItem>{" "}
              {availableRoles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={handleSearch} className="mb-0.5">
            Buscar
          </Button>
        </div>
      </div>

      {/* Tabela de Permissões */}
      <PermissionsTable
        permissions={permissions}
        onConfirmDelete={confirmDelete}
      />

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Diálogo de exclusão genérico */}
      {isDeleteDialogOpen && (
        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          itemName={
            selectedPermission?.permission
              ? `a permissão "${selectedPermission.permission}"`
              : "o item selecionado"
          }
          onConfirm={handleDeletePermission}
          title="Confirma a exclusão da Permissão?"
          description={`Tem certeza que deseja excluir a permissão "${selectedPermission?.permission}"? Esta ação não pode ser desfeita.`}
        />
      )}
    </>
  );
}
