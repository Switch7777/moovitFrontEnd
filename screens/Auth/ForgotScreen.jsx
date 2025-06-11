import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export default function ForgotScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Page en construction</Text>

      <LottieView
        source={require("../../assets/Animation - 1748526184745.json")} // chemin package json pour le lien animation en progression + installer au cas où yarn add lottie-react-native
        autoPlay
        loop
        style={styles.cloud}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6C5DD3",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A18CF3",
    marginBottom: 20,
  },
  cloud: {
    width: 150,
    height: 150,
  },
});
