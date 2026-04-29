import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Contract, TravelRequest } from "@/data/mockData";
import { formatMZN } from "@/data/mockData";

export const exportContractsPDF = (contracts: Contract[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("TravelControl - Relatório de Contratos", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-MZ")}`, 14, 30);

  autoTable(doc, {
    startY: 38,
    head: [["Ref.", "Agência", "Valor Total", "Consumido", "Disponível", "Estado"]],
    body: contracts.map(c => [
      c.id,
      c.agency,
      formatMZN(c.totalValue),
      formatMZN(c.consumedValue),
      formatMZN(c.totalValue - c.consumedValue),
      c.status === "active" ? "Activo" : c.status === "expired" ? "Expirado" : "Suspenso",
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [26, 54, 93] },
  });

  doc.save("contratos_travelcontrol.pdf");
};

export const exportTravelRequestsPDF = (requests: TravelRequest[]) => {
  const doc = new jsPDF("landscape");
  doc.setFontSize(18);
  doc.text("TravelControl - Solicitações de Viagem", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-MZ")}`, 14, 30);

  autoTable(doc, {
    startY: 38,
    head: [["Ref.", "Colaborador", "Destino", "Partida", "Regresso", "Custo", "Estado"]],
    body: requests.map(tr => [
      tr.id,
      tr.collaborator,
      tr.destination,
      tr.departureDate,
      tr.returnDate,
      formatMZN(tr.estimatedCost),
      tr.status === "pending" ? "Pendente" : tr.status === "approved_gestor" ? "Aprovado (Gestor)" : tr.status === "approved_rh" ? "Aprovado (RH)" : tr.status === "emitted" ? "Emitido" : "Rejeitado",
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [26, 54, 93] },
  });

  doc.save("solicitacoes_travelcontrol.pdf");
};

export const exportFinancialPDF = (contracts: Contract[], requests: TravelRequest[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("TravelControl - Relatório Financeiro", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-MZ")}`, 14, 30);

  const totalBudget = contracts.reduce((s, c) => s + c.totalValue, 0);
  const totalConsumed = contracts.reduce((s, c) => s + c.consumedValue, 0);
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(`Orçamento Total: ${formatMZN(totalBudget)}`, 14, 42);
  doc.text(`Total Consumido: ${formatMZN(totalConsumed)}`, 14, 50);
  doc.text(`Saldo Disponível: ${formatMZN(totalBudget - totalConsumed)}`, 14, 58);

  autoTable(doc, {
    startY: 66,
    head: [["Contrato", "Valor", "Consumido", "Disponível", "%"]],
    body: contracts.map(c => [
      c.agency,
      formatMZN(c.totalValue),
      formatMZN(c.consumedValue),
      formatMZN(c.totalValue - c.consumedValue),
      `${Math.round((c.consumedValue / c.totalValue) * 100)}%`,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [26, 54, 93] },
  });

  doc.save("financeiro_travelcontrol.pdf");
};

export const exportTravelRequestDetailPDF = (tr: TravelRequest, contract?: Contract) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("TravelControl", 14, 22);
  doc.setFontSize(14);
  doc.text("Documento de Viagem", 14, 32);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Referência: ${tr.id}`, 14, 42);
  doc.text(`Data de emissão: ${new Date().toLocaleDateString("pt-MZ")}`, 14, 48);

  doc.setTextColor(0);
  doc.setFontSize(11);
  let y = 62;
  const fields = [
    ["Colaborador", tr.collaborator],
    ["Destino", tr.destination],
    ["Data de Partida", tr.departureDate],
    ["Data de Regresso", tr.returnDate],
    ["Custo Estimado", formatMZN(tr.estimatedCost)],
    ["Motivo", tr.purpose],
    ["Contrato", contract ? `${contract.agency} (${contract.id})` : tr.contractId],
  ];
  fields.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 60, y);
    y += 8;
  });

  doc.save(`viagem_${tr.id}.pdf`);
};
