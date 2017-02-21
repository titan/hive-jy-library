import { Logger } from "bunyan";
export interface CarModel {
    vehicleCode: string;
    vehicleName: string;
    brandName: string;
    familyName: string;
    groupName: string;
    pl: string;
    engineDesc: string;
    inairform: string;
    arrayType?: string;
    valveNum?: string;
    fuelJetType?: string;
    supplyOil?: string;
    drivenType?: string;
    gearboxName?: string;
    gearNum?: string;
    bodyType?: string;
    doorNum?: string;
    wheelbase?: string;
    yearPattern?: string;
    cfgLevel?: string;
}
export interface Option {
    log: Logger;
}
export declare function getCarModelByVin(vin: string, options?: Option): Promise<any>;
