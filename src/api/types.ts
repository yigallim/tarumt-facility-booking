import { PostgrestError } from "@supabase/supabase-js";

export type ApiReturn = {
  data?: any;
  error: PostgrestError | null;
};
