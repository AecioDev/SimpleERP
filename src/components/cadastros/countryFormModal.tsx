import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1),
  bacen_code: z.string().min(1),
  phone_code: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CountryFormModal = ({ open, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/countries", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo País</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bacen_code">Código Bacen</Label>
            <Input id="bacen_code" {...register("bacen_code")} />
            {errors.bacen_code && (
              <p className="text-red-500 text-sm">
                {errors.bacen_code.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone_code">Código de Telefone</Label>
            <Input id="phone_code" {...register("phone_code")} />
            {errors.phone_code && (
              <p className="text-red-500 text-sm">
                {errors.phone_code.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
