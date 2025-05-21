import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNasaImages } from "../../app/slices/NasaImageSlice";
import type { RootState, AppDispatch } from "../../app/store/store"

export function useNasaImagesViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");

  const { data, loading, error } = useSelector(
    (s: RootState) => s.NasaImages
  );
  // Selecciona del state global la porción correspondiente a las imágenes:
  // - data: array de imágenes obtenidas
  // - loading: booleano que indica si la petición está en curso
  // - error: mensaje de error si la búsqueda falla

  const search = useCallback(() => {
    // Función que ejecuta la búsqueda cuando el usuario la invoca
    const q = query.trim();
    // Eliminamos espacios en blanco al inicio y final del query
    if (!q) return;
    // Si el query queda vacío tras recortar, no hacemos nada
    dispatch(fetchNasaImages({ query: q }));
    // Despachamos el thunk con el término de búsqueda limpio
  }, [dispatch, query]);

  return { query, setQuery, data, loading, error, search };
}
