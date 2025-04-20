import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetTheAPOD } from "../../app/slices/APODSlice";
import type { RootState, AppDispatch } from "../../app/store/store";
import type { APODEntity } from "../../domain/entities/APODEntity";

/**
 * useApodViewModel encapsula:
 * - dispatch(fetch)
 * - leer data, loading y error del store
 */
export const UseApodViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Extraemos directamente la primera (y única) entidad APOD del array
  const data = useSelector<RootState, APODEntity | null>(
    (state) => state.APOD.data[0] ?? null
  );
  const loading = useSelector<RootState, boolean>(
    (state) => state.APOD.loading
  );
  const error = useSelector<RootState, string | null>(
    (state) => state.APOD.error
  );

  // Al montar, disparar el fetch (siempre, o podrías condicionar)
  useEffect(() => {
    dispatch(GetTheAPOD());
  }, [dispatch]);

  return { data, loading, error, refetch: () => dispatch(GetTheAPOD()) };
};
