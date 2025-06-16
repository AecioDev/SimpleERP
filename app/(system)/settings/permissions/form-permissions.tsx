"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription, // Adicionado FormDescription
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Importe o schema e o serviço
import {
  createPermissionSchema,
  CreatePermissionFormData,
} from "@/services/auth/permission-schema";
import permissionService from "@/services/auth/permission-service";

export default function CreatePermissionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreatePermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      permission: "",
      description: "",
      module: "",
    },
  });

  const onSubmit = async (values: CreatePermissionFormData) => {
    try {
      // Chame o serviço para criar a permissão
      const newPermission = await permissionService.createPermission(values);

      toast({
        title: "Sucesso!",
        description: `Permissão "${newPermission.permission}" criada com sucesso.`,
        variant: "default",
      });
      form.reset(); // Limpa o formulário após o sucesso
    } catch (error: any) {
      console.error("Erro ao criar permissão:", error);
      toast({
        title: "Erro",
        description:
          error.message || "Ocorreu um erro inesperado ao criar a permissão.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrar Nova Permissão</CardTitle>
          <CardDescription>
            Crie novas permissões para o sistema. Utilize um formato claro (ex:
            modulo.acao).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="permission" // Mudei de 'name' para 'permission'
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
                      Módulo ao qual esta permissão pertence (ex: `users`,
                      `sales`, `finance`).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Salvando..."
                  : "Salvar Permissão"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
