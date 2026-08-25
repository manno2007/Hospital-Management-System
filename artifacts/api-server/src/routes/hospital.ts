import { Router, type IRouter } from "express";

type Department = { id: number; name: string; doctorCount: number };
type Doctor = { id: number; name: string; departmentId: number; departmentName: string };
type Patient = { id: number; name: string; registrationDate: string; appointmentCount: number };
type Appointment = {
  id: number; appointmentDate: string; description: string; patientId: number;
  patientName: string; doctorId: number; doctorName: string; departmentName: string;
};

const departments: Department[] = [
  { id: 1, name: "Cardiology", doctorCount: 2 },
  { id: 2, name: "Neurology", doctorCount: 1 },
  { id: 3, name: "Pediatrics", doctorCount: 2 },
  { id: 4, name: "Orthopedics", doctorCount: 1 },
];
const doctors: Doctor[] = [
  { id: 1, name: "Dr. Maya Hassan", departmentId: 1, departmentName: "Cardiology" },
  { id: 2, name: "Dr. Omar Nassar", departmentId: 1, departmentName: "Cardiology" },
  { id: 3, name: "Dr. Lina Farouk", departmentId: 2, departmentName: "Neurology" },
  { id: 4, name: "Dr. Youssef Adel", departmentId: 3, departmentName: "Pediatrics" },
  { id: 5, name: "Dr. Salma Aziz", departmentId: 3, departmentName: "Pediatrics" },
  { id: 6, name: "Dr. Karim Said", departmentId: 4, departmentName: "Orthopedics" },
];
const patients: Patient[] = [
  { id: 1, name: "Nour El-Sayed", registrationDate: "2026-08-08", appointmentCount: 3 },
  { id: 2, name: "Adam Mostafa", registrationDate: "2026-08-14", appointmentCount: 1 },
  { id: 3, name: "Mariam Tarek", registrationDate: "2026-08-18", appointmentCount: 2 },
  { id: 4, name: "Hassan Mahmoud", registrationDate: "2026-08-21", appointmentCount: 1 },
];
const appointments: Appointment[] = [
  { id: 1, appointmentDate: "2026-08-24T09:00:00.000Z", description: "Routine cardiac follow-up", patientId: 1, patientName: "Nour El-Sayed", doctorId: 1, doctorName: "Dr. Maya Hassan", departmentName: "Cardiology" },
  { id: 2, appointmentDate: "2026-08-24T10:30:00.000Z", description: "Pediatric wellness check", patientId: 2, patientName: "Adam Mostafa", doctorId: 4, doctorName: "Dr. Youssef Adel", departmentName: "Pediatrics" },
  { id: 3, appointmentDate: "2026-08-25T11:00:00.000Z", description: "Migraine assessment", patientId: 3, patientName: "Mariam Tarek", doctorId: 3, doctorName: "Dr. Lina Farouk", departmentName: "Neurology" },
  { id: 4, appointmentDate: "2026-08-26T14:00:00.000Z", description: "Knee mobility consultation", patientId: 4, patientName: "Hassan Mahmoud", doctorId: 6, doctorName: "Dr. Karim Said", departmentName: "Orthopedics" },
];

const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;
const idParam = (value: string) => Number.parseInt(value, 10);
const notFound = (res: { status: (code: number) => { json: (body: unknown) => void } }) =>
  res.status(404).json({ error: "Resource not found" });

const router: IRouter = Router();

router.get("/dashboard", (_req, res) => {
  const today = "2026-08-24";
  res.json({
    departmentCount: departments.length, doctorCount: doctors.length, patientCount: patients.length,
    appointmentCount: appointments.length,
    todayAppointments: appointments.filter((a) => a.appointmentDate.startsWith(today)),
    upcomingAppointments: appointments.filter((a) => !a.appointmentDate.startsWith(today)).slice(0, 5),
  });
});

router.get("/departments", (_req, res) => res.json(departments));
router.get("/departments/:id", (req, res) => {
  const item = departments.find((d) => d.id === idParam(req.params.id));
  return item ? res.json(item) : notFound(res);
});
router.post("/departments", (req, res) => {
  const item = { id: nextId(departments), name: String(req.body.name ?? "").trim(), doctorCount: 0 };
  if (!item.name) return res.status(400).json({ error: "Department name is required" });
  departments.push(item); return res.status(201).json(item);
});
router.patch("/departments/:id", (req, res) => {
  const item = departments.find((d) => d.id === idParam(req.params.id));
  if (!item) return notFound(res);
  item.name = String(req.body.name ?? item.name).trim(); return res.json(item);
});
router.delete("/departments/:id", (req, res) => {
  const index = departments.findIndex((d) => d.id === idParam(req.params.id));
  if (index < 0) return notFound(res);
  departments.splice(index, 1); return res.status(204).send();
});

router.get("/doctors", (_req, res) => res.json(doctors));
router.get("/doctors/:id", (req, res) => {
  const item = doctors.find((d) => d.id === idParam(req.params.id));
  return item ? res.json(item) : notFound(res);
});
router.post("/doctors", (req, res) => {
  const department = departments.find((d) => d.id === Number(req.body.departmentId));
  if (!department || !String(req.body.name ?? "").trim()) return res.status(400).json({ error: "Doctor name and department are required" });
  const item = { id: nextId(doctors), name: String(req.body.name).trim(), departmentId: department.id, departmentName: department.name };
  doctors.push(item); department.doctorCount += 1; return res.status(201).json(item);
});
router.patch("/doctors/:id", (req, res) => {
  const item = doctors.find((d) => d.id === idParam(req.params.id));
  const department = departments.find((d) => d.id === Number(req.body.departmentId));
  if (!item || !department) return notFound(res);
  item.name = String(req.body.name ?? item.name).trim(); item.departmentId = department.id; item.departmentName = department.name;
  return res.json(item);
});
router.delete("/doctors/:id", (req, res) => {
  const index = doctors.findIndex((d) => d.id === idParam(req.params.id));
  if (index < 0) return notFound(res);
  const [item] = doctors.splice(index, 1); const department = departments.find((d) => d.id === item.departmentId);
  if (department) department.doctorCount = Math.max(0, department.doctorCount - 1);
  return res.status(204).send();
});

router.get("/patients", (_req, res) => res.json(patients));
router.get("/patients/:id", (req, res) => {
  const item = patients.find((p) => p.id === idParam(req.params.id));
  return item ? res.json(item) : notFound(res);
});
router.post("/patients", (req, res) => {
  const item = { id: nextId(patients), name: String(req.body.name ?? "").trim(), registrationDate: String(req.body.registrationDate ?? ""), appointmentCount: 0 };
  if (!item.name || !item.registrationDate) return res.status(400).json({ error: "Patient name and registration date are required" });
  patients.push(item); return res.status(201).json(item);
});
router.patch("/patients/:id", (req, res) => {
  const item = patients.find((p) => p.id === idParam(req.params.id));
  if (!item) return notFound(res);
  item.name = String(req.body.name ?? item.name).trim(); item.registrationDate = String(req.body.registrationDate ?? item.registrationDate);
  return res.json(item);
});
router.delete("/patients/:id", (req, res) => {
  const index = patients.findIndex((p) => p.id === idParam(req.params.id));
  if (index < 0) return notFound(res);
  patients.splice(index, 1); return res.status(204).send();
});

const appointmentView = (item: Appointment) => item;
router.get("/appointments", (_req, res) => res.json(appointments.map(appointmentView)));
router.get("/appointments/:id", (req, res) => {
  const item = appointments.find((a) => a.id === idParam(req.params.id));
  return item ? res.json(item) : notFound(res);
});
router.post("/appointments", (req, res) => {
  const patient = patients.find((p) => p.id === Number(req.body.patientId));
  const doctor = doctors.find((d) => d.id === Number(req.body.doctorId));
  if (!patient || !doctor || !req.body.appointmentDate || !String(req.body.description ?? "").trim()) return res.status(400).json({ error: "Appointment date, description, patient, and doctor are required" });
  const item = { id: nextId(appointments), appointmentDate: String(req.body.appointmentDate), description: String(req.body.description).trim(), patientId: patient.id, patientName: patient.name, doctorId: doctor.id, doctorName: doctor.name, departmentName: doctor.departmentName };
  appointments.push(item); patient.appointmentCount += 1; return res.status(201).json(item);
});
router.patch("/appointments/:id", (req, res) => {
  const item = appointments.find((a) => a.id === idParam(req.params.id));
  const patient = patients.find((p) => p.id === Number(req.body.patientId));
  const doctor = doctors.find((d) => d.id === Number(req.body.doctorId));
  if (!item || !patient || !doctor) return notFound(res);
  item.appointmentDate = String(req.body.appointmentDate ?? item.appointmentDate); item.description = String(req.body.description ?? item.description).trim();
  item.patientId = patient.id; item.patientName = patient.name; item.doctorId = doctor.id; item.doctorName = doctor.name; item.departmentName = doctor.departmentName;
  return res.json(item);
});
router.delete("/appointments/:id", (req, res) => {
  const index = appointments.findIndex((a) => a.id === idParam(req.params.id));
  if (index < 0) return notFound(res);
  const [item] = appointments.splice(index, 1); const patient = patients.find((p) => p.id === item.patientId);
  if (patient) patient.appointmentCount = Math.max(0, patient.appointmentCount - 1);
  return res.status(204).send();
});

export default router;