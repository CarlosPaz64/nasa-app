/* IMPLEMENTACIÓN DEL CONTRATO */
import { APODMap } from "../mappers/NasaMappers";
import { APODFetch } from "../../app/api/NasaAPI";
import { APODEntity } from "../../domain/entities/APODEntity";
import { APODContract } from "../../domain/contracts/APODContract";

// Esta será una clase que implemente el contrato de manera correcta
export class APODContractImplementation implements APODContract {

    // Se llama a la función que obtiene los datos y luego se aplica el correspondiente map
    async getAPODData(): Promise<APODEntity> {
        // Se espera a la respuesta de la API
        const response = await APODFetch();
        // Después se le incrusta esa respuesta al mapeo
        return APODMap(response.data)
        // Se retorna la respuesta
    }
}