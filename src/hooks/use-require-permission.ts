"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { useToast } from "@/components/ui/use-toast";

interface RequirePermissionOptions {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  redirectPath?: string;
  accessDeniedMessage?: string;
}

export function useRequirePermission(options: RequirePermissionOptions) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [hasPermissionCheckCompleted, setHasPermissionCheckCompleted] =
    useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let hasAccess = true;

    if (!user) {
      hasAccess = false;
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
      });
    } else {
      if (
        options.requiredPermissions &&
        options.requiredPermissions.length > 0
      ) {
        const userPermissions =
          user.role?.permissions?.map((p) => p.name) || [];
        hasAccess = options.requiredPermissions.some((perm) =>
          userPermissions.includes(perm)
        );
      } else if (options.requiredRoles && options.requiredRoles.length > 0) {
        const userRoleName = user.role?.name;
        hasAccess = options.requiredRoles.includes(userRoleName || "");
      }
    }

    if (!hasAccess) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description:
          options.accessDeniedMessage ||
          "Você não tem permissão para acessar esta funcionalidade.", // Usar options diretamente
      });

      const timer = setTimeout(() => {
        router.replace(options.redirectPath || "/dashboard"); // Usar options diretamente
      }, 50);

      return () => clearTimeout(timer);
    }

    setHasPermissionCheckCompleted(true);
  }, [
    isLoading,
    user,
    router,
    toast,
    // Passar o objeto options inteiro para a dependência
    // Ou as propriedades específicas que *realmente* podem mudar
    options.requiredPermissions,
    options.requiredRoles,
    options.redirectPath, // Agora estas são dependências diretas de `options`
    options.accessDeniedMessage, // O que é mais estável
  ]);

  return { hasPermissionCheckCompleted };
}
