"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Definição dos módulos e permissões
const modules = [
  {
    name: "Vendas",
    permissions: ["Visualizar", "Criar", "Editar", "Excluir", "Relatórios"],
  },
  {
    name: "Compras",
    permissions: ["Visualizar", "Criar", "Editar", "Excluir", "Relatórios"],
  },
  {
    name: "Estoque",
    permissions: ["Visualizar", "Criar", "Editar", "Excluir", "Relatórios"],
  },
  {
    name: "Financeiro",
    permissions: ["Visualizar", "Criar", "Editar", "Excluir", "Relatórios"],
  },
]

export function PermissionSettings() {
  const { toast } = useToast()
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({
    Vendas: ["Visualizar", "Criar"],
    Compras: ["Visualizar"],
    Estoque: ["Visualizar", "Criar", "Editar"],
    Financeiro: ["Visualizar"],
  })

  const handlePermissionChange = (module: string, permission: string) => {
    setSelectedPermissions((prev) => {
      const modulePermissions = prev[module] || []

      if (modulePermissions.includes(permission)) {
        return {
          ...prev,
          [module]: modulePermissions.filter((p) => p !== permission),
        }
      } else {
        return {
          ...prev,
          [module]: [...modulePermissions, permission],
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de atualização de permissões
    toast({
      title: "Permissões atualizadas",
      description: "As permissões foram atualizadas com sucesso",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões de Acesso</CardTitle>
        <CardDescription>Configure as permissões de acesso para cada perfil</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {modules.map((module) => (
            <div key={module.name} className="space-y-4">
              <h3 className="font-medium">{module.name}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {module.permissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${module.name}-${permission}`}
                      checked={selectedPermissions[module.name]?.includes(permission) || false}
                      onCheckedChange={() => handlePermissionChange(module.name, permission)}
                    />
                    <Label htmlFor={`${module.name}-${permission}`}>{permission}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit">Salvar Permissões</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

