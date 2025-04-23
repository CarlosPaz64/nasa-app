import { NasaImageContract } from "../contracts/NasaImageContract";
import { NasaImageEntity } from "../entities/NasaImageEntity";

export class NasaImageUseCase {
    constructor(private repository: NasaImageContract){}

    async execute(imageNasaQuery: string, videos: boolean): Promise<NasaImageEntity> {
        return this.repository.getNasaImagesData(imageNasaQuery, videos);
    }
}