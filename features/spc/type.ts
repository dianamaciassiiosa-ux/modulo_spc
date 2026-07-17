//Mas o menos necesitaria algo asi para 

export interface XRMeasurement{
    lsc:number; //Superior
    lc:number;
    lic:number; //Inferior
}
export interface Subgroups{
    cycle_number:number;
    measured_at:string;
    measurements:number[];
    average:number;
    range:number;
}
export interface Bins{ //Las medidas deben ser organizar de menor a menor de acuerdo a from-to, si se se puede si no pues ya asi como sean.
    from_val:number;
    to_val:number;
    frequency:number;
}
export interface Capability{
    mean:number; ///media
    std_deviation:number; // desviación estandar , la que normalemnte viene raiz((suma(medida-promedio)^2)/(n-1))
    cp:number;
    cpk:number;
    cpu:number;
    cpl:number;
    interval:number;  
    
}
export interface Specification{  //Estas son las de la especificaciones como tal del plano :)
    limit_max:number; //mayor
    nominal_value:number;//nomial value
    limit_min:number;//menor
}
export interface SPC{
    feature_info:{
        name:string;
        id:string;
    }
    specifications:Specification;
    capability:Capability;
    histogram:Bins[];
    subgroups:Subgroups[];
    x_chart:XRMeasurement;
    r_chart:XRMeasurement;

}
export interface StatiscalSummary{
  greatStocking:number;
  avgRanges:number;
  estimatedSigma:number;
  ucl_avg:number;
  lcl_avg:number;
  ucl_r:number;
  lcl_r:number;
  lsl:number;
  usl:number;
  cp:number;
  cpk:number;
  cpu:number;
  cpl:number;
  subgroups:number;
  totalMeasurements:number;
  outOfSpecification:number;
  outOfControl:number;

}
export const spcMock: SPC = {
  feature_info: {
    name: "Diámetro exterior",
    id: "FEAT-001"
  },

  specifications: {
    limit_max: 10.15,      // USL / Límite superior de especificación
    nominal_value: 10.0,   // Valor nominal
    limit_min: 9.85        // LSL / Límite inferior de especificación
  },

  capability: {
    mean: 10.01,
    std_deviation: 0.038,
    cp: 1.3158,
    cpk: 1.2281,
    cpu: 1.2281,
    cpl: 1.4035,
    interval: 0.05
  },

  histogram: [
    {
      from_val: 9.85,
      to_val: 9.90,
      frequency: 1
    },
    {
      from_val: 9.90,
      to_val: 9.95,
      frequency: 5
    },
    {
      from_val: 9.95,
      to_val: 10.00,
      frequency: 11
    },
    {
      from_val: 10.00,
      to_val: 10.05,
      frequency: 17
    },
    {
      from_val: 10.05,
      to_val: 10.10,
      frequency: 5
    },
    {
      from_val: 10.10,
      to_val: 10.15,
      frequency: 1
    }
  ],

  subgroups: [
    {
      cycle_number: 1,
      measured_at: "2026-07-15T07:10:00",
      measurements: [9.98, 10.01, 10.03, 10.00, 10.02],
      average: 10.008,
      range: 0.05
    },
    {
      cycle_number: 2,
      measured_at: "2026-07-15T08:10:00",
      measurements: [10.02, 10.04, 10.01, 10.03, 10.00],
      average: 10.02,
      range: 0.04
    },
    {
      cycle_number: 3,
      measured_at: "2026-07-15T09:10:00",
      measurements: [9.99, 10.00, 10.02, 9.97, 10.01],
      average: 9.998,
      range: 0.05
    },
    {
      cycle_number: 4,
      measured_at: "2026-07-15T10:10:00",
      measurements: [10.04, 10.03, 10.06, 10.02, 10.05],
      average: 10.04,
      range: 0.04
    },
    {
      cycle_number: 5,
      measured_at: "2026-07-15T11:10:00",
      measurements: [9.96, 9.99, 9.98, 10.00, 9.97],
      average: 9.98,
      range: 0.04
    },
    {
      cycle_number: 6,
      measured_at: "2026-07-15T12:10:00",
      measurements: [10.01, 10.03, 10.02, 10.04, 10.00],
      average: 10.02,
      range: 0.04
    },
    {
      cycle_number: 7,
      measured_at: "2026-07-15T13:10:00",
      measurements: [10.05, 10.07, 10.03, 10.06, 10.04],
      average: 10.05,
      range: 0.04
    },
    {
      cycle_number: 8,
      measured_at: "2026-07-15T14:10:00",
      measurements: [9.97, 9.99, 10.01, 9.98, 10.00],
      average: 9.99,
      range: 0.04
    }
  ],

  x_chart: {
    lsc: 10.058,
    lc: 10.013,
    lic: 9.968
  },

  r_chart: {
    lsc: 0.095,
    lc: 0.0425,
    lic: 0
  }
};
export const generateSpc = (cycles: number): SPC => ({
  ...spcMock,
  subgroups: Array.from({ length: cycles }, (_, i) => ({
    cycle_number: i + 1,
    measured_at: new Date(
      2026,
      6,
      15,
      7 + i
    ).toISOString(),
    measurements: [9.99, 10.01, 10.00, 10.02, 9.98],
    average: 10,
    range: 0.04
  }))
});