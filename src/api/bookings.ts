import supabase from "../lib/supabase";
import { InsertType } from "../types/helper";
import { ApiReturn } from "./types";

export async function getBookings(): Promise<ApiReturn> {
  const response = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  return response;
}

export async function deleteBooking(_id: string): Promise<ApiReturn> {
  const response = await supabase.from("bookings").delete().eq("_id", _id);
  return response;
}

export async function addBooking(bookingData: InsertType<"bookings">): Promise<ApiReturn> {
  const response = await supabase.from("bookings").insert(bookingData);
  return response;
}
