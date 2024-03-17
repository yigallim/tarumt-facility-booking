import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const environment = import.meta.env.VITE_ENVIRONMENT;
const supabaseUrl =
  environment === "development"
    ? import.meta.env.VITE_SUPABASE_LOCAL_URL!
    : import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export default supabase;
