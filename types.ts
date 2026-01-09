
export type UserType = 'SATINALMA' | 'MUTFAK';

export enum RequestStatus {
  PENDING = 'Beklemede',
  ORDERED = 'Sipariş Verildi',
  RECEIVED = 'Teslim Alındı'
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  phone: string;
  contactPerson: string;
  email: string;
  address: string;
  serviceAreas: string[];
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  brand: string;
  specs: string;
  note: string;
  status: RequestStatus;
  timestamp: string;
  // Filled upon receipt
  receivedDetails?: {
    supplierId: string;
    supplierName: string;
    unitPrice: number;
    vatPercent: number;
    totalExclVat: number;
    totalInclVat: number;
    date: string;
  };
}

export interface PriceHistory {
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  unitPrice: number;
  date: string;
}

export const UNITS = ['kg', 'gr', 'lt', 'adet', 'paket', 'kutu', 'koli', 'çuval', 'kova', 'kavanoz'];

export const SERVICE_AREAS = [
  'taze sebze meyve',
  'kuru baklıyat',
  'donuk gıda',
  'et ürünleri',
  'kahvaltılık',
  'pastacılık',
  'unlu mamulleri',
  'temizlik',
  'kahvaltılık ürünleri'
];
