import supabase from "../lib/supabase";
import { ApiReturn } from "./types";

export async function getFacilities(): Promise<ApiReturn> {
  const response = await supabase.from("facilities").select("*");
  return response;
}
