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
import { PermissionsTable } from "../tables/permissions-table";
import { Role } from "@/services/auth/role-schema";
import RoleService from "@/services/auth/role-service";
import PermissionService from "@/services/auth/permission-service";
import { usePermissionsPagination } from "@/hooks/permissions/use-permissions-pagination";

export function PermissionsList() {
  const {
    permissions,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    searchName,
    setSearchName,
    searchModule,
    setSearchModule,
    searchRoleId,
    setSearchRoleId,
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    fetchPermissions,
  } = usePermissionsPagination({ pageSize: 5 });

  console.log("Estados na PermissionsList:", {
    searchName,
    searchModule,
    searchRoleId,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  async function getModules() {
    try {
      const data = await PermissionService.getAvailableModules();
      setAvailableModules(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getRoles() {
    try {
      const data = await RoleService.getRoles();
      setAvailableRoles(data);
    } catch (error) {
      console.log(error);
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

  const pageSize = 5; // Defina aqui o mesmo pageSize que você usa no hook
  const minHeightPerItem = 48; // Altura de uma linha da tabela (aproximado, ajuste se necessário)
  const calculatedMinHeight = pageSize * minHeightPerItem;

  // Handler para mudança de Módulo: atualiza o estado e dispara a busca
  const handleModuleChange = (value: string) => {
    setSearchModule(value);
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  // Handler para mudança de Role: atualiza o estado e dispara a busca
  const handleRoleChange = (value: string) => {
    setSearchRoleId(value);
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="search-module"
            className="text-sm font-medium text-foreground"
          >
            Filtrar por Módulo
          </Label>
          <Select value={searchModule} onValueChange={handleModuleChange}>
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
          <Select value={searchRoleId} onValueChange={handleRoleChange}>
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

      {/* Tabela de Permissões ou Loader */}
      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center text-muted-foreground border rounded-md"
          style={{ minHeight: `${calculatedMinHeight + 120}px` }} // +60px para dar um pouco mais de espaço no loader
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p>Consultando servidor...</p>
        </div>
      ) : (
        <PermissionsTable
          permissions={permissions}
          onConfirmDelete={confirmDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onGoToFirstPage={goToFirstPage}
          onGoToLastPage={goToLastPage}
        />
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
