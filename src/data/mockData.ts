// src/data/mockData.ts

export interface Contract {
  id: string;
  agency: string;
  totalValue: number;
  consumedValue: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "suspended";
  contactPerson: string;
  contactEmail: string;
}

export interface TravelRequest {
  id: string;
  contractId: string;
  requester: string;
  collaborator: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: number;
  status: "pending" | "approved_gestor" | "approved_rh" | "emitted" | "rejected";
  createdAt: string;
  agencyNotified: boolean;
  purpose: string;
}

export interface Notification {
  id: string;
  travelRequestId: string;
  type: "email" | "pdf";
  sentAt: string;
  recipient: string;
}

export interface Collaborator {
  id: string;
  name: string;
  department: string;
  position: string;
}

export const collaborators: Collaborator[] = [
  { id: "COL01", name: "João Nguenha", department: "Engenharia", position: "Eng. Sénior" },
  { id: "COL02", name: "Ana Sitoe", department: "Comercial", position: "Gestora de Contas" },
  { id: "COL03", name: "Pedro Cossa", department: "Financeiro", position: "Analista" },
  { id: "COL04", name: "Sara Mabjaia", department: "Marketing", position: "Coordenadora" },
  { id: "COL05", name: "Rui Tembe", department: "Operações", position: "Director" },
  { id: "COL06", name: "Luisa Mabunda", department: "RH", position: "Técnica de RH" },
  { id: "COL07", name: "Nelson Dinis", department: "TI", position: "Administrador de Sistemas" },
];

export const contracts: Contract[] = [
  { id: "CTR-001", agency: "Moztur Viagens, Lda", totalValue: 9500000, consumedValue: 4275000, startDate: "2026-01-01", endDate: "2026-12-31", status: "active", contactPerson: "Alberto Machava", contactEmail: "reservas@moztur.co.mz" },
  { id: "CTR-002", agency: "TravelCorp Moçambique, SA", totalValue: 5200000, consumedValue: 4680000, startDate: "2025-06-01", endDate: "2026-05-31", status: "active", contactPerson: "Celina Nhamitambo", contactEmail: "bookings@travelcorp.co.mz" },
  { id: "CTR-003", agency: "Girassol Tours", totalValue: 3200000, consumedValue: 3200000, startDate: "2025-01-01", endDate: "2025-12-31", status: "expired", contactPerson: "Dércio Langa", contactEmail: "info@girassoltours.co.mz" },
  { id: "CTR-004", agency: "Índico Viagens", totalValue: 7800000, consumedValue: 1560000, startDate: "2026-03-01", endDate: "2027-02-28", status: "active", contactPerson: "Helena Zavala", contactEmail: "corporate@indicoviagens.co.mz" },
];

export const travelRequests: TravelRequest[] = [
  // MAPUTO - 5 viagens
  { id: "SOL-001", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "João Nguenha", destination: "Maputo, Moçambique", departureDate: "2026-04-15", returnDate: "2026-04-18", estimatedCost: 185000, status: "emitted", createdAt: "2026-04-01", agencyNotified: true, purpose: "Reunião com fornecedores" },
  { id: "SOL-002", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "Ana Sitoe", destination: "Maputo, Moçambique", departureDate: "2026-04-20", returnDate: "2026-04-25", estimatedCost: 420000, status: "emitted", createdAt: "2026-03-28", agencyNotified: true, purpose: "Conferência internacional" },
  { id: "SOL-003", contractId: "CTR-002", requester: "Fatima Macuácua", collaborator: "Pedro Cossa", destination: "Maputo, Moçambique", departureDate: "2026-05-01", returnDate: "2026-05-03", estimatedCost: 145000, status: "emitted", createdAt: "2026-03-15", agencyNotified: true, purpose: "Auditoria regional" },
  { id: "SOL-004", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "Sara Mabjaia", destination: "Maputo, Moçambique", departureDate: "2026-05-10", returnDate: "2026-05-14", estimatedCost: 580000, status: "approved_rh", createdAt: "2026-03-20", agencyNotified: false, purpose: "Feira de tecnologia" },
  { id: "SOL-005", contractId: "CTR-002", requester: "Fatima Macuácua", collaborator: "Rui Tembe", destination: "Maputo, Moçambique", departureDate: "2026-04-08", returnDate: "2026-04-10", estimatedCost: 95000, status: "approved_rh", createdAt: "2026-03-25", agencyNotified: false, purpose: "Formação de equipa" },
  
  // JOANESBURGO - 4 viagens
  { id: "SOL-006", contractId: "CTR-004", requester: "Fatima Macuácua", collaborator: "Luisa Mabunda", destination: "Joanesburgo, África do Sul", departureDate: "2026-05-20", returnDate: "2026-05-22", estimatedCost: 120000, status: "emitted", createdAt: "2026-04-02", agencyNotified: true, purpose: "Workshop de RH" },
  { id: "SOL-007", contractId: "CTR-004", requester: "Fatima Macuácua", collaborator: "Nelson Dinis", destination: "Joanesburgo, África do Sul", departureDate: "2026-06-01", returnDate: "2026-06-05", estimatedCost: 210000, status: "approved_gestor", createdAt: "2026-04-03", agencyNotified: false, purpose: "Conferência de TI" },
  { id: "SOL-008", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "João Nguenha", destination: "Joanesburgo, África do Sul", departureDate: "2026-04-25", returnDate: "2026-04-26", estimatedCost: 35000, status: "emitted", createdAt: "2026-03-10", agencyNotified: true, purpose: "Visita técnica" },
  { id: "SOL-009", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "Ana Sitoe", destination: "Joanesburgo, África do Sul", departureDate: "2026-07-15", returnDate: "2026-07-18", estimatedCost: 195000, status: "pending", createdAt: "2026-06-20", agencyNotified: false, purpose: "Reunião comercial" },
  
  // LISBOA - 3 viagens
  { id: "SOL-010", contractId: "CTR-002", requester: "Fatima Macuácua", collaborator: "Pedro Cossa", destination: "Lisboa, Portugal", departureDate: "2026-08-01", returnDate: "2026-08-05", estimatedCost: 320000, status: "pending", createdAt: "2026-07-05", agencyNotified: false, purpose: "Conferência europeia" },
  { id: "SOL-011", contractId: "CTR-002", requester: "Fatima Macuácua", collaborator: "Sara Mabjaia", destination: "Lisboa, Portugal", departureDate: "2026-09-10", returnDate: "2026-09-15", estimatedCost: 280000, status: "approved_gestor", createdAt: "2026-08-10", agencyNotified: false, purpose: "Feira de turismo" },
  { id: "SOL-012", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "Rui Tembe", destination: "Lisboa, Portugal", departureDate: "2026-10-05", returnDate: "2026-10-12", estimatedCost: 450000, status: "pending", createdAt: "2026-09-15", agencyNotified: false, purpose: "Reunião estratégica" },
  
  // NAIROBI - 2 viagens
  { id: "SOL-013", contractId: "CTR-004", requester: "Fatima Macuácua", collaborator: "Luisa Mabunda", destination: "Nairobi, Quénia", departureDate: "2026-11-01", returnDate: "2026-11-04", estimatedCost: 180000, status: "pending", createdAt: "2026-10-01", agencyNotified: false, purpose: "Workshop regional" },
  { id: "SOL-014", contractId: "CTR-003", requester: "Fatima Macuácua", collaborator: "Nelson Dinis", destination: "Nairobi, Quénia", departureDate: "2026-12-05", returnDate: "2026-12-08", estimatedCost: 160000, status: "pending", createdAt: "2026-11-10", agencyNotified: false, purpose: "Conferência de tecnologia" },
  
  // DAR ES SALAAM - 1 viagem
  { id: "SOL-015", contractId: "CTR-004", requester: "Fatima Macuácua", collaborator: "João Nguenha", destination: "Dar es Salaam, Tanzânia", departureDate: "2026-12-10", returnDate: "2026-12-15", estimatedCost: 250000, status: "pending", createdAt: "2026-11-15", agencyNotified: false, purpose: "Exposição internacional" },
  
  // CIDADE DO CABO - 1 viagem
  { id: "SOL-016", contractId: "CTR-001", requester: "Fatima Macuácua", collaborator: "Ana Sitoe", destination: "Cidade do Cabo, África do Sul", departureDate: "2026-11-20", returnDate: "2026-11-25", estimatedCost: 300000, status: "pending", createdAt: "2026-10-20", agencyNotified: false, purpose: "Conferência turística" },
  
  // BEIRA - 1 viagem
  { id: "SOL-017", contractId: "CTR-002", requester: "Fatima Macuácua", collaborator: "Pedro Cossa", destination: "Beira, Moçambique", departureDate: "2026-12-01", returnDate: "2026-12-03", estimatedCost: 45000, status: "pending", createdAt: "2026-11-01", agencyNotified: false, purpose: "Reunião com parceiros" },
];

export const notifications: Notification[] = [
  { id: "NOT-001", travelRequestId: "SOL-001", type: "email", sentAt: "2026-04-01T10:30:00", recipient: "reservas@moztur.co.mz" },
  { id: "NOT-002", travelRequestId: "SOL-001", type: "pdf", sentAt: "2026-04-01T10:30:00", recipient: "reservas@moztur.co.mz" },
  { id: "NOT-003", travelRequestId: "SOL-002", type: "email", sentAt: "2026-03-28T09:15:00", recipient: "reservas@moztur.co.mz" },
  { id: "NOT-004", travelRequestId: "SOL-003", type: "email", sentAt: "2026-03-15T14:20:00", recipient: "bookings@travelcorp.co.mz" },
  { id: "NOT-005", travelRequestId: "SOL-006", type: "email", sentAt: "2026-04-02T11:00:00", recipient: "corporate@indicoviagens.co.mz" },
  { id: "NOT-006", travelRequestId: "SOL-008", type: "email", sentAt: "2026-03-10T16:30:00", recipient: "reservas@moztur.co.mz" },
];

export const statusLabels: Record<TravelRequest["status"], string> = {
  pending: "Pendente",
  approved_gestor: "Aprovado (Gestor)",
  approved_rh: "Aprovado (RH)",
  emitted: "Emitido",
  rejected: "Rejeitado",
};

export const statusColors: Record<TravelRequest["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  approved_gestor: "bg-blue-100 text-blue-700",
  approved_rh: "bg-green-100 text-green-700",
  emitted: "bg-purple-100 text-purple-700",
  rejected: "bg-red-100 text-red-700",
};

export const contractStatusLabels: Record<Contract["status"], string> = {
  active: "Activo",
  expired: "Expirado",
  suspended: "Suspenso",
};

export const formatMZN = (value: number) => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};