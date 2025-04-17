/* CONTRATO DE LO QUE HARÁ APOD SIN SABER CÓMO */
import { APODEntity } from "../entities/APODEntity";

export interface APODContract {
    getAPODData(): Promise<APODEntity>
    // Básicamente aquí vamos a obtener los datos APOD y listo.
    // Por ello es una promesa de la entidad
}