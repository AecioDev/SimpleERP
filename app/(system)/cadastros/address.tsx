import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressFormModal } from "@/components/cadastros/addressFormModal";
import { Address } from "@/services/common/address-service";

interface Props {
  customerId: number;
}

export const CustomerAddresses = ({ customerId }: Props) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Buscar os endereços do cliente pela API
    const fetchAddresses = async () => {
      const res = await fetch(`/api/customers/${customerId}/addresses`);
      const data = await res.json();
      setAddresses(data);
    };

    fetchAddresses();
  }, [customerId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Endereços do Cliente</h2>
        <Button onClick={() => setOpenModal(true)}>Novo Endereço</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="p-4">
              <p>
                <strong>Rua:</strong> {address.street}, {address.number}
              </p>
              <p>
                <strong>Bairro:</strong> {address.neighborhood}
              </p>
              <p>
                <strong>CEP:</strong> {address.zip_code}
              </p>
              <p>
                <strong>Cidade:</strong> {address.city?.name} /{" "}
                {address.city?.state?.uf}
              </p>
              <p>
                <strong>País:</strong> {address.city?.state?.country?.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddressFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        customerId={customerId}
        onAddressCreated={(newAddress) => {
          setAddresses((prev) => [...prev, newAddress]);
          setOpenModal(false);
        }}
      />
    </div>
  );
};
