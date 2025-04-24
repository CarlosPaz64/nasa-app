// app/slices/asteroidSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import type { RootState }         from "../store/store";
import type { AsteroidEntity }    from "../../domain/entities/AsteroidEntity";
import { AsteroidImplementation } from "../../data/repositories/AsteroidRepoImpl";

interface AsteroidState {
  data:    AsteroidEntity[];
  loading: boolean;
  error:   string | null;
}

const initialState: AsteroidState = {
  data:    [],
  loading: false,
  error:   null,
};

export const fetchAsteroids = createAsyncThunk<
  AsteroidEntity[],
  void,
  { state: RootState; rejectValue: string }
>(
  "asteroids/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const cached = thunkAPI.getState().Asteroids.data;
      if (cached.length) return cached;
      return thunkAPI.rejectWithValue("Offline y sin datos cacheados");
    }
    const repo = new AsteroidImplementation();
    const list = await repo.getAsteroidsData();
    if (!list.length) {
      return thunkAPI.rejectWithValue("No hay asteroides en el feed");
    }
    return list;
  }
);

const slice = createSlice({
  name: "asteroids",
  initialState,
  reducers: {},
  extraReducers: b =>
    b
      .addCase(fetchAsteroids.pending, s => {
        s.loading = true;
        s.error   = null;
      })
      .addCase(fetchAsteroids.fulfilled, (s, a) => {
        s.loading = false;
        s.data    = a.payload;
      })
      .addCase(fetchAsteroids.rejected, (s, a) => {
        s.loading = false;
        s.error   = a.payload ?? "Error al cargar asteroides";
      }),
});

export const AsteroidReducer = slice.reducer;
