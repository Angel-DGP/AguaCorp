import { addMonths, format } from 'date-fns';

export type Customer = {
  id: string;
  cedula: string;
  name: string;
  meterNumber: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type Reading = {
  id: string;
  meterNumber: string;
  date: string; // ISO
  value: number;
  diff: number; // vs previous
  amount: number; // dollars
  paid: boolean;
  createdAt: number; // timestamp when created
  isEditable: boolean; // whether this reading can be edited
};

export type ReaderUser = { id: string; name: string; assignedMeters: string[] };

const customers: Customer[] = [
  { 
    id: 'c1', 
    cedula: '0102030405', 
    name: 'Juan Pérez', 
    meterNumber: 'M-1001',
    address: 'Av. Principal 123, Quito',
    phone: '0987654321',
    email: 'juan.perez@email.com'
  },
  { 
    id: 'c2', 
    cedula: '0912345678', 
    name: 'Ana López', 
    meterNumber: 'M-1002',
    address: 'Calle Secundaria 456, Guayaquil',
    phone: '0998765432',
    email: 'ana.lopez@email.com'
  },
];

const readings: Reading[] = (() => {
  const arr: Reading[] = [];
  const baseDate = new Date('2023-01-15');
  const base = { 'M-1001': 120, 'M-1002': 80 } as Record<string, number>;
  
  // Generate readings from 2023 to current date
  const currentDate = new Date();
  const startDate = new Date('2023-01-15');
  let currentMonth = startDate;
  
  while (currentMonth <= currentDate) {
    for (const meter of Object.keys(base)) {
      const prev = arr.filter((r) => r.meterNumber === meter).at(-1)?.value ?? base[meter];
      const value = prev + Math.round(10 + Math.random() * 25);
      const diff = value - prev;
      const amount = diff * 0.8; // tarifa mock
      
      arr.push({
        id: `${meter}-${currentMonth.getTime()}`,
        meterNumber: meter,
        date: currentMonth.toISOString(),
        value,
        diff,
        amount,
        paid: Math.random() > 0.3,
        createdAt: currentMonth.getTime(),
        isEditable: false, // Historical readings are not editable
      });
    }
    currentMonth = addMonths(currentMonth, 1);
  }
  
  return arr;
})();

export function findCustomerByIdOrMeter(query: string): Customer | undefined {
  return customers.find((c) => c.cedula === query || c.meterNumber === query);
}

export function updateCustomer(customerId: string, updates: Partial<Pick<Customer, 'name' | 'cedula'>>): Customer {
  const idx = customers.findIndex(c => c.id === customerId);
  if (idx === -1) {
    throw new Error('Customer not found');
  }
  const updated: Customer = { ...customers[idx], ...updates };
  customers[idx] = updated;
  return updated;
}

export function getCurrentReading(meterNumber: string): Reading | undefined {
  return readings.filter((r) => r.meterNumber === meterNumber).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
}

export function getHistory(meterNumber: string): Reading[] {
  return readings
    .filter((r) => r.meterNumber === meterNumber)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function addReading(meterNumber: string, value: number, date = new Date()): Reading {
  const last = getCurrentReading(meterNumber);
  const diff = last ? value - last.value : value;
  const amount = Math.max(diff, 0) * 0.8;
  const newR: Reading = {
    id: `${meterNumber}-${Date.now()}`,
    meterNumber,
    date: date.toISOString(),
    value,
    diff,
    amount,
    paid: false,
    createdAt: Date.now(),
    isEditable: true, // New readings are editable
  };
  readings.push(newR);
  return newR;
}

export function updateReading(readingId: string, newValue: number): Reading {
  const readingIndex = readings.findIndex(r => r.id === readingId);
  if (readingIndex === -1) {
    throw new Error('Reading not found');
  }
  
  const reading = readings[readingIndex];
  if (!reading.isEditable) {
    throw new Error('This reading cannot be edited');
  }
  
  console.log('Updating reading:', readingId, 'from', reading.value, 'to', newValue);
  
  // Calculate new diff and amount for the current reading
  const prevReading = readings
    .filter(r => r.meterNumber === reading.meterNumber && r.date < reading.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .at(-1);
  
  const newDiff = prevReading ? newValue - prevReading.value : newValue;
  const newAmount = Math.max(newDiff, 0) * 0.8;
  
  // Update the current reading
  const updatedReading: Reading = {
    ...reading,
    value: newValue,
    diff: newDiff,
    amount: newAmount,
  };
  
  readings[readingIndex] = updatedReading;
  
  // Recalculate all subsequent readings for this meter
  const subsequentReadings = readings
    .filter(r => r.meterNumber === reading.meterNumber && r.date > reading.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  
  console.log('Recalculating', subsequentReadings.length, 'subsequent readings');
  
  let currentValue = newValue;
  for (const subsequentReading of subsequentReadings) {
    const subsequentIndex = readings.findIndex(r => r.id === subsequentReading.id);
    if (subsequentIndex !== -1) {
      const newDiff = subsequentReading.value - currentValue;
      const newAmount = Math.max(newDiff, 0) * 0.8;
      
      readings[subsequentIndex] = {
        ...subsequentReading,
        diff: newDiff,
        amount: newAmount,
      };
      
      currentValue = subsequentReading.value;
    }
  }
  
  console.log('Reading updated successfully. New diff:', newDiff, 'New amount:', newAmount);
  return updatedReading;
}

export function getBankInfo() {
  return {
    accountName: 'Corporación de Agua',
    accountNumber: '1234567890',
    bank: 'Banco Nacional',
    instructions: 'Transferir el monto exacto y enviar comprobante.',
  };
}

export function formatMonth(dateIso: string) {
  const date = new Date(dateIso);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} del ${year}`;
}

export function deleteCustomer(id: string): boolean {
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    return false;
  }
  
  // Remove customer
  customers.splice(customerIndex, 1);
  
  // Remove all readings for this customer's meter
  const customer = customers.find(c => c.id === id);
  if (customer) {
    const meterNumber = customer.meterNumber;
    for (let i = readings.length - 1; i >= 0; i--) {
      if (readings[i].meterNumber === meterNumber) {
        readings.splice(i, 1);
      }
    }
  }
  
  console.log('Customer deleted successfully:', id);
  return true;
}


