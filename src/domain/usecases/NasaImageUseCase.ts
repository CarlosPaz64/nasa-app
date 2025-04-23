import { NasaImageContract } from "../contracts/NasaImageContract";

export class NasaImageUseCase {
    constructor(private repo: NasaImageContract) {}
  
    async execute(query: string) {
      return this.repo.getNasaImagesData(query);
    }
  }