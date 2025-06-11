import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function AuthRedirector({ navigation }) {
  const { token, provToken } = useSelector((state) => state.user.value);

  useEffect(() => {
    if (token) {
      navigation.replace("Dashboard");
    } else if (provToken) {
      navigation.replace("onBoarding");
    } else {
      navigation.replace("Welcome");
    }
  }, [token, provToken, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#785BFF" />
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
});
