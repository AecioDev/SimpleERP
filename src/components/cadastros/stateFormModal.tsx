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
import { Country } from "@/services/common/address";
import { CountryFormModal } from "./countryFormModal";

const schema = z.object({
  name: z.string().min(1),
  uf: z.string().min(1),
  ibge_code: z.string().min(1),
  country_id: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const StateFormModal = ({ open, onClose }: Props) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [openCountryModal, setOpenCountryModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loadCountries = async () => {
    const res = await fetch("/api/countries");
    const data = await res.json();
    setCountries(data);
  };

  useEffect(() => {
    if (open) loadCountries();
  }, [open]);

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/states", {
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
            <DialogTitle>Novo Estado (UF)</DialogTitle>
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
              <Label htmlFor="uf">UF</Label>
              <Input id="uf" maxLength={2} {...register("uf")} />
              {errors.uf && (
                <p className="text-red-500 text-sm">{errors.uf.message}</p>
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
                <Label htmlFor="country_id">País</Label>
                <Select onValueChange={(val) => setValue("country_id", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={() => setOpenCountryModal(true)}>
                + País
              </Button>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CountryFormModal
        open={openCountryModal}
        onClose={() => {
          setOpenCountryModal(false);
          loadCountries();
        }}
      />
    </>
  );
};
