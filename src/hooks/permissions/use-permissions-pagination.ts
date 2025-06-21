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
  totalItems: number;
  searchName: string;
  setSearchName: (value: string) => void;
  searchModule: string;
  setSearchModule: (value: string) => void;
  searchRoleId: string;
  setSearchRoleId: (value: string) => void;
  handleSearch: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
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
  const [totalItems, setTotalItems] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchModule, setSearchModule] = useState("");
  const [searchRoleId, setSearchRoleId] = useState("");
  const { toast } = useToast();

  console.log("SearchName Fora: ", searchName);
  // Ref para armazenar os valores dos filtros que DISPARAM a busca
  // Estes são os valores que serão passados para a API
  const filtersToApplyRef = useRef({
    name: "",
    module: "",
    roleId: "",
  });

  // Função para buscar permissões do backend.
  // Ela usa os valores do filtersToApplyRef e a currentPage atual.
  const fetchPermissionsData = useCallback(async () => {
    setIsLoading(true);
    console.log(
      "Fetching permissions with filters: ",
      filtersToApplyRef.current
    );
    try {
      const filters = filtersToApplyRef.current; // Pega os filtros do ref

      const result = await permissionService.getPermissions(
        currentPage,
        pageSize,
        filters
      );

      setPermissions(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalRows); // Corrected to totalRows
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
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, toast]); // Dependências do useCallback: apenas paginação e toast

  // useEffect principal que dispara a busca.
  useEffect(() => {
    fetchPermissionsData();
  }, [currentPage, fetchPermissionsData]);

  // Função para disparar uma nova busca com os filtros ATUAIS para o Input de texto
  const handleSearch = () => {
    // Atualiza os filtros que serão usados na próxima chamada à API.
    filtersToApplyRef.current = {
      name: searchName,
      module: searchModule,
      roleId: searchRoleId,
    };
    // Redefine para a primeira página para uma nova busca de filtros.
    console.log(
      "handleSearch chamado. filtersToApplyRef.current agora é:",
      filtersToApplyRef.current
    );
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
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
    goToPage,
    fetchPermissions: handleSearch, // Expondo handleSearch para recarregar com os filtros atuais
  };
}
