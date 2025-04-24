/* CREACIÓN DEL CONTRATO DE LOS ASTEROIDES */
import { AsteroidEntity } from "../entities/AsteroidEntity";

export interface AsteroidContract {
    getAsteroidsData(): Promise<AsteroidEntity[]>
    // Básicamente aquí vamos a obtener los datos de los asteroides y listo.
    // Por ello es una promesa de la entidad
}