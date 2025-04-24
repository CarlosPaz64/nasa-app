// src/presentation/viewmodels/useMarsRoverViewModel.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarsRoverPhotos } from "../../app/slices/MarsRoverPhotosSlice";
import type { RootState, AppDispatch } from "../../app/store/store";

export function useMarsRoverViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  // Estado del slice
  const data    = useSelector((s: RootState) => s.MarsRoverPhotos.data);
  const loading = useSelector((s: RootState) => s.MarsRoverPhotos.loading);
  const error   = useSelector((s: RootState) => s.MarsRoverPhotos.error);
  const hasMore = useSelector((s: RootState) => s.MarsRoverPhotos.hasMore);

  // 1) Al montar, cargo la primera página
  useEffect(() => {
    dispatch(fetchMarsRoverPhotos());
  }, [dispatch]);

  // 2) Función para cargar la siguiente página
  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchMarsRoverPhotos());
    }
  };

  return { data, loading, error, hasMore, loadMore };
}
