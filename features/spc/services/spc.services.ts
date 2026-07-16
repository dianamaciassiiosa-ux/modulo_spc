
import { QUALITY_ROUTES } from "@/lib/api-routes-quality";
import api from "@/lib/axiosQuality";
import { SPC } from "../type";


export const spcService={
    getControlChartData:async(planId:string,featureId:string)=>{
        const {data}=await api.get<SPC>(
            QUALITY_ROUTES.CONTROL_CHART(planId,featureId)
        );
        console.log("SPC data fetched:", data);
        return data;
    }
}