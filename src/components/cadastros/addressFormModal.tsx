import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Address, City } from "@/services/common/address";
import { CityFormModal } from "./cityFormModal";

const schema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  zip_code: z.string().min(1),
  city_id: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  customerId: number;
  onAddressCreated: (address: Address) => void;
}

export const AddressFormModal = ({
  open,
  onClose,
  customerId,
  onAddressCreated,
}: Props) => {
  const [cities, setCities] = useState<City[]>([]);
  const [openCityModal, setOpenCityModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loadCities = async () => {
    const res = await fetch("/api/cities");
    const data = await res.json();
    setCities(data);
  };

  useEffect(() => {
    if (open) loadCities();
  }, [open]);

  const onSubmit = async (data: FormData) => {
    const res = await fetch(`/api/customers/${customerId}/addresses`, {
      method: "POST",
      body: JSON.stringify({ ...data, customer_id: customerId }),
      headers: { "Content-Type": "application/json" },
    });

    const newAddress = await res.json();
    onAddressCreated(newAddress);
    reset();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Endereço</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input id="street" {...register("street")} />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register("number")} />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" {...register("neighborhood")} />
              </div>
            </div>

            <div>
              <Label htmlFor="zip_code">CEP</Label>
              <Input id="zip_code" {...register("zip_code")} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="city_id">Cidade</Label>
                <Select onValueChange={(val) => setValue("city_id", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name} - {city.state.uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={() => setOpenCityModal(true)}>
                + Cidade
              </Button>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CityFormModal
        open={openCityModal}
        onClose={() => {
          setOpenCityModal(false);
          loadCities(); // atualiza a lista de cidades depois de adicionar uma nova
        }}
      />
    </>
  );
};
