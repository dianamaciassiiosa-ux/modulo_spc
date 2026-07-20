export type GanttApiResponse = {
   data:{
    tasks: GanttTask[] ;
    links: GanttLink[] ;
    title: string;
    description: string;
  },
  message: string;
  success?: boolean;
 }

export interface Assigne{
  name?:string;
  code?:string;
  /** id del operador asignado (dto.TaskAssignee.assignee_id) — act-on-behalf MES. */
  assignee_id?:string|null;
}
export interface columnsGantt {
  assigne: boolean;
  start_date: boolean;
  end_date: boolean;
  duration: boolean;
  quantity:boolean;
}
export type GanttTaskStatus='Scheduled'|'Paused'|'Running'|'Finished'|'Setup'|'Completed'|'Blocked'|'Canceled';
export interface GanttTask {
  id: string;
  text: string;
  assignee?: Assigne;
  start: string;
  end: string;
  parent: string | null;
  resource?:string;
  /** UUID del recurso (máquina/estación) — dto.GanttTask.resource_id. null en Summary. */
  resource_id?:string|null;
  operation?:string;
  type: "Summary" | "Task" | "Milestone";
  progress: number;
  open?: boolean;
  status?:GanttTaskStatus;
  reason_scrap?:string;
  reason:string;
  qty_scrap?:number;
  quantity:number; //cantidad requerida
}



export interface GanttLink {
  id: string;
  source: string;
  target: string;
  type: "e2s";
}

export interface Snapshot {
  description:string;
  tasks: GanttTask[];
  links: GanttLink[];
  title:string;
}
export interface HierarchicalTask extends GanttTask {
  children: string[];
  level: number;
}