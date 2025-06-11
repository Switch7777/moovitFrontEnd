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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import Button from "../../components/Buttons";
import { addUserToStore } from "../../reducers/userSlice";
import { useDispatch } from "react-redux";
import { API_URL } from "@env";
import { checkBody } from "../../modules/checkBody";
import {
  GOOGLE_EXPO_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
} from "@env";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_EXPO_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri: GOOGLE_REDIRECT_URI,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

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

  const handleLogin = () => {
    const requiredFields = ["email", "password"];
    const body = { email, password };

    if (!checkBody(body, requiredFields)) {
      setEmailError("Tous les champs sont requis");
      return;
    }

    fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        const status = response.status;
        response.json().then((data) => {
          console.log(status);

          if (status === 202) {
            dispatch(addUserToStore({ provToken: data.provToken }));
            navigation.replace("onBoarding");
          } else if (status === 200) {
            navigation.replace("Dashboard");

            dispatch(addUserToStore({ token: data.token }));
          } else if (status === 404) {
            alert(data.error);
          } else if (status === 400) {
            alert(data.error);
          } else if (status === 401) {
            alert(data.error);
          } else if (status === 500) {
            alert(data.error);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Une erreur s'est produite.");
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>
          Bienvenue dans <Text style={styles.brand}>MOOVE it</Text>
          {"\n"}
          ton coach sportif de poche !
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.form}>
            <TextInput
              placeholder="Entrez votre email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError !== "" && (
              <Text style={{ color: "red", marginTop: 4, marginLeft: 4 }}>
                {emailError}
              </Text>
            )}
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#aaa"
                secureTextEntry={!passwordVisible}
                style={styles.inputText}
                value={password}
                onChangeText={setPassword}
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
              title="Se connecter"
              onPress={handleLogin}
              backgroundColor="#cbb7ff"
              textColor="#000"
            />
          </View>
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

        <TouchableOpacity onPress={() => navigation.navigate("S'inscrire")}>
          <Text style={styles.footer}>Pas encore inscrit ?{"\n"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.link}>username/ mot de passe oublié ?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    width: "100%",
    marginBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 90,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "CocomatPro-Regular",
    marginBottom: 60,
    paddingTop: 20,
    color: "#000",
  },
  brand: {
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    marginBottom: 30,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    fontFamily: "Manrope-Extralight",
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    marginBottom: 16,
    fontFamily: "Manrope-Extralight",
  },
  inputRow: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontFamily: "Manrope-Extralight",
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
  footer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Manrope-Extralight",
    color: "#444",
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
