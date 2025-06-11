import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import Button from "../../components/Buttons";
import { checkBody } from "../../modules/checkBody";
import { useDispatch } from "react-redux";
import { addUserToStore } from "../../reducers/userSlice";
import { API_URL } from "@env";
import CardLevelClicable from "../../components/CardLevelClicable";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GOOGLE_EXPO_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
} from "@env";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
  // état pour afficher ou cacher le mot de passe
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(""); // état pour gérer la valeur du champ email avec initialisation
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_EXPO_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri: GOOGLE_REDIRECT_URI,
  });
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetch(`${API_URL}/api/auth/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authentication.accessToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.provToken) {
            dispatch(addUserToStore({ provToken: data.provToken }));
            navigation.replace("onBoarding");
          } else if (data.token) {
            dispatch(addUserToStore({ token: data.token }));
            navigation.replace("Dashboard");
          }
        })
        .catch(() => alert("Erreur lors de l’authentification Google"));
    }
  }, [response]);

  // si l'email est invalid afficher le message d'erreur

  const handleSignup = () => {
    const requiredFields = ["email", "password"];
    const body = { email, password };

    if (!checkBody(body, requiredFields)) {
      setEmailError("Tous les champs sont requis");
      return;
    }

    if (password.length < 8) {
      setEmailError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setEmailError(
        "Le mot de passe doit contenir au moins une lettre majuscule"
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      setEmailError(
        "Le mot de passe doit contenir au moins une lettre minuscule"
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      setEmailError("Le mot de passe doit contenir au moins un chiffre");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setEmailError(
        "Le mot de passe doit contenir au moins 1 caractère spécial"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Email invalide");
    } else {
      setEmailError("");

      fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password, email: email }),
      })
        .then((response) => {
          const status = response.status;
          response.json().then((data) => {
            console.log(status);

            if (status === 201) {
              dispatch(addUserToStore({ provToken: data.provToken }));
              navigation.replace("onBoarding");
            } else if (status === 400) {
              setEmailError(data.error);
            } else if (status === 409) {
              setEmailError(data.error);
            } else if (status === 422) {
              setEmailError(data.error);
            } else {
              setEmailError(data.error);
            }
          });
        })
        .catch((error) => {
          console.error("Erreur lors de l’envoi :", error);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Créer votre compte</Text>

      <View style={styles.form}>
        <View style={styles.input}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.inputField}
            value={email}
            onChangeText={(value) => setEmail(value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.input}>
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            onChangeText={(value) => setPassword(value)}
            value={password}
            secureTextEntry={!passwordVisible}
            style={styles.inputField}
          />
          <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color="#777"
            />
          </Pressable>
        </View>

        <Button
          title="S'inscrire"
          onPress={handleSignup}
          backgroundColor="#cbb7ff"
          textColor="#000"
        />
      </View>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <AntDesign name="google" size={20} color="#000" />
        <Text style={styles.socialText}>Continuer avec Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() =>
          alert(
            "100$ pour se connecter avec une pomme... j’suis pas Steve Jobs moi 😤💸",
            [{ text: "OK, je reste pauvre mais libre." }]
          )
        }
      >
        <FontAwesome name="apple" size={20} color="#000" />

        <Text style={styles.socialText}>Continuer avec Apple</Text>
      </TouchableOpacity>

      <Text
        style={[styles.footerText, styles.link]}
        onPress={() => navigation.navigate("cgu")}
      >
        En continuant vous acceptez les conditions générales et la politique de
        confidentialité
      </Text>
      <View style={styles.credit}>
        <CardLevelClicable
          width="100"
          height="30"
          backgroundColor="#0000"
          fontSize={10}
          text="Credit"
          url=""
          description=""
          linkTo="CreditScreen"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    paddingTop: 90,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "CocomatPro-Regular",
    marginBottom: 60,
    color: "#000",
  },
  form: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputField: {
    flex: 1,
    fontFamily: "Manrope-Extralight",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontFamily: "Manrope-Extralight",
    fontSize: 13,
    marginBottom: 8,
    marginTop: -8,
    marginLeft: 5,
  },
  forgotText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "Manrope-Extralight",
    marginTop: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
  },
  socialText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "CocomatPro-Regular",
  },
  footerText: {
    marginTop: 70,
    fontSize: 12,
    textAlign: "center",
    color: "#999",
    fontFamily: "Manrope-Extralight",
    paddingHorizontal: 10,
  },

  link: {
    textDecorationLine: "underline",
    color: "#000",
    fontWeight: "500",
  },
  credit: {
    marginLeft: "7%",
    padding: 10,
  },
});
