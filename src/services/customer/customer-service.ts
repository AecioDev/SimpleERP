import api from "../api";
import { Address } from "../common/address";
import { Contact } from "../common/contacts";
import { Pagination } from "../pagination-service";
import { User } from "../user-service";

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  person_type: string;
  document_number: string;
  company_name: string;
  is_active: boolean;
  notes: string;

  created_by: number;
  UserCreate: User;
  updated_by: number;
  UserUpdate: User;

  created_at: string;
  updated_at: string;

  documents: Document[];
  addresses: Address[];
  contacts: Contact[];
}

export interface CustomerList {
  customers: Customer[];
  pagination: Pagination;
}

export interface CreateCustomerDto {
  first_name: string;
  last_name: string;
  person_type: "fisica" | "juridica";
  DocumentNumber: string;
  company_name: string;
  is_active: boolean;
  notes: string;
  user: User;
}

export interface UpdateCustomerDto {
  first_name: string;
  last_name: string;
  person_type: "fisica" | "juridica";
  DocumentNumber: string;
  company_name: string;
  is_active: boolean;
  notes: string;
  user: User;
}

const CustomerService = {
  async getCustomers(
    page = 1,
    limit = 10,
    filters?: {
      name?: string;
      document?: string;
      is_active?: boolean;
    }
  ): Promise<CustomerList> {
    let url = `/customers?page=${page}&limit=${limit}`;

    if (filters) {
      if (filters.name) url += `&name=${filters.name}`;
      if (filters.document) url += `&document=${filters.document}`;
      if (filters.is_active !== undefined)
        url += `&is_active=${filters.is_active}`;
    }

    const response = await api.get(url);
    return response.data.data;
  },

  async getCustomerById(id: number): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer: CreateCustomerDto): Promise<Customer> {
    const response = await api.post("/customers", customer);
    return response.data;
  },

  async updateCustomer(
    id: number,
    customer: UpdateCustomerDto
  ): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },

  async deleteCustomer(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};

export default CustomerService;
