import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../services/firebase";

const functions = getFunctions(app);

export async function handleForgotPassword(email: string) {
  try {
    const sendReset = httpsCallable(functions, "sendPasswordResetEmail");
    await sendReset({ email });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
