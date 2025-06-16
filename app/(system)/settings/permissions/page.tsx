// app/(system)/settings/permissions/page.tsx
"use client";

// Removido useEffect, useState, Permission, useToast, permissionService,
// handleConfirmDelete e loadPermissions pois agora são gerenciados por PermissionsList

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/config/routes";
import { PagePermissionGuard } from "@/components/layout/PagePermissionGuard";
import { PermissionedLinkButton } from "@/components/common/PermissionedLinkButton";
import { PermissionsList } from "@/components/settings/permission/common/permissions-list";

export default function PermissionsPage() {
  return (
    <PagePermissionGuard
      // A permissão para VER a lista de permissões
      requiredPermissions={["permissions.view"]} //
      accessDeniedMessage="Você não tem permissão para visualizar a lista de permissões."
    >
      <div className="space-y-6 px-4 py-6 md:px-8 md:py-8 bg-background text-foreground min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Permissões
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Gerencie as permissões do sistema
            </p>
          </div>
          <div>
            <PermissionedLinkButton
              href={routes.settings.permissions.create}
              permission="admin.create_permissions" //
              tooltipMessage="Você não pode criar novas permissões."
              className="w-full @lg:w-auto"
              iconName="mdi:plus"
            >
              Nova Permissão
            </PermissionedLinkButton>
          </div>
        </div>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Lista de Permissões
            </CardTitle>
            <CardDescription>
              Visualize e gerencie as permissões cadastradas no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionsList />
          </CardContent>
        </Card>
      </div>
    </PagePermissionGuard>
  );
}
