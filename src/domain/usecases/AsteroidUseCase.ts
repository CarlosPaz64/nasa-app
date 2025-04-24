/* CASO DE USO DEL CONTRATO PARA LOS ASTEROIDES CERCA DE LA TIERRA */
import { AsteroidContract } from "../contracts/AsteroidContract";
import { AsteroidEntity } from "../entities/AsteroidEntity";

export class AsteroidUseCase {
    // Lo mismo; un constructor privado con la declaración
    // Del objeto repository que hará que el contrato se cumpla
    constructor(private repository: AsteroidContract){}

    async execute(): Promise<AsteroidEntity[]> {
        return this.repository.getAsteroidsData();
    }
}