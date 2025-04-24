import { AsteroidContract } from "../../domain/contracts/AsteroidContract";
import { AsteroidEntity } from "../../domain/entities/AsteroidEntity";
import { AsteroidFetch } from "../../app/api/NasaAPI";
import { AsteroidMap } from "../mappers/NasaMappers";

export class AsteroidImplementation implements AsteroidContract {
    async getAsteroidsData(): Promise<AsteroidEntity[]> {
        const { data: raw } = await AsteroidFetch()

        return AsteroidMap(raw);
    }
}