"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoForm from "./forms/BasicInfoForm";

export default function CreateCustomerTabs() {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
        <TabsTrigger value="address">Endereço</TabsTrigger>
        <TabsTrigger value="tax">Informações Tributárias</TabsTrigger>
        <TabsTrigger value="reports">Relatórios</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <BasicInfoForm />
      </TabsContent>
      <TabsContent value="address">
        {/* Placeholder for Address Form */}
        <div className="p-4">
          <h2 className="text-lg font-semibold">Endereço</h2>
          <p>Formulário de endereço será implementado aqui.</p>
        </div>
      </TabsContent>
      <TabsContent value="tax">
        {/* Placeholder for Tax Information Form */}
        <div className="p-4">
          <h2 className="text-lg font-semibold">Informações Tributárias</h2>
          <p>Formulário de informações tributárias será implementado aqui.</p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        {/* Placeholder for Reports */}
        <div className="p-4">
          <h2 className="text-lg font-semibold">Relatórios</h2>
          <p>Relatórios relacionados ao cliente serão implementados aqui.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
