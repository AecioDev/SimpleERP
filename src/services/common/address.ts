import { Customer } from "../customer/customer-service";
import { Supplier } from "../supplier/supplier-service";

export interface Country {
  id: number;
  name: string;
  bacen_code: string;
  phone_code: string;
}

export interface State {
  id: number;
  name: string;
  uf: string;
  ibge_code: string;
  country_id: number;
  country: Country;
}

export interface City {
  id: number;
  name: string;
  ibge_code: string;
  state_id: number;
  state: State;
}

export interface Address {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  zip_code: string;
  city_id: number;
  city: City;
  customer_id: number;
  customer: Customer;
  supplier_id: number;
  supplier: Supplier;
}
