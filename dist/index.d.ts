import { Logger } from "bunyan";
import { Disq } from "hive-disque";
export interface CarModel {
    vehicleCode: string;
    vehicleName: string;
    brandName: string;
    familyName: string;
    bodyType?: string;
    engineDesc: string;
    gearboxName?: string;
    groupName: string;
    cfgLevel?: string;
    purchasePrice: string;
    purchasePriceTax: string;
    seat: string;
    effluentStandard?: string;
    pl: string;
    fuelJetType?: string;
    drivenType?: string;
    yearPattern?: string;
}
export interface Option {
    log?: Logger;
    sn?: string;
    disque?: Disq;
    queue?: string;
}
export declare function getCarModelByVin(vin: string, options?: Option): Promise<any>;
