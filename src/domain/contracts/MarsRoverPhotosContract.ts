/* CREACIÓN DEL CONTRATO DE LOS DATOS DE MARTE */
import { MarsRoverPhotosEntity } from "../entities/MarsRoverPhotosEntity";

export interface MarsRoverPhotosContract {
    getMarsPhotosData(page: number): Promise<MarsRoverPhotosEntity[]>
}