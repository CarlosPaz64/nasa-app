import { NasaImageContract } from "../contracts/NasaImageContract";
import { NasaImageEntity } from "../entities/NasaImageEntity";

export class NasaImageUseCase {
    constructor(private repository: NasaImageContract){}

    async execute(): Promise<NasaImageEntity> {
        return this.repository.getNasaImagesData();
    }
}