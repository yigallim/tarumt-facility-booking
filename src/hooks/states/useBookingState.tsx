import { create } from "zustand";
import { Tables } from "../../types/supabase";

export type BookingData = Tables<"bookings">;

interface BookingState {
  bookings: BookingData[];
  setBookings: (bookings: BookingData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useBookingState = create<BookingState>()((set) => ({
  bookings: [],
  setBookings: (bookings: BookingData[]) => {
    set({ bookings });
  },
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}));

export default useBookingState;
