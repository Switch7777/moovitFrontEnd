import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { API_URL } from "@env";
import LoadingScreen from "../../components/LoadingPage";

export default function Train({ navigation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.user.value.token);

  // Charger les données
  useEffect(() => {
    fetch(`${API_URL}/api/train/getdataact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.result && result.activity) {
          setData(result.activity);
          setSecondsLeft(result.activity.duration * 60);
        } else {
          console.error("Erreur API :", result.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur réseau :", err);
        setIsLoading(false);
      });
  }, []);

  // Timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const onVideoEnd = useCallback(() => setPlaying(false), []);
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (isLoading || !data) {
    return <LoadingScreen message="Chargement de l'échauffement..." />;
  }

  const { image, mediaUrl, description, tipOfThePro, duration, title } = data;

  const extractYouTubeID = (url) => {
    try {
      return new URL(url).searchParams.get("v");
    } catch {
      return null;
    }
  };

  const videoId = extractYouTubeID(mediaUrl);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#CDB3EB", "#FFFFFF"]}
      style={styles.wrapper}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>ECHAUFFEMENT</Text>

          <View style={styles.topBlock}>
            <View style={styles.imageCard}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            <TouchableOpacity style={styles.timerCard} onPress={toggleTimer}>
              <Text style={styles.timerLabel}>Timer</Text>
              <AnimatedCircularProgress
                size={90}
                width={8}
                fill={(secondsLeft / (duration * 60)) * 100}
                tintColor="#facc15"
                backgroundColor="#e5e7eb"
                duration={1000}
                rotation={0}
              >
                {() => (
                  <Text style={styles.timerValue}>
                    {formatTime(secondsLeft)}
                  </Text>
                )}
              </AnimatedCircularProgress>
              <Text style={styles.timerText}>
                {isRunning ? "Pause" : "Start"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.videoCard}>
            {videoId ? (
              <YoutubePlayer
                height={200}
                width={"100%"}
                videoId={videoId}
                play={playing}
                onChangeState={(state) => state === "ended" && onVideoEnd()}
                initialPlayerParams={{
                  modestbranding: true,
                  showinfo: false,
                  rel: 0,
                  controls: 1,
                  fs: 0,
                }}
              />
            ) : (
              <Ionicons name="logo-youtube" size={40} color="#1f2937" />
            )}
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Tip of the Pro</Text>
            <Text style={styles.tipText}>{tipOfThePro}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, fontSize: 16, color: "#555" },
  backBtn: { marginBottom: 20 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: 30,
    marginTop: -20,
  },
  topBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  imageCard: {
    width: "65%",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 18,
  },
  timerCard: {
    width: 110,
    height: 180,
    backgroundColor: "#3D3F65",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 50,
  },
  timerLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 4,
  },
  timerText: { fontSize: 14, fontWeight: "500", color: "white" },
  videoCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 1,
    marginBottom: 20,
    marginTop: 50,
  },
  tipBox: {
    marginTop: 40,
    backgroundColor: "#EEEEEE",
    borderRadius: 16,
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#111",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    color: "#333",
  },
});
