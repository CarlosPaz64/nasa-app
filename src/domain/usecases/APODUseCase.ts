/* CREACIÓN DEL CASO DE USO PARA LA INTERFAZ APOD */
import { APODContract } from "../contracts/APODContract";
import { APODEntity } from "../entities/APODEntity";

// Clase del caso de uso
export class APODUseCase {
    /* Aquí se inyecta al contrato mediante un repositorio
    * Que se encargará de cumplir dicho contrato
    */
    constructor(private repository: APODContract){}
    // Básicamente está vacío para evitar el this.repository = repository;

    // Después, se ejecuta el caso de uso con una promesa de la entidad APOD
    async execute(): Promise<APODEntity> {
        // Es asíncrono porque ejecuta una promesa
        return this.repository.getAPODData();
        // Aquí retorna al repositorio encargado de obtener la información de APOD
    }
}