import { View, Text, StyleSheet } from "react-native";
import { API_URL } from "@env";
import { Video } from "expo-av";
import Button from "../../components/Buttons";
import { removeUserToStore } from "../../reducers/userSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function WelcomeScreen({ navigation }) {
  const dispatch = useDispatch();
  dispatch(removeUserToStore());

  useEffect(() => {
    fetch(`${API_URL}/api/start`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          console.log("Serveur réveillé :", data.message);
        } else {
          console.log("Erreur de réponse du serveur.");
        }
      })
      .catch((error) => {
        console.error("Impossible de joindre le serveur :", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require("../../assets/video_splash.mp4")}
        shouldPlay
        isLooping
        resizeMode="cover"
        isMuted
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>
            Bienvenue dans{"\n"}
            <Text style={styles.brand}>MOOVE IT,</Text>
            {"\n"}
            ton coach de Poche !
          </Text>

          <Text style={styles.subtitle}>
            L'application sportive personnalisée qui réunit{"\n"}
            les utilisateurs près de chez toi.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="S'inscrire"
              onPress={() => navigation.navigate("S'inscrire")}
            />
            <Button
              title="Se connecter"
              onPress={() => navigation.navigate("Se connecter")}
              backgroundColor="transparent"
              textColor="#d6c9ff"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  textWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "CocomatPro-Regular",
    marginBottom: 12,
  },
  brand: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 30,
    fontFamily: "Manrope-Extralight",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
