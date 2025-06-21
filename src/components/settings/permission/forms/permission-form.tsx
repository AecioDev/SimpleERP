// src/components/settings/permissions/permission-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Importar Loader2 para o botão de loading

// Importe o schema e o tipo de dados do formulário
import {
  createPermissionSchema,
  CreatePermissionFormData,
} from "@/services/auth/permission-schema";

interface PermissionFormProps {
  // A função que será chamada ao submeter o formulário
  onSubmit: (values: CreatePermissionFormData) => Promise<void>;
  // Opcional: Valores iniciais para o formulário (útil para edição)
  initialValues?: CreatePermissionFormData;
  // Opcional: Texto para o botão de submit
  submitButtonText?: string;
  // Opcional: Indicar se o formulário está em processo de envio
  isSubmitting?: boolean;
}

export function PermissionForm({
  onSubmit,
  initialValues,
  submitButtonText = "Salvar Permissão",
  isSubmitting = false,
}: PermissionFormProps) {
  const form = useForm<CreatePermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: initialValues || {
      permission: "",
      description: "",
      module: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="permission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Permissão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: users.view" {...field} />
              </FormControl>
              <FormDescription>
                Nome único e técnico da permissão (ex: `modulo.acao` ou
                `modulo.submodulo.acao`).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Visualizar lista de usuários"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descrição amigável da permissão para fácil entendimento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Módulo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: users" {...field} />
              </FormControl>
              <FormDescription>
                Módulo ao qual esta permissão pertence (ex: `users`, `sales`,
                `finance`).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || form.formState.isSubmitting} // Desabilitar se o componente pai disser ou se o form estiver submetendo
        >
          {isSubmitting || form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </Form>
  );
}
