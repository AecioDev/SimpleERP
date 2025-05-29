import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { State } from "@/services/common/address";
import { StateFormModal } from "./stateFormModal";

const schema = z.object({
  name: z.string().min(1),
  ibge_code: z.string().min(1),
  state_id: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CityFormModal = ({ open, onClose }: Props) => {
  const [states, setStates] = useState<State[]>([]);
  const [openStateModal, setOpenStateModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loadStates = async () => {
    const res = await fetch("/api/states");
    const data = await res.json();
    setStates(data);
  };

  useEffect(() => {
    if (open) loadStates();
  }, [open]);

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/cities", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Cidade</DialogTitle>
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
              <Label htmlFor="ibge_code">Código IBGE</Label>
              <Input id="ibge_code" {...register("ibge_code")} />
              {errors.ibge_code && (
                <p className="text-red-500 text-sm">
                  {errors.ibge_code.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="state_id">Estado (UF)</Label>
                <Select onValueChange={(val) => setValue("state_id", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.uf} - {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={() => setOpenStateModal(true)}>
                + Estado
              </Button>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <StateFormModal
        open={openStateModal}
        onClose={() => {
          setOpenStateModal(false);
          loadStates(); // atualiza lista após cadastro de novo estado
        }}
      />
    </>
  );
};
