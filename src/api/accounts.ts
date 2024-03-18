import supabase from "../lib/supabase";
import { InsertType } from "../types/helper";
import { ApiReturn } from "./types";

export async function getAccounts(): Promise<ApiReturn> {
  const response = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });
  return response;
}

export async function deleteAccount(_id: string): Promise<ApiReturn> {
  const response = await supabase.from("accounts").delete().eq("_id", _id);
  return response;
}

export async function addAccount(accountData: InsertType<"accounts">): Promise<ApiReturn> {
  const response = await supabase.from("accounts").insert(accountData);
  return response;
}

export async function editAccount(_id: string, updatedData: InsertType<"accounts">) {
  const response = await supabase.from("accounts").update(updatedData).eq("_id", _id);
  return response;
}
