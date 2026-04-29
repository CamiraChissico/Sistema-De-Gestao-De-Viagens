import React, { createContext, useContext, useState, useCallback } from "react";
import {
  contracts as initialContracts,
  travelRequests as initialRequests,
  notifications as initialNotifications,
  collaborators as initialCollaborators,
  type Contract,
  type TravelRequest,
  type Notification,
  type Collaborator,
} from "@/data/mockData";

interface TravelDataContextType {
  contracts: Contract[];
  travelRequests: TravelRequest[];
  notifications: Notification[];
  collaborators: Collaborator[];
  approveRequest: (id: string, role: "gestor" | "rh") => void;
  rejectRequest: (id: string) => void;
  emitRequest: (id: string) => void;
  addTravelRequest: (data: Omit<TravelRequest, "id" | "createdAt" | "agencyNotified" | "status">) => void;
  addContract: (data: Omit<Contract, "id" | "consumedValue" | "status">) => void;
  addCollaborator: (data: Omit<Collaborator, "id">) => void;
}

const TravelDataContext = createContext<TravelDataContextType | null>(null);

export const TravelDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>(initialRequests);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);

  const approveRequest = useCallback((id: string, role: "gestor" | "rh") => {
    setTravelRequests(prev => prev.map(tr => {
      if (tr.id !== id) return tr;
      if (role === "gestor" && tr.status === "pending") return { ...tr, status: "approved_gestor" as const };
      if (role === "rh" && tr.status === "approved_gestor") return { ...tr, status: "approved_rh" as const };
      return tr;
    }));
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setTravelRequests(prev => prev.map(tr =>
      tr.id === id ? { ...tr, status: "rejected" as const } : tr
    ));
  }, []);

  const emitRequest = useCallback((id: string) => {
    setTravelRequests(prev => {
      const updated = prev.map(tr => {
        if (tr.id !== id) return tr;
        return { ...tr, status: "emitted" as const, agencyNotified: true };
      });
      const req = updated.find(tr => tr.id === id);
      if (req) {
        const contract = contracts.find(c => c.id === req.contractId);
        if (contract) {
          setContracts(cs => cs.map(c =>
            c.id === contract.id ? { ...c, consumedValue: c.consumedValue + req.estimatedCost } : c
          ));
        }
        const newNotif: Notification = {
          id: `NOT-${Date.now()}`,
          travelRequestId: id,
          type: "email",
          sentAt: new Date().toISOString(),
          recipient: contract?.contactEmail || "",
        };
        setNotifications(ns => [...ns, newNotif]);
      }
      return updated;
    });
  }, [contracts]);

  const addTravelRequest = useCallback((data: Omit<TravelRequest, "id" | "createdAt" | "agencyNotified" | "status">) => {
    const newReq: TravelRequest = {
      ...data,
      id: `SOL-${String(travelRequests.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      agencyNotified: false,
      status: "pending",
    };
    setTravelRequests(prev => [...prev, newReq]);
  }, [travelRequests]);

  const addContract = useCallback((data: Omit<Contract, "id" | "consumedValue" | "status">) => {
    const newContract: Contract = {
      ...data,
      id: `CTR-${String(contracts.length + 1).padStart(3, "0")}`,
      consumedValue: 0,
      status: "active",
    };
    setContracts(prev => [...prev, newContract]);
  }, [contracts]);

  const addCollaborator = useCallback((data: Omit<Collaborator, "id">) => {
    const newCol: Collaborator = {
      ...data,
      id: `COL${String(collaborators.length + 1).padStart(2, "0")}`,
    };
    setCollaborators(prev => [...prev, newCol]);
  }, [collaborators]);

  return (
    <TravelDataContext.Provider value={{ 
      contracts, 
      travelRequests, 
      notifications, 
      collaborators, 
      approveRequest, 
      rejectRequest, 
      emitRequest, 
      addTravelRequest, 
      addContract, 
      addCollaborator 
    }}>
      {children}
    </TravelDataContext.Provider>
  );
};

export const useTravelData = () => {
  const ctx = useContext(TravelDataContext);
  if (!ctx) throw new Error("useTravelData must be used within TravelDataProvider");
  return ctx;
};