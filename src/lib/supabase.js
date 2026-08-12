import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zeucfekgdsnzyponnqzp.supabase.co";

const supabaseKey =
  "sb_publishable_a1fcShfNckBek3_WQudO6g_2nxeHuXb";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);