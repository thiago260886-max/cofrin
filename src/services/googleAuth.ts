import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./firebase";
import { createDefaultCategories } from "./categoryService";
import { createDefaultAccount } from "./accountService";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(onLogin?: () => void) {

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "1026415452462-bnqbtkpks7pts26n6l4eg22en1pradau.apps.googleusercontent.com",
    webClientId: "1026415452462-bnqbtkpks7pts26n6l4eg22en1pradau.apps.googleusercontent.com",
    androidClientId: "1026415452462-v95o9cb87b6va3kopvq5sagpsvratmtd.apps.googleusercontent.com",
    iosClientId: "1026415452462-3jti3vafhr81mjkrmftdv11edugdgm42.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
    responseType: "id_token", // <-- ESSENCIAL!
  });

  useEffect(() => {
    let mounted = true;

    if (response?.type === "success") {
      const { id_token } = response.params;

      console.log("Google Response Params:", response.params);

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          console.log("Login Google OK!");
          
          // Verificar se é um novo usuário
          const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;
          
          if (isNewUser) {
            console.log("Novo usuário Google, criando dados iniciais...");
            const userId = userCredential.user.uid;
            try {
              await Promise.all([
                createDefaultCategories(userId),
                createDefaultAccount(userId),
              ]);
              console.log("Dados iniciais criados com sucesso!");
            } catch (error) {
              console.error("Erro ao criar dados iniciais:", error);
            }
          }
          
          if (mounted && onLogin) onLogin();
        })
        .catch((err) => {
          if (mounted) console.error("Erro no login Google:", err);
        });
    }

    return () => {
      mounted = false;
    };
  }, [response]);

  return { request, promptAsync };
}