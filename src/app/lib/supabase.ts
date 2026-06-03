import { createClient, type Session } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type UserRole = "entrepreneur" | "agency" | "admin";

export interface PropelProfile {
  id: string;
  email: string;
  name: string;
  business_name: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface SavedProposalRecord {
  id?: string;
  user_id?: string;
  user_email: string;
  business_name: string;
  client_name: string;
  client_industry?: string;
  service_offering?: string;
  budget?: string;
  currency?: string;
  timeline?: string;
  tone?: string;
  brief?: string;
  tagline?: string;
  phone?: string;
  website?: string;
  email?: string;
  logo?: string | null;
  client_website?: string;
  target_audience?: string;
  current_situation?: string;
  main_goal?: string;
  competitors?: string;
  urgency?: string;
  language?: string;
  generated_content: string;
  created_at?: string;
}

export const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "", {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

const ensureSupabaseConfig = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing.");
  }
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const validateStrongPassword = (password: string) => {
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Add at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Add at least one symbol.";
  return "";
};

export const signUpWithEmail = async ({
  email,
  password,
  name,
  businessName,
  role,
}: {
  email: string;
  password: string;
  name: string;
  businessName: string;
  role: Exclude<UserRole, "admin">;
}) => {
  ensureSupabaseConfig();
  const passwordError = validateStrongPassword(password);
  if (passwordError) throw new Error(passwordError);

  const { data, error } = await supabase.auth.signUp({
    email: normalizeEmail(email),
    password,
    options: {
      data: {
        name: name.trim(),
        business_name: businessName.trim(),
        role,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  ensureSupabaseConfig();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });

  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  ensureSupabaseConfig();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
};

export const sendPasswordReset = async (email: string) => {
  ensureSupabaseConfig();
  const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  ensureSupabaseConfig();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentProfile = async (session?: Session | null) => {
  ensureSupabaseConfig();
  const activeSession = session ?? (await getCurrentSession());
  if (!activeSession?.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,name,business_name,role,created_at,updated_at")
    .eq("id", activeSession.user.id)
    .single();

  if (error) throw error;
  return data as PropelProfile;
};

export const saveProposalRecord = async (record: SavedProposalRecord) => {
  ensureSupabaseConfig();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("You must be signed in to save proposals.");

  const { data, error } = await supabase
    .from("proposals")
    .insert({
      ...record,
      user_id: user.id,
      user_email: user.email,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as SavedProposalRecord;
};

export const getProposalRecords = async () => {
  ensureSupabaseConfig();
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SavedProposalRecord[];
};
