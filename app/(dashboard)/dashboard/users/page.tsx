"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Edit, MoreHorizontal, Trash2, UserPlus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import UserService, { type User, type CreateUserDto } from "@/services/user-service"
import RoleService, { type Role } from "@/services/role-service"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<CreateUserDto>({
    username: "",
    password: "",
    name: "",
    email: "",
    role_id: 0,
  })
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Verificar se o usuário é admin
  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Carregar usuários e perfis
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [usersResponse, rolesResponse] = await Promise.all([
          UserService.getUsers(currentPage, 10),
          RoleService.getRoles(),
        ])

        setUsers(usersResponse.data)
        setTotalPages(Math.ceil(usersResponse.total / 10))
        setRoles(rolesResponse)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de usuários e perfis.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentPage, toast])

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.name || !newUser.role_id) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar usuário",
        description: "Preencha todos os campos obrigatórios",
      })
      return
    }

    try {
      const createdUser = await UserService.createUser(newUser)

      setUsers([...users, createdUser])
      setNewUser({
        username: "",
        password: "",
        name: "",
        email: "",
        role_id: 0,
      })
      setIsAddUserOpen(false)

      toast({
        title: "Usuário adicionado",
        description: `O usuário ${createdUser.name} foi adicionado com sucesso`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar usuário",
        description: error.response?.data?.message || "Ocorreu um erro ao adicionar o usuário",
      })
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const updatedUser = await UserService.updateUser(selectedUser.id, {
        name: selectedUser.name,
        email: selectedUser.email,
        role_id: selectedUser.role_id,
        is_active: selectedUser.is_active,
      })

      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      setIsEditUserOpen(false)
      setSelectedUser(null)

      toast({
        title: "Usuário atualizado",
        description: `O usuário ${updatedUser.name} foi atualizado com sucesso`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o usuário",
      })
    }
  }

  const toggleUserStatus = async (id: number) => {
    try {
      const userToToggle = users.find((u) => u.id === id)
      if (!userToToggle) return

      const updatedUser = await UserService.updateUser(id, {
        is_active: !userToToggle.is_active,
      })

      setUsers(users.map((u) => (u.id === id ? updatedUser : u)))

      toast({
        title: updatedUser.is_active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário ${updatedUser.name} foi ${updatedUser.is_active ? "ativado" : "desativado"} com sucesso`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao alterar status do usuário",
        description: error.response?.data?.message || "Ocorreu um erro ao alterar o status do usuário",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerenciamento de usuários do sistema</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>Preencha os dados para criar um novo usuário no sistema</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Perfil</Label>
                <Select
                  value={newUser.role_id.toString()}
                  onValueChange={(value) => setNewUser({ ...newUser, role_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Gerencie os usuários do sistema e suas permissões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {roles.find((r) => r.id === user.role_id)?.name || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {user.is_active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar usuário */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize as informações do usuário</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Perfil</Label>
                <Select
                  value={selectedUser.role_id.toString()}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role_id: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

