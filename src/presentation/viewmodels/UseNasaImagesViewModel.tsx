// src/viewmodels/useNasaMediaViewModel.tsx
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNasaMedia } from "../../app/slices/NasaImageSlice";
import type { RootState, AppDispatch } from "../../app/store/store";

export function useNasaMediaViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [includeVideos, setIncludeVideos] = useState(false);

  const { data, loading, error, id } = useSelector(
    (s: RootState) => s.NasaMedia
  );

  const search = useCallback(() => {
    if (query.trim().length === 0) return;
    dispatch(fetchNasaMedia({ query: query.trim(), includeVideos }));
  }, [dispatch, query, includeVideos]);

  return {
    query,
    setQuery,
    includeVideos,
    setIncludeVideos,
    data,
    loading,
    error,
    search,
  };
}
