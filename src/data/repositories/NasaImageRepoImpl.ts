import { NasaImageFetch } from "../../app/api/NasaAPI";
import { NasaImageMap } from "../mappers/NasaMappers";
import { NasaImageContract } from "../../domain/contracts/NasaImageContract";
import { NasaImageEntity } from "../../domain/entities/NasaImageEntity";

export class NasaImageRepoImpl implements NasaImageContract {
  async getNasaImagesData(query: string): Promise<NasaImageEntity[]> {
    const { data: raw } = await NasaImageFetch(query);
    return NasaImageMap(raw);
  }
}