// viewmodels/useNasaImagesViewModel.tsx
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

  const search = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    dispatch(fetchNasaImages({ query: q }));
  }, [dispatch, query]);

  return { query, setQuery, data, loading, error, search };
}
