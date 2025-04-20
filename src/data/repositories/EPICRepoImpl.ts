/* IMPLEMENTACIÓN DEL CONTRATO */
import { EPICMap } from "../mappers/NasaMappers";
import { EPICFetch } from "../../app/api/NasaAPI";
import { EPICEntity } from "../../domain/entities/EPICEntity";
import { EPICContract } from "../../domain/contracts/EPICContract";

// Esta será una clase que implemente el contrato de manera correcta
export class EPICContractImplementation implements EPICContract {

    // Se llama a la función que obtiene los datos y luego se aplica el correspondiente map
    async getEPICData(): Promise<EPICEntity[]> {
        // Se espera a la respuesta de la API
        const response = await EPICFetch();
        // Después se le incrusta esa respuesta al mapeo
        return EPICMap(response.data)
        // Se retorna la respuesta
    }
}