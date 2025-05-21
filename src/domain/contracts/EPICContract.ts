/* CREACIÓN DEL CONTRATO DE LOS DATOS DE EPIC */
import { EPICEntity } from "../entities/EPICEntity";

export interface EPICContract {
    getEPICData(): Promise<EPICEntity[]>
    // Básicamente aquí vamos a obtener los datos de EPIC y listo.
    // Por ello es una promesa de la entidad
}