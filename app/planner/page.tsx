"use client"
import { DowloadPlannerReport } from "@/features/componentes/report/DowloadPlannerReport";
import { QueueLayout } from "@/features/share/layouts/QueueLayout";

export default function plnnerPage(){

    return (
        <QueueLayout
            header={
                <></>
            }
            toolbar={
                <></>
            }
            master={
                <></>
            }
            actions={
                <DowloadPlannerReport/>
            }
        />
    )    
}