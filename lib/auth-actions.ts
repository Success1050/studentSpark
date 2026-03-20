import { supabase } from "./supabase";

export const userSignup = async (
  email: string,
  password: string,
  fullName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const userLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const userLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
};

export const resetPasswordFunc = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) {
    console.error("Reset password error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
};
