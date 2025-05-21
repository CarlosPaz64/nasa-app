/* CREACIÓN DEL CONTRATO DE LOS DATOS DE MARTE */
import { MarsRoverPhotosEntity } from "../entities/MarsRoverPhotosEntity";

export interface MarsRoverPhotosContract {
    getMarsPhotosData(page: number): Promise<MarsRoverPhotosEntity[]>
    // Básicamente aquí vamos a obtener los datos de Marte y listo.
    // Por ello es una promesa de la entidad
}