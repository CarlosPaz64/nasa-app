/* CREACIÓN DEL CONTRATO DE LOS DATOS DE EPIC */
import { EPICEntity } from "../entities/EPICEntity";

export interface EPICContract {
    getEPICData(): Promise<EPICEntity[]>
}