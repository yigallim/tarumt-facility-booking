import { create } from "zustand";
import { Tables } from "../../types/supabase";

export type UserData = Tables<"accounts">;

interface AccountState {
  accounts: UserData[];
  setAccounts: (accounts: UserData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useAccountState = create<AccountState>()((set) => ({
  accounts: [],
  setAccounts: (accounts: UserData[]) => {
    set({ accounts });
  },
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}));

export default useAccountState;
