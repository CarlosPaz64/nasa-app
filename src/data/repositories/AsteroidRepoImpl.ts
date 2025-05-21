import { AsteroidContract } from "../../domain/contracts/AsteroidContract";
import { AsteroidEntity } from "../../domain/entities/AsteroidEntity";
import { AsteroidFetch } from "../../app/api/NasaAPI";
import { AsteroidMap } from "../mappers/NasaMappers";

// Implementación del contrato establecido
export class AsteroidImplementation implements AsteroidContract {
    async getAsteroidsData(): Promise<AsteroidEntity[]> {
        // Datos en crudo que se reciben del fetch
        const { data: raw } = await AsteroidFetch()

        // para mappearse
        return AsteroidMap(raw);
    }
}