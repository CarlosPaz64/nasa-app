import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsteroids } from "../../app/slices/AsteroidSlice";
import type { RootState, AppDispatch } from "../../app/store/store";

export function useAsteroidsViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((s: RootState) => s.Asteroids);
  // Selecciona la parte del estado correspondiente a Asteroids:
    // - data: array de asteroides
    // - loading: indica si está cargando
    // - error: mensaje de error si ocurre

  useEffect(() => {
    dispatch(fetchAsteroids());
  }, [dispatch]);

  return { data, loading, error };
}