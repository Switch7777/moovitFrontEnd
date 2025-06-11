import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "@env";
import CardLevelClicable from "../../components/CardLevelClicable";
import PhotoProfil from "../../components/PhotoProfil";
import ExercisesProgressBar from "../../components/ExercisesProgressBar";
import MooveItFunChart from "../../components/MooveItFunChart";
import { FontAwesome5 } from "@expo/vector-icons";
import { addUserInfoToStore } from "../../reducers/userInfoSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "../../components/LoadingPage";

export default function DashBoard({ props, navigation }) {
  const token = useSelector((state) => state.user.value.token);
  const [animationKey, setAnimationKey] = useState(0);
  const [infoUser, setInfoUser] = useState();
  const [infoActivity, setInfoActivity] = useState([]);
  const [infoWeather, setInfoWeather] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const photoUrl = useSelector((state) => state.userInfo.value.photoUrl);

  useFocusEffect(
    useCallback(() => {
      fetch(`${API_URL}/api/dashboard/initcarroussel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((response) =>
          response.json().then((data) => ({ status: response.status, data }))
        )
        .then(({ status, data }) => {
          if (status === 200) {
            setInfoActivity(data.carouselData);
          } else {
            console.log(data.error);
          }
        })
        .catch((err) => {
          console.error("Erreur réseau :", err);
        });

      fetch(`${API_URL}/api/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((response) =>
          response.json().then((data) => ({ status: response.status, data }))
        )
        .then(({ status, data }) => {
          if (status === 200) {
            setInfoWeather(data);
          } else {
            console.log(data.error);
          }
        })
        .catch((err) => {
          console.error("Erreur réseau :", err);
        });

      fetch(`${API_URL}/api/dashboard/initdash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((response) =>
          response.json().then((data) => ({ status: response.status, data }))
        )
        .then(({ status, data }) => {
          if (status === 200) {
            setInfoUser(data.user);
            dispatch(addUserInfoToStore(data));
            setIsLoading(false);
          } else {
            console.log(data.error);
          }
        })
        .catch((err) => {
          console.error("Erreur réseau :", err);
        });
    }, [token])
  );

  if (isLoading && !infoUser) {
    return <LoadingScreen message="Chargement du DashBoard..." />;
  }

  let levelsCards = (Array.isArray(infoActivity) ? infoActivity : []).map(
    (e, i) => {
      const isLocked = i > infoUser.subLevel - 1;
      const direction = isLocked ? "Dashboard" : "LevelScreen";

      let bgCol;
      if ([0, 3, 6, 9].includes(i)) bgCol = "#c5bdf5";
      else if ([1, 4, 7, 10].includes(i)) bgCol = "#f3c0e7";
      else if ([2, 5, 8, 11].includes(i)) bgCol = "#c7deff";
      else bgCol = "#C5C4D9";

      return (
        <View key={i} style={{ position: "relative", marginRight: 10 }}>
          <CardLevelClicable
            style={styles.activity}
            text={e.title}
            backgroundColor={bgCol}
            color="white"
            url={e.image}
            fill={true}
            opacity={1}
            linkTo={direction}
          />
          {isLocked && (
            <View style={styles.overlayLocked}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
      );
    }
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <LinearGradient colors={["white", "#f6f6f6"]} style={styles.fullScreen}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <TouchableOpacity
              style={styles.cardProfile}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ProfilScreen")}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#555"
                style={styles.chevronIcon}
              />

              <PhotoProfil photoUrl={photoUrl} />

              <View style={styles.textProfilContainer}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.profilText,
                      { fontSize: 20, marginBottom: 10, fontWeight: "500" },
                    ]}
                  >
                    Bonjour {infoUser.name}
                  </Text>
                </View>

                <Text style={styles.profilText}>
                  Prêt pour un nouveau challenge ?
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.cardProgress}>
              <View style={{ flex: 2, justifyContent: "center" }}>
                <Text style={styles.progressTitle}>
                  Niveau actuel : {infoUser.level}
                </Text>
                <Text style={styles.subProgressTitle}>
                  Sous-niveau : {infoUser.subLevel}
                </Text>

                <Text style={styles.progressSteps}>
                  {infoUser.stats.nbSessions}/{infoUser.totalGame} exercices
                  complétés
                </Text>
              </View>

              <View style={styles.progressRightBlock}>
                <ExercisesProgressBar
                  key={animationKey}
                  value={(infoUser.stats.nbSessions * 100) / infoUser.totalGame}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.cardStart}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Play")}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#555"
                style={styles.chevronIcon}
              />

              <View style={styles.textProfilContainer}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.profilText,
                      {
                        fontSize: 20,
                        fontWeight: "500",
                        color: "black",
                      },
                    ]}
                  >
                    <FontAwesome5 name="dumbbell" size={18} color="black" />{" "}
                    {"  "}
                    {infoUser?.xp > 0
                      ? " Reprends ton entraînement ..."
                      : " Commence ton entraînement ..."}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.cardCarousel}>
              <ScrollView
                contentContainerStyle={{ padding: 0 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
              >
                {levelsCards}
              </ScrollView>
            </View>
            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={styles.cardTraining}
                onPress={() => navigation.navigate("Train")}
              >
                <View style={styles.cardTrainingContent}>
                  <FontAwesome5 name="running" size={24} color="black" />
                  <Text style={styles.trainingTitle}>S'échauffer</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#555"
                  style={styles.chevronTraining}
                />
              </TouchableOpacity>
              <View style={styles.cardMeteo}>
                <View style={styles.imageWrapper}>
                  {infoWeather && (
                    <Image
                      source={{ uri: infoWeather.icon }}
                      style={styles.meteoImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <Text style={styles.meteoText}>
                  {infoWeather?.temperature}°C
                </Text>
                <Text style={styles.meteoTextt}>
                  {infoWeather?.weather &&
                    infoWeather.weather.charAt(0).toUpperCase() +
                      infoWeather.weather.slice(1)}
                </Text>
              </View>
            </View>
            <MooveItFunChart
              totalTime={infoUser.stats.totalTime}
              exercises={infoUser.stats.nbSessions}
              xp={infoUser.xp}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 70,
    alignItems: "center",
    minHeight: "100%",
  },
  chevronIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    zIndex: 1,
  },
  cardProfile: {
    width: "92%",
    backgroundColor: "#e3dafb",
    borderRadius: 16,
    marginBottom: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardStart: {
    width: "92%",
    backgroundColor: "#ffe9da",
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 14,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textProfilContainer: {
    marginLeft: 12,
    justifyContent: "center",
  },
  profilText: {
    color: "#262626",
    borderRadius: 15,
  },
  subProgressTitle: {
    color: "#E4F0F4",
    fontSize: 15,
    fontWeight: "400",
    marginTop: 4,
    marginBottom: 10,
  },
  cardProgress: {
    width: "92%",
    backgroundColor: "#7D6BB3",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  progressTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
  },
  progressSteps: {
    color: "#E4F0F4",
    fontSize: 15,
    opacity: 0.92,
  },
  progressRightBlock: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cardCarousel: {
    width: "94%",
    backgroundColor: "transparent",
    borderRadius: 16,

    paddingRight: 5,
  },
  scrollView: {
    width: "100%",
  },
  activity: {
    padding: 0,
  },
  bottomRow: {
    flexDirection: "row",
    width: "92%",
    justifyContent: "space-between",
    alignItems: "stretch",
    height: 150,
  },
  cardTraining: {
    flex: 1,
    backgroundColor: "#e3dafb",
    borderRadius: 16,
    padding: 10,
    marginRight: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },

  cardTraining: {
    flex: 1,
    backgroundColor: "#e3dafb",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 7,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTrainingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  trainingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
    textAlign: "center",
  },

  chevronTraining: {
    marginLeft: 10,
  },
  cardMeteo: {
    flex: 1,
    backgroundColor: "#eef3fa",
    borderRadius: 30,
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    marginTop: 10,
    marginBottom: 10,
  },
  meteoText: {
    fontSize: 15,
    color: "#363255",
    textAlign: "center",
    width: "100%",
    marginTop: 2,
  },
  meteoTextt: {
    fontSize: 15,
    color: "#363255",
    textAlign: "center",
    width: "100%",
    marginTop: 2,
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
  },
  overlayLocked: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    margin: 5,
    zIndex: 1,
  },
  lockIcon: {
    fontSize: 28,
    color: "#fff",
    opacity: 0.9,
  },
  imageWrapper: {
    backgroundColor: "#fff",
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  meteoImage: {
    width: 40,
    height: 40,
  },
});
