export const QUALITY_ROUTES={
    GET_PLAN:(machine_code:string)=>`/operations/active-plan?machine_code=${machine_code}`,
    SAVE_MEASUREMENT:`/operations/measurements`,


    //Del ajustador
    RESOLVE_ALERT:(alert_id:string)=>`/operations/alerts/${alert_id}/resolve`,
    PAP_SUBMIT:`/operations/pap/request`,
    REALESE_ADJUSTER:(pap_id:string)=>`/operations/pap/${pap_id}/release`,


    //por parte de calidad directamente otener metricas
    GET_ALERTS:`/operations/alerts/active`,
    //OBTENER LOS TIEMPO DE DE CALDIAD
    GET_AVERAGES:`/operations/reports/pap-averages`,
    //obtener el historial de pap 
   
    PAP_HISTORY(
        filterDate: string | null,
        filterArea: string | null,
        filterOrderCode: string | null
        ) {
        const params = new URLSearchParams();

        if (filterDate) params.append('filter_date', filterDate);
        if (filterArea) params.append('filter_area', filterArea);
        if (filterOrderCode) params.append('filter_order_code', filterOrderCode);

        return `/operations/reports/pap-history?${params.toString()}`;
    },
    PAP_HISTORY_MEASUREMENTS:
    (pap_id:string)=>`/operations/reports/pap-history/${pap_id}/measurements`,
        PAP_AVERAGES:(date:string)=>`/operations/reports/pap-averages?filter_date=${date}`,
    
    CONTROL_CHART:(plan_id:string,feature_id:string)=>`/operations/plans/${plan_id}/features/${feature_id}/control-chart`,

}
export const METROLOGY_ROUTES={
    GET_PAP:`/laboratory/pap/all`,
    REVIEW_PAP:(pap_id:string)=>`/laboratory/pap/${pap_id}/review`,
    PICKUP_ADJUSTER:(pap_id:string)=>`/operations/pap/${pap_id}/pickup`,

}
