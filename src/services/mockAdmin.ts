import { Customer, Reading, findCustomerByIdOrMeter, getHistory as getHistoryByMeter } from './mockApi';

export const customers: Customer[] = [
  { id: 'c1', cedula: '0102030405', name: 'Juan Pérez', meterNumber: 'M-1001' },
  { id: 'c2', cedula: '0912345678', name: 'Ana López', meterNumber: 'M-1002' },
  { id: 'c3', cedula: '0801234567', name: 'Carlos Ruiz', meterNumber: 'M-1003' },
  { id: 'c4', cedula: '0709876543', name: 'María González', meterNumber: 'M-1004' },
  { id: 'c5', cedula: '0604567890', name: 'Luis Martínez', meterNumber: 'M-1005' },
  { id: 'c6', cedula: '0503210987', name: 'Carmen Vega', meterNumber: 'M-1006' },
  { id: 'c7', cedula: '0407890123', name: 'Roberto Silva', meterNumber: 'M-1007' },
  { id: 'c8', cedula: '0306543210', name: 'Patricia Herrera', meterNumber: 'M-1008' },
  { id: 'c9', cedula: '0209876543', name: 'Fernando Castro', meterNumber: 'M-1009' },
  { id: 'c10', cedula: '0104567890', name: 'Isabel Morales', meterNumber: 'M-1010' },
];

// Tipos para lectores y auditoría
export interface Reader {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  totalReadings: number;
  totalChanges: number;
}

export interface ReaderAuditLog {
  id: string;
  readerId: string;
  readerName: string;
  action: 'reading_updated' | 'reading_created' | 'reading_deleted' | 'customer_updated';
  description: string;
  oldValue?: string;
  newValue?: string;
  meterNumber: string;
  customerName: string;
  timestamp: string;
  ipAddress?: string;
}

// Datos mock de lectores
export const readers: Reader[] = [
  {
    id: 'r1',
    code: 'L001',
    name: 'Juan Pérez',
    email: 'juan.lector@agua.com',
    phone: '0987654321',
    status: 'active',
    lastActive: '2024-01-15 14:30:00',
    totalReadings: 45,
    totalChanges: 12
  },
  {
    id: 'r2',
    code: 'L002',
    name: 'Ana López',
    email: 'ana.lector@agua.com',
    phone: '0987654322',
    status: 'active',
    lastActive: '2024-01-15 13:45:00',
    totalReadings: 38,
    totalChanges: 8
  },
  {
    id: 'r3',
    code: 'L003',
    name: 'Carlos Ruiz',
    email: 'carlos.lector@agua.com',
    phone: '0987654323',
    status: 'active',
    lastActive: '2024-01-15 12:15:00',
    totalReadings: 52,
    totalChanges: 15
  },
  {
    id: 'r4',
    code: 'L004',
    name: 'María González',
    email: 'maria.lector@agua.com',
    phone: '0987654324',
    status: 'inactive',
    lastActive: '2024-01-10 09:20:00',
    totalReadings: 28,
    totalChanges: 5
  },
  {
    id: 'r5',
    code: 'L005',
    name: 'Roberto Silva',
    email: 'roberto.lector@agua.com',
    phone: '0987654325',
    status: 'suspended',
    lastActive: '2024-01-08 16:45:00',
    totalReadings: 15,
    totalChanges: 3
  }
];

// Logs de auditoría de lectores
export const readerAuditLogs: ReaderAuditLog[] = [
  {
    id: 'al1',
    readerId: 'r1',
    readerName: 'Juan Pérez',
    action: 'reading_updated',
    description: 'Actualizó lectura del medidor M-1001',
    oldValue: 'Lectura anterior: 1250',
    newValue: 'Nueva lectura: 1280',
    meterNumber: 'M-1001',
    customerName: 'Juan Pérez',
    timestamp: '2024-01-15 14:30:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'al2',
    readerId: 'r1',
    readerName: 'Juan Pérez',
    action: 'reading_created',
    description: 'Creó nueva lectura para medidor M-1002',
    newValue: 'Lectura: 890',
    meterNumber: 'M-1002',
    customerName: 'Ana López',
    timestamp: '2024-01-15 14:25:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'al3',
    readerId: 'r2',
    readerName: 'Ana López',
    action: 'reading_updated',
    description: 'Corrigió lectura del medidor M-1003',
    oldValue: 'Lectura anterior: 1560',
    newValue: 'Lectura corregida: 1540',
    meterNumber: 'M-1003',
    customerName: 'Carlos Ruiz',
    timestamp: '2024-01-15 13:45:00',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'al4',
    readerId: 'r3',
    readerName: 'Carlos Ruiz',
    action: 'customer_updated',
    description: 'Actualizó información del cliente',
    oldValue: 'Teléfono: 0987654321',
    newValue: 'Teléfono: 0987654329',
    meterNumber: 'M-1004',
    customerName: 'María González',
    timestamp: '2024-01-15 12:15:00',
    ipAddress: '192.168.1.102'
  },
  {
    id: 'al5',
    readerId: 'r1',
    readerName: 'Juan Pérez',
    action: 'reading_deleted',
    description: 'Eliminó lectura duplicada del medidor M-1001',
    oldValue: 'Lectura duplicada: 1285',
    meterNumber: 'M-1001',
    customerName: 'Juan Pérez',
    timestamp: '2024-01-15 11:20:00',
    ipAddress: '192.168.1.100'
  }
];

export function getHistory(meterNumber: string): Reading[] {
  return getHistoryByMeter(meterNumber);
}

export function findCustomer(query: string) {
  return findCustomerByIdOrMeter(query);
}

// Funciones para gestión de lectores
export function getReaderById(readerId: string): Reader | undefined {
  return readers.find(reader => reader.id === readerId);
}

export function getReaderByCode(code: string): Reader | undefined {
  return readers.find(reader => reader.code === code);
}

export function getReaderAuditLogs(readerId: string): ReaderAuditLog[] {
  return readerAuditLogs.filter(log => log.readerId === readerId);
}

export function getReaderAuditLogsByDateRange(startDate: string, endDate: string): ReaderAuditLog[] {
  return readerAuditLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return logDate >= start && logDate <= end;
  });
}

export function getReaderAuditLogsByAction(action: string): ReaderAuditLog[] {
  return readerAuditLogs.filter(log => log.action === action);
}


