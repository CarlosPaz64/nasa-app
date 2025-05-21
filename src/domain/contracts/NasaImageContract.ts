/* CREACIÓN DEL CONTRATO DE LAS IMÁGENES DE LA NASA */
import { NasaImageEntity } from "../entities/NasaImageEntity";

export interface NasaImageContract {
    getNasaImagesData(query: string): Promise<NasaImageEntity[]>;
    // Básicamente aquí vamos a obtener los datos de las imágenes de la NASA y listo.
    // Por ello es una promesa de la entidad
  }