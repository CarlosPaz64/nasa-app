import { NasaImageFetch, NasaMediaAssetsFetch } from "../../app/api/NasaAPI";
import { NasaImageMap } from "../mappers/NasaMappers";
import type { NasaMediaEntity } from "../../domain/entities/NasaImageEntity";

export class NasaMediaImplementation {
  /**
   * @param query palabra a buscar
   * @param includeVideos si trae "video", rellenaremos video_links
   */
  async getNasaMediaData(
    query: string,
    includeVideos: boolean
  ): Promise<NasaMediaEntity[]> {
    // 1) fetch principal
    const { data: raw } = await NasaImageFetch(query, includeVideos);
    // 2) mapeo inicial (preview + assetsHref)
    const medias = NasaImageMap(raw);

    if (includeVideos) {
      // 3) para cada vídeo, busco su JSON-manifiesto y extraigo los .mp4
      await Promise.all(
        medias.map(async (m) => {
          if (m.media_type === "video" && m.assetsHref) {
            try {
              const { data: manifest } = await NasaMediaAssetsFetch(
                m.assetsHref
              );
              m.video_links = (manifest as string[]).filter((u) =>
                u.toLowerCase().endsWith(".mp4")
              );
            } catch {
              m.video_links = [];
            }
          }
        })
      );
    }

    return medias;
  }
}