/* CREACIÓN DEL CONTRATO DE LAS IMÁGENES DE LA NASA */
import { NasaImageEntity } from "../entities/NasaImageEntity";

export interface NasaImageContract {
    getNasaImagesData(imageNasaQuery: string, videos: boolean): Promise<NasaImageEntity[]>
}