"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import UserService, { type User } from "@/services/user-service";
import RoleService, { type Role } from "@/services/role-service";
import { UserTable } from "./components/user-table";
import { AddUserDialog } from "./components/add-user-dialog";
import { EditUserDialog } from "./components/edit-user-dialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Verificar se o usuário é admin
  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Carregar usuários e perfis
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [usersResponse, rolesResponse] = await Promise.all([
          UserService.getUsers(currentPage, 10),
          RoleService.getRoles(),
        ]);

        setUsers(usersResponse.users);
        setTotalPages(Math.ceil(usersResponse.pagination.totalPages / 10));
        setRoles(rolesResponse);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description:
            "Não foi possível carregar a lista de usuários e perfis.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage, toast]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUserAdded = (user: User) => {
    setUsers([...users, user]);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerenciamento de usuários do sistema
          </p>
        </div>
        <AddUserDialog roles={roles} onUserAdded={handleUserAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie os usuários do sistema e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            roles={roles}
            onEditUser={handleEditUser}
            onUserUpdated={handleUserUpdated}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <EditUserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        roles={roles}
        onUserUpdated={handleUserUpdated}
        onUserChange={setSelectedUser}
      />
    </div>
  );
}
