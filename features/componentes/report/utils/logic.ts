import { GanttTask, HierarchicalTask } from "@/features/planner/gantt.types";

export function createTaskHierarchy(tasks:GanttTask[]):HierarchicalTask[]{
    const taskMap=new Map<string,HierarchicalTask>();

    tasks.forEach( task=> {
        taskMap.set(task.id,{
            ...task,
            children:[],
            level:0,
        })
    });

    const roots:HierarchicalTask[]=[];

    taskMap.forEach((task)=>{
        const current=taskMap.get(task.id)!;
        const parent=task.parent
            ?taskMap.get(task.parent):undefined;

        if(parent){
            parent.children.push(task.id)
        }else {
            roots.push(current);
        }

    });

    const result:HierarchicalTask[]=[];

    const visit=(
        task:HierarchicalTask,
        level:number,
    )=>{
        task.level=level;
        result.push(task);

        task.children.forEach((childId)=>{
            const child=taskMap.get(childId);

            if(child)
                visit(child,level+1>=5?5:level+1);
        });
    };

    roots.forEach((root)=>visit(root,0));

    return result;
}
export function parseDateToIso(iso:string):Date{
    const date=new Date(iso);
    if(Number.isNaN(date.getTime()))
        throw new Error(`Fecha ISO inválida :${iso}`);
    return date;
}
export function validateDate(start:Date,end:Date){
    const DAY_MS=24*60*60*1000;
    const diffenceDays=Math.ceil(
        (end.getTime()-start.getTime())/DAY_MS
    )
    if(diffenceDays<0 || diffenceDays>15)
        throw new Error("El rango de fecha para la generación del PDF, no se cumple")
}
export function getBarPosition(task:HierarchicalTask){
    
}