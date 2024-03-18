import supabase from "../lib/supabase";

type CrendetialsType = {
  username: string;
  password: string;
};

export async function validateCredentials(credentials: CrendetialsType): Promise<boolean> {
  const { data } = await supabase.functions.invoke("validate-credentials", {
    body: JSON.stringify(credentials),
  });
  if (data.valid !== undefined && data.valid == true) return true;
  else return false;
}
