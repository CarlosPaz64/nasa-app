/* CASO DE USO PARA LAS FOTOS DE MARTE */
import { MarsRoverPhotosContract } from "../contracts/MarsRoverPhotosContract";
import { MarsRoverPhotosEntity } from "../entities/MarsRoverPhotosEntity";

export class MarsRoverPhotosUseCase {
    constructor(private repository: MarsRoverPhotosContract){}

    async execute(page: number): Promise<MarsRoverPhotosEntity[]> {
        return this.repository.getMarsPhotosData(page);
    }
}