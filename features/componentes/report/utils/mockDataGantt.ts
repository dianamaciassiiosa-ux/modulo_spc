

/* =========================================================
   Rango del Gantt
   Desde hoy hasta 15 días después
   ========================================================= */

import { Snapshot } from "@/features/planner/gantt.types";

const today = new Date();

export const ganttRangeStart = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0,
  0,
);

export const ganttRangeEnd = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 15,
  23,
  59,
  59,
  999,
);

/**
 * Genera una fecha ISO tomando como referencia el día de hoy.
 *
 * @param dayOffset Días después de hoy.
 * @param hour Hora local.
 * @param minute Minutos.
 */
function isoFromToday(
  dayOffset: number,
  hour = 8,
  minute = 0,
): string {
  if (dayOffset < 0 || dayOffset > 15) {
    throw new Error(
      `El desplazamiento ${dayOffset} está fuera del rango permitido de 0 a 15 días.`,
    );
  }

  const date = new Date(
    ganttRangeStart.getFullYear(),
    ganttRangeStart.getMonth(),
    ganttRangeStart.getDate() + dayOffset,
    hour,
    minute,
    0,
    0,
  );

  if (
    date.getTime() < ganttRangeStart.getTime() ||
    date.getTime() > ganttRangeEnd.getTime()
  ) {
    throw new Error(
      `La fecha ${date.toISOString()} está fuera del rango del Gantt.`,
    );
  }

  return date.toISOString();
}

/* =========================================================
   Columnas visibles
   ========================================================= */



/* =========================================================
   Snapshot de ejemplo
   ========================================================= */

export const mockSnapshot: Snapshot = {
  title: "Programa de producción de los próximos 15 días",

  description:
    "Planeación de operaciones de corte, doblez, soldadura, pintura y ensamble.",

  tasks: [
    /* =====================================================
       PROYECTO 1
       ===================================================== */

    {
      id: "summary-project-001",
      text: "Proyecto PR-001 - Estructura metálica",
      start: isoFromToday(0, 7, 0),
      end: isoFromToday(5, 17, 0),
      parent: null,
      type: "Summary",
      progress: 0.42,
      status: "Running",
      reason: "",
      quantity: 50,
      open: true,
    },

    {
      id: "task-cutting-001",
      text: "Corte de lámina",
      assignee: {
        name: "Carlos Hernández",
        code: "OP-001",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000001",
      },
      start: isoFromToday(0, 7, 0),
      end: isoFromToday(0, 13, 30),
      parent: "summary-project-001",
      resource: "Láser 1",
      resource_id: "101c4e79-86c8-4307-9149-101000000001",
      operation: "Corte",
      type: "Task",
      progress: 1,
      status: "Completed",
      reason: "",
      quantity: 50,
    },

    {
      id: "task-bending-001",
      text: "Doblez de piezas",
      assignee: {
        name: "María López",
        code: "OP-002",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000002",
      },
      start: isoFromToday(1, 8, 0),
      end: isoFromToday(1, 16, 0),
      parent: "summary-project-001",
      resource: "Dobladora 2",
      resource_id: "101c4e79-86c8-4307-9149-101000000002",
      operation: "Doblez",
      type: "Task",
      progress: 0.65,
      status: "Running",
      reason: "",
      quantity: 50,
    },

    {
      id: "task-welding-001",
      text: "Soldadura de estructura",
      assignee: {
        name: "José Ramírez",
        code: "OP-003",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000003",
      },
      start: isoFromToday(2, 7, 30),
      end: isoFromToday(3, 15, 30),
      parent: "summary-project-001",
      resource: "Estación de soldadura 1",
      resource_id: "101c4e79-86c8-4307-9149-101000000003",
      operation: "Soldadura",
      type: "Task",
      progress: 0.15,
      status: "Scheduled",
      reason: "",
      quantity: 50,
    },

    {
      id: "task-painting-001",
      text: "Aplicación de pintura",
      assignee: {
        name: "Ana Torres",
        code: "OP-004",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000004",
      },
      start: isoFromToday(4, 8, 0),
      end: isoFromToday(4, 16, 30),
      parent: "summary-project-001",
      resource: "Cabina de pintura",
      resource_id: "101c4e79-86c8-4307-9149-101000000004",
      operation: "Pintura",
      type: "Task",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 50,
    },

    {
      id: "milestone-quality-001",
      text: "Liberación de calidad",
      start: isoFromToday(5, 15, 0),
      end: isoFromToday(5, 15, 0),
      parent: "summary-project-001",
      operation: "Inspección final",
      type: "Milestone",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 0,
    },

    /* =====================================================
       PROYECTO 2
       ===================================================== */

    {
      id: "summary-project-002",
      text: "Proyecto PR-002 - Gabinete eléctrico",
      start: isoFromToday(3, 8, 0),
      end: isoFromToday(10, 17, 0),
      parent: null,
      type: "Summary",
      progress: 0.2,
      status: "Running",
      reason: "",
      quantity: 24,
      open: true,
    },

    {
      id: "task-setup-002",
      text: "Preparación de máquina",
      assignee: {
        name: "Luis Martínez",
        code: "OP-005",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000005",
      },
      start: isoFromToday(3, 8, 0),
      end: isoFromToday(3, 10, 0),
      parent: "summary-project-002",
      resource: "Centro de maquinado 1",
      resource_id: "101c4e79-86c8-4307-9149-101000000005",
      operation: "Setup",
      type: "Task",
      progress: 0.8,
      status: "Setup",
      reason: "",
      quantity: 24,
    },

    {
      id: "task-machining-002",
      text: "Maquinado de componentes",
      assignee: {
        name: "Luis Martínez",
        code: "OP-005",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000005",
      },
      start: isoFromToday(3, 10, 0),
      end: isoFromToday(6, 14, 0),
      parent: "summary-project-002",
      resource: "Centro de maquinado 1",
      resource_id: "101c4e79-86c8-4307-9149-101000000005",
      operation: "Maquinado",
      type: "Task",
      progress: 0.25,
      status: "Running",
      reason: "",
      quantity: 24,
      qty_scrap: 1,
      reason_scrap: "Dimensión fuera de tolerancia",
    },

    {
      id: "task-electrical-assembly-002",
      text: "Ensamble eléctrico",
      assignee: {
        name: "Fernanda Silva",
        code: "OP-006",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000006",
      },
      start: isoFromToday(7, 8, 0),
      end: isoFromToday(9, 16, 0),
      parent: "summary-project-002",
      resource: "Estación eléctrica 2",
      resource_id: "101c4e79-86c8-4307-9149-101000000006",
      operation: "Ensamble eléctrico",
      type: "Task",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 24,
    },

    {
      id: "task-testing-002",
      text: "Pruebas funcionales",
      assignee: {
        name: "Ricardo Flores",
        code: "QA-001",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000007",
      },
      start: isoFromToday(10, 8, 0),
      end: isoFromToday(10, 15, 0),
      parent: "summary-project-002",
      resource: "Estación de pruebas",
      resource_id: "101c4e79-86c8-4307-9149-101000000007",
      operation: "Pruebas",
      type: "Task",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 24,
    },

    /* =====================================================
       PROYECTO 3
       ===================================================== */

    {
      id: "summary-project-003",
      text: "Proyecto PR-003 - Base para maquinaria",
      start: isoFromToday(6, 7, 0),
      end: isoFromToday(15, 16, 0),
      parent: null,
      type: "Summary",
      progress: 0.1,
      status: "Scheduled",
      reason: "",
      quantity: 12,
      open: true,
    },

    {
      id: "task-material-check-003",
      text: "Validación de material",
      assignee: {
        name: "Daniel Ortega",
        code: "ALM-001",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000008",
      },
      start: isoFromToday(6, 7, 0),
      end: isoFromToday(6, 9, 0),
      parent: "summary-project-003",
      resource: "Almacén de materia prima",
      resource_id: "101c4e79-86c8-4307-9149-101000000008",
      operation: "Surtimiento",
      type: "Task",
      progress: 0,
      status: "Blocked",
      reason: "Falta una placa de acero de 12 mm",
      quantity: 12,
    },

    {
      id: "task-cutting-003",
      text: "Corte de placas",
      assignee: {
        name: "Carlos Hernández",
        code: "OP-001",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000001",
      },
      start: isoFromToday(7, 9, 0),
      end: isoFromToday(8, 14, 0),
      parent: "summary-project-003",
      resource: "Plasma 1",
      resource_id: "101c4e79-86c8-4307-9149-101000000009",
      operation: "Corte plasma",
      type: "Task",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 12,
    },

    {
      id: "task-mechanical-assembly-003",
      text: "Ensamble mecánico",
      assignee: {
        name: "Miguel Sánchez",
        code: "OP-007",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000009",
      },
      start: isoFromToday(9, 7, 0),
      end: isoFromToday(12, 17, 0),
      parent: "summary-project-003",
      resource: "Estación de ensamble 1",
      resource_id: "101c4e79-86c8-4307-9149-101000000010",
      operation: "Ensamble mecánico",
      type: "Task",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 12,
    },

    {
      id: "task-final-inspection-003",
      text: "Inspección dimensional",
      assignee: {
        name: "Ricardo Flores",
        code: "QA-001",
        assignee_id: "2b0e2f03-9010-4f44-a944-001000000007",
      },
      start: isoFromToday(13, 8, 0),
      end: isoFromToday(14, 13, 0),
      parent: "summary-project-003",
      resource: "Laboratorio de calidad",
      resource_id: "101c4e79-86c8-4307-9149-101000000011",
      operation: "Inspección",
      type: "Task",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 12,
    },

    {
      id: "milestone-delivery-003",
      text: "Entrega programada",
      start: isoFromToday(15, 16, 0),
      end: isoFromToday(15, 16, 0),
      parent: "summary-project-003",
      operation: "Entrega",
      type: "Milestone",
      progress: 0,
      status: "Scheduled",
      reason: "",
      quantity: 0,
    },
  ],

  links: [
    {
      id: "link-001",
      source: "task-cutting-001",
      target: "task-bending-001",
      type: "e2s",
    },
    {
      id: "link-002",
      source: "task-bending-001",
      target: "task-welding-001",
      type: "e2s",
    },
    {
      id: "link-003",
      source: "task-welding-001",
      target: "task-painting-001",
      type: "e2s",
    },
    {
      id: "link-004",
      source: "task-painting-001",
      target: "milestone-quality-001",
      type: "e2s",
    },
    {
      id: "link-005",
      source: "task-setup-002",
      target: "task-machining-002",
      type: "e2s",
    },
    {
      id: "link-006",
      source: "task-machining-002",
      target: "task-electrical-assembly-002",
      type: "e2s",
    },
    {
      id: "link-007",
      source: "task-electrical-assembly-002",
      target: "task-testing-002",
      type: "e2s",
    },
    {
      id: "link-008",
      source: "task-material-check-003",
      target: "task-cutting-003",
      type: "e2s",
    },
    {
      id: "link-009",
      source: "task-cutting-003",
      target: "task-mechanical-assembly-003",
      type: "e2s",
    },
    {
      id: "link-010",
      source: "task-mechanical-assembly-003",
      target: "task-final-inspection-003",
      type: "e2s",
    },
    {
      id: "link-011",
      source: "task-final-inspection-003",
      target: "milestone-delivery-003",
      type: "e2s",
    },
  ],
};
