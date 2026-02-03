export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
  avatar?: string;
}

export const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "Chimdiebube Sydani",
    email: "chimdiebube@example.com",
    phone: "+234 801 234 5678",
    address: "123 Lekki Phase 1, Lagos",
    joinDate: "2024-01-15",
    ordersCount: 5,
    totalSpent: 125000,
  },
  {
    id: "CUST-002",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 802 345 6789",
    address: "45 Victoria Island, Lagos",
    joinDate: "2024-02-01",
    ordersCount: 2,
    totalSpent: 45000,
  },
  {
    id: "CUST-003",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+234 803 456 7890",
    address: "78 Ikeja GRA, Lagos",
    joinDate: "2024-02-10",
    ordersCount: 1,
    totalSpent: 15000,
  },
  {
    id: "CUST-004",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+234 804 567 8901",
    address: "12 Yaba, Lagos",
    joinDate: "2024-02-15",
    ordersCount: 0,
    totalSpent: 0,
  },
];
