// User types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Pet types
export interface Pet {
  id: string;
  name: string;
  birthDate: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  photos: PetPhoto[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface WeightEntry {
  id: string;
  petId: string;
  date: string;
  value: number;
  unit: 'kg' | 'lbs';
}

// Feeding types
export interface FeedingSchedule {
  id: string;
  petId: string;
  time: string;
  foodType: string;
  portionSize: string;
  portionUnit: string;
  createdAt: string;
}

export interface FeedingRecord {
  id: string;
  scheduleId: string;
  petId: string;
  completedAt: string;
  notes?: string;
}

// Medication types
export interface MedicationSchedule {
  id: string;
  petId: string;
  medicineName: string;
  dosage: string;
  dosageUnit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customFrequency?: string;
  time: string;
  createdAt: string;
}

export interface MedicationRecord {
  id: string;
  scheduleId: string;
  petId: string;
  completedAt: string;
  notes?: string;
}
