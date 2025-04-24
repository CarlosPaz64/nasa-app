/* IMPLEMENTACIÓN DEL CONTRATO DE MARTE Y SU GALERÍA DE FOTOS */
import { MarsRoverMap } from "../mappers/NasaMappers";
import { MarsRoverPhotosContract } from "../../domain/contracts/MarsRoverPhotosContract";
import { MarsRoverPhotosEntity } from "../../domain/entities/MarsRoverPhotosEntity";
import { MarsRoverPhotosFetch } from "../../app/api/NasaAPI";

export class MarsRoverPhotosImplementation implements MarsRoverPhotosContract {
    async getMarsPhotosData(page: number): Promise<MarsRoverPhotosEntity[]> {
        const { data: raw } = await MarsRoverPhotosFetch(page);

        return MarsRoverMap(raw)
    }
}