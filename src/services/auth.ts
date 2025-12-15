import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";
import { createDefaultCategories } from "./categoryService";
import { createDefaultAccount } from "./accountService";

export async function register(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;
  
  // Criar categorias e conta padrão para o novo usuário
  try {
    await Promise.all([
      createDefaultCategories(userId),
      createDefaultAccount(userId),
    ]);
    console.log("Conta padrão e categorias criadas com sucesso para:", userId);
  } catch (error) {
    console.error("Erro ao criar dados iniciais para novo usuário:", error);
    // Mesmo com erro, continuamos o registro
  }
  
  return userCredential;
}

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  return signOut(auth);
}

export async function updateUserProfile(displayName: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');
  
  await updateProfile(user, { displayName });
  
  // Forçar reload para atualizar o displayName no contexto
  await user.reload();
}
