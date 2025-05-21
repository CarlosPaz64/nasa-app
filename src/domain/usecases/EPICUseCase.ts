/* CASO DE USO PARA EL EPIC */
import { EPICEntity } from "../entities/EPICEntity";
import { EPICContract } from "../contracts/EPICContract";

export class EPICUseCase {
    constructor(private repository: EPICContract){}

    async execute(): Promise<EPICEntity[]> {
        return this.repository.getEPICData();
    }
}