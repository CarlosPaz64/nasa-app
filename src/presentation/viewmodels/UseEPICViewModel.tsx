// src/presentation/viewmodels/useEpicViewModel.ts
import { useEffect }                from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetEPICTheme }             from "../../app/slices/EPICSlice";
import type { RootState, AppDispatch } from "../../app/store/store";
import type { EPICEntity }          from "../../domain/entities/EPICEntity";

/**
 * useEpicViewModel
 * → carga el array de EPICs al montar
 * → expone epics[], loading, error y reload()
 * (la responsabilidad de cambiar el tema vive ahora en ThemedContainer)
 */
export function useEpicViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  // 1) Estado EPIC desde Redux
  const epics   = useSelector((s: RootState) => s.EPIC.data ?? []);
  const loading = useSelector((s: RootState) => s.EPIC.loading);
  const error   = useSelector((s: RootState) => s.EPIC.error);

  // 2) Al montar el hook, lanzamos la petición EPIC
  useEffect(() => {
    dispatch(GetEPICTheme());
  }, [dispatch]);

  // 3) Función para recargar manualmente
  const reload = () => {
    dispatch(GetEPICTheme());
  };

  return { epics, loading, error, reload };
}
