"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerFormSchema,
  CreateCustomerInput,
} from "@/services/customer/customer-service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import CustomerService from "@/services/customer/customer-service";
import { useRouter } from "next/navigation";

export default function BasicInfoForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      is_active: true,
      person_type: "fisica",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const personType = watch("person_type");

  const onSubmit = async (data: CreateCustomerInput) => {
    try {
      await CustomerService.createCustomer(data);
      toast({
        title: "Cliente cadastrado com sucesso!",
      });
      router.push("/vendas/cadastros/clientes");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar cliente",
        description: "Verifique os dados e tente novamente.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nome</Label>
          <Input {...register("first_name")} />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <Label>Sobrenome</Label>
          <Input {...register("last_name")} />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <Label>Tipo de Pessoa</Label>
          <select {...register("person_type")} className="form-select w-full">
            <option value="fisica">Física</option>
            <option value="juridica">Jurídica</option>
          </select>
        </div>

        <div>
          <Label>Número do Documento</Label>
          <Input {...register("document_number")} />
          {errors.document_number && (
            <p className="text-sm text-red-500">
              {errors.document_number.message}
            </p>
          )}
        </div>

        {personType === "juridica" && (
          <div className="md:col-span-2">
            <Label>Razão Social</Label>
            <Input {...register("company_name")} />
            {errors.company_name && (
              <p className="text-sm text-red-500">
                {errors.company_name.message}
              </p>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <Label>Observações</Label>
          <Input {...register("notes")} />
        </div>

        <div className="flex items-center gap-2">
          <Label>Ativo?</Label>
          <Switch {...register("is_active")} defaultChecked />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
