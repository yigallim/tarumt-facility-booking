import { create } from "zustand";
import { Tables } from "../../types/supabase";

export type FacilityData = Tables<"facilities">;

interface FacilityState {
  facilities: FacilityData[];
  setFacilities: (facilities: FacilityData[]) => void;
}

const useFacilityState = create<FacilityState>()((set) => ({
  facilities: [],
  setFacilities: (facilities: FacilityData[]) => set({ facilities }),
}));

export default useFacilityState;
