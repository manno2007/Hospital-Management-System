import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Appointment, Department, Doctor, Patient } from '@workspace/api-client-react';

export type StoreData = { departments: Department[]; doctors: Doctor[]; patients: Patient[]; appointments: Appointment[] };

const seed: StoreData = {
  departments: [
    { id: 1, name: 'Cardiology', doctorCount: 8 },
    { id: 2, name: 'Neurology', doctorCount: 6 },
    { id: 3, name: 'Pediatrics', doctorCount: 7 },
    { id: 4, name: 'Orthopedics', doctorCount: 5 },
    { id: 5, name: 'Oncology', doctorCount: 4 },
  ],
  doctors: [
    { id: 1, name: 'Dr. Amara Okafor', departmentId: 1, departmentName: 'Cardiology' },
    { id: 2, name: 'Dr. Theo Hart', departmentId: 1, departmentName: 'Cardiology' },
    { id: 3, name: 'Dr. Mira Patel', departmentId: 2, departmentName: 'Neurology' },
    { id: 4, name: 'Dr. Julian Reyes', departmentId: 3, departmentName: 'Pediatrics' },
    { id: 5, name: 'Dr. Celeste Wong', departmentId: 4, departmentName: 'Orthopedics' },
    { id: 6, name: 'Dr. Soren Bell', departmentId: 5, departmentName: 'Oncology' },
  ],
  patients: [
    { id: 1, name: 'Nadia Williams', registrationDate: '2024-01-18', appointmentCount: 4 },
    { id: 2, name: 'Elliot Chen', registrationDate: '2024-02-03', appointmentCount: 2 },
    { id: 3, name: 'Maeve Sullivan', registrationDate: '2024-02-21', appointmentCount: 6 },
    { id: 4, name: 'Lionel Adeyemi', registrationDate: '2024-03-07', appointmentCount: 1 },
    { id: 5, name: 'Priya Shah', registrationDate: '2024-03-19', appointmentCount: 3 },
  ],
  appointments: [
    { id: 1, appointmentDate: '2024-06-18T09:00:00', description: 'Follow-up consultation', patientId: 1, patientName: 'Nadia Williams', doctorId: 1, doctorName: 'Dr. Amara Okafor', departmentName: 'Cardiology' },
    { id: 2, appointmentDate: '2024-06-18T10:30:00', description: 'Neurological assessment', patientId: 2, patientName: 'Elliot Chen', doctorId: 3, doctorName: 'Dr. Mira Patel', departmentName: 'Neurology' },
    { id: 3, appointmentDate: '2024-06-18T13:15:00', description: 'Annual wellness visit', patientId: 3, patientName: 'Maeve Sullivan', doctorId: 4, doctorName: 'Dr. Julian Reyes', departmentName: 'Pediatrics' },
    { id: 4, appointmentDate: '2024-06-18T15:00:00', description: 'Treatment planning', patientId: 5, patientName: 'Priya Shah', doctorId: 6, doctorName: 'Dr. Soren Bell', departmentName: 'Oncology' },
    { id: 5, appointmentDate: '2024-06-19T08:30:00', description: 'Mobility review', patientId: 4, patientName: 'Lionel Adeyemi', doctorId: 5, doctorName: 'Dr. Celeste Wong', departmentName: 'Orthopedics' },
    { id: 6, appointmentDate: '2024-06-20T11:00:00', description: 'Cardiac imaging review', patientId: 1, patientName: 'Nadia Williams', doctorId: 2, doctorName: 'Dr. Theo Hart', departmentName: 'Cardiology' },
  ],
};

type Store = StoreData & {
  addDepartment: (name: string) => void;
  updateDepartment: (id: number, name: string) => void;
  removeDepartment: (id: number) => void;
  addDoctor: (name: string, departmentId: number) => void;
  updateDoctor: (id: number, name: string, departmentId: number) => void;
  removeDoctor: (id: number) => void;
  addPatient: (name: string, registrationDate: string) => void;
  updatePatient: (id: number, name: string, registrationDate: string) => void;
  removePatient: (id: number) => void;
  addAppointment: (date: string, description: string, patientId: number, doctorId: number) => void;
  updateAppointment: (id: number, date: string, description: string, patientId: number, doctorId: number) => void;
  removeAppointment: (id: number) => void;
};

const StoreContext = createContext<Store | null>(null);
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

export function HospitalStore({ children }: { children: ReactNode }) {
  const [data, setData] = useState(seed);
  const value = useMemo<Store>(() => ({
    ...data,
    addDepartment: (name) => setData((current) => ({ ...current, departments: [...current.departments, { id: nextId(current.departments), name, doctorCount: 0 }] })),
    updateDepartment: (id, name) => setData((current) => ({ ...current, departments: current.departments.map((item) => item.id === id ? { ...item, name } : item), doctors: current.doctors.map((item) => item.departmentId === id ? { ...item, departmentName: name } : item), appointments: current.appointments.map((item) => item.departmentName === current.departments.find((d) => d.id === id)?.name ? { ...item, departmentName: name } : item) })),
    removeDepartment: (id) => setData((current) => ({ ...current, departments: current.departments.filter((item) => item.id !== id) })),
    addDoctor: (name, departmentId) => setData((current) => { const department = current.departments.find((item) => item.id === departmentId); return { ...current, doctors: [...current.doctors, { id: nextId(current.doctors), name, departmentId, departmentName: department?.name ?? 'Unassigned' }], departments: current.departments.map((item) => item.id === departmentId ? { ...item, doctorCount: item.doctorCount + 1 } : item) }; }),
    updateDoctor: (id, name, departmentId) => setData((current) => { const old = current.doctors.find((item) => item.id === id); const department = current.departments.find((item) => item.id === departmentId); return { ...current, doctors: current.doctors.map((item) => item.id === id ? { ...item, name, departmentId, departmentName: department?.name ?? 'Unassigned' } : item), departments: current.departments.map((item) => item.id === old?.departmentId && old?.departmentId !== departmentId ? { ...item, doctorCount: Math.max(0, item.doctorCount - 1) } : item.id === departmentId && old?.departmentId !== departmentId ? { ...item, doctorCount: item.doctorCount + 1 } : item) }; }),
    removeDoctor: (id) => setData((current) => { const doctor = current.doctors.find((item) => item.id === id); return { ...current, doctors: current.doctors.filter((item) => item.id !== id), departments: current.departments.map((item) => item.id === doctor?.departmentId ? { ...item, doctorCount: Math.max(0, item.doctorCount - 1) } : item) }; }),
    addPatient: (name, registrationDate) => setData((current) => ({ ...current, patients: [...current.patients, { id: nextId(current.patients), name, registrationDate, appointmentCount: 0 }] })),
    updatePatient: (id, name, registrationDate) => setData((current) => ({ ...current, patients: current.patients.map((item) => item.id === id ? { ...item, name, registrationDate } : item), appointments: current.appointments.map((item) => item.patientId === id ? { ...item, patientName: name } : item) })),
    removePatient: (id) => setData((current) => ({ ...current, patients: current.patients.filter((item) => item.id !== id) })),
    addAppointment: (date, description, patientId, doctorId) => setData((current) => { const patient = current.patients.find((item) => item.id === patientId); const doctor = current.doctors.find((item) => item.id === doctorId); return { ...current, appointments: [...current.appointments, { id: nextId(current.appointments), appointmentDate: date, description, patientId, patientName: patient?.name ?? 'Unknown patient', doctorId, doctorName: doctor?.name ?? 'Unknown doctor', departmentName: doctor?.departmentName ?? 'Unassigned' }], patients: current.patients.map((item) => item.id === patientId ? { ...item, appointmentCount: item.appointmentCount + 1 } : item) }; }),
    updateAppointment: (id, date, description, patientId, doctorId) => setData((current) => { const old = current.appointments.find((item) => item.id === id); const patient = current.patients.find((item) => item.id === patientId); const doctor = current.doctors.find((item) => item.id === doctorId); return { ...current, appointments: current.appointments.map((item) => item.id === id ? { ...item, appointmentDate: date, description, patientId, patientName: patient?.name ?? 'Unknown patient', doctorId, doctorName: doctor?.name ?? 'Unknown doctor', departmentName: doctor?.departmentName ?? 'Unassigned' } : item), patients: current.patients.map((item) => item.id === old?.patientId && old.patientId !== patientId ? { ...item, appointmentCount: Math.max(0, item.appointmentCount - 1) } : item.id === patientId && old?.patientId !== patientId ? { ...item, appointmentCount: item.appointmentCount + 1 } : item) }; }),
    removeAppointment: (id) => setData((current) => ({ ...current, appointments: current.appointments.filter((item) => item.id !== id) })),
  }), [data]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useHospitalStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('HospitalStore is required');
  return store;
}