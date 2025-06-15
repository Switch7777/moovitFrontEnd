import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native"; // Activityindicator , module natif pour la roue qui tourne
// V2 APPLICATION PLUS FLUIDE ET MOINS DERREUR
// Message par default
export default function LoadingScreen({ message = "Chargement en cours..." }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/mooveit-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#785BFF" style={styles.loader} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  loader: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
