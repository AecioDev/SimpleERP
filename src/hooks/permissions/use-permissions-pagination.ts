// src/hooks/use-permissions-pagination.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Permission } from "@/services/auth/permission-schema";
import permissionService from "@/services/auth/permission-service";

interface UsePermissionsPaginationProps {
  initialPage?: number;
  pageSize?: number;
}

interface PermissionsPaginationResult {
  permissions: Permission[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  searchName: string;
  setSearchName: (value: string) => void;
  searchModule: string;
  setSearchModule: (value: string) => void;
  searchRoleId: string; // Novo estado para o filtro por Role ID
  setSearchRoleId: (value: string) => void; // Setter para Role ID
  handleSearch: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  fetchPermissions: () => void;
}

export function usePermissionsPagination({
  initialPage = 1,
  pageSize = 10,
}: UsePermissionsPaginationProps = {}): PermissionsPaginationResult {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchModule, setSearchModule] = useState("");
  const [searchRoleId, setSearchRoleId] = useState(""); // Estado para o filtro por Role ID
  const { toast } = useToast();

  // Use useRef para armazenar os filtros ATUAIS que serão usados na busca.
  // Isso evita que fetchPermissions seja recriada quando os filtros de input mudam.
  const currentFilters = useRef({
    name: searchName,
    module: searchModule,
    roleId: searchRoleId,
  });

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use os valores do useRef para a busca
      const filters = currentFilters.current;

      const result = await permissionService.getPermissions(
        currentPage,
        pageSize,
        filters
      );

      setPermissions(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (error: any) {
      console.error("Erro ao carregar permissões:", error);
      toast({
        title: "Erro ao carregar dados",
        description:
          error.message || "Não foi possível carregar a lista de permissões.",
        variant: "destructive",
      });
      setPermissions([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, toast]);

  useEffect(() => {
    // Sincroniza os filtros atuais com o useRef para a próxima busca
    currentFilters.current = {
      name: searchName,
      module: searchModule,
      roleId: searchRoleId,
    };

    fetchPermissions();
  }, [fetchPermissions]); // Dependência do useCallback

  // Lógica de manipulação de filtros e paginação
  const handleSearch = () => {
    // Quando o botão de busca é clicado, atualiza o useRef e força uma nova busca na página 1
    currentFilters.current = {
      name: searchName,
      module: searchModule,
      roleId: searchRoleId,
    };
    setCurrentPage(1); // Ao aplicar filtros, sempre volta para a primeira página
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    permissions,
    isLoading,
    currentPage,
    totalPages,
    searchName,
    setSearchName,
    searchModule,
    setSearchModule,
    searchRoleId,
    setSearchRoleId,
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    fetchPermissions: handleSearch, // Expondo handleSearch para recarregar com os filtros atuais
  };
}
