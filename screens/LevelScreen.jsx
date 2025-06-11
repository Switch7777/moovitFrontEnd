import {
  ImageBackground,
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import CardLevelClicable from "../components/CardLevelClicable";
import { useSelector } from "react-redux";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { API_URL } from "@env";

export default function LevelScreen(props) {
  const token = useSelector((state) => state.user.value.token);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.userInfo.value);
  const [allActivity, setAllActivity] = useState();

  useEffect(() => {
    fetch(`${API_URL}/api/activity/getdataact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        sport: user.sport.title,
        subLevel: user.subLevel,
        level: user.level,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result !== false) {
          setAllActivity(data.activity);
          setIsLoading(false);
        } else {
          console.log("Erreur :", data.error);
        }
      })
      .catch((err) => console.error("Erreur réseau :", err));
  }, []);

  if (isLoading || !allActivity) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#785BFF" />
        <Text style={styles.loaderText}>Chargement des activités...</Text>
      </View>
    );
  }

  let levelsCards = allActivity?.map((e, i) => {
    const isLocked = i > user.subLevel - 1;

    return (
      <View key={i} style={{ position: "relative", marginBottom: 10 }}>
        <CardLevelClicable
          width="100%"
          style={[
            styles.activity,
            isLocked && { opacity: 0.4 }, // grisé
          ]}
          text={e.title}
          description={e.description}
          fontSize={13}
          backgroundColor={"#eaeaea"}
          color="black"
          url={e.image}
          fill={false}
          subLevelSent={e.subLevels}
        />
        {isLocked && (
          <View style={styles.overlayLocked}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
    );
  });

  const topImg =
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747168930/projectFinDeBatch/front/images/activities/padel/padel-photo-026.avif";
  // "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1748380203/projectFinDeBatch/front/images/activities/activities-padel-01_mw10dt.png";
  const niv = "";
  const bgImage = ""; //"https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747168977/projectFinDeBatch/front/images/activities/padel/padel-photo-005.avif"

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Image style={styles.topImg} source={{ uri: topImg }} />
        <View style={styles.textBubble}>
          <Text style={styles.toptxt}>
            Explore tous les niveaux {"\n"}pour suivre ton évolution ! {niv}
          </Text>
        </View>
        <View style={styles.midd}>
          <ScrollView>{levelsCards}</ScrollView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#FEF5F8",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  /*textBubble: {
    backgroundColor: "rgba(255, 255, 255,0.6)",
    borderradius:12,
    paddingHorinzontale:16,
    paddingverticale:8,
    alignSelf:"center",
   marginTop:10,
  },*/
  topImg: {
    width: "100%",
    height: "35%",
  },
  toptxt: {
    marginTop: "-39%",
    paddingBottom: "30%",
    //textAlign: "center",
    fontSize: 25,
    marginLeft: 50,
    fontsize: 40,
    color: "rgb(255, 255, 255)",
    // backgroundColor: "rgba(255, 255, 255, 0.62)",
    width: "100%",
    fontFamily: "ManropeBold",
  },
  // image: {
  //   zIndex: +50,
  //   height: "100%",
  //   width: "100%",
  // },
  midd: {
    backgroundColor: "rgba(85, 23, 23, 0)",
    // zIndex:"999",
    // backgroundColor: "rgba(255, 255, 255, 0)",
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  // try: {
  //   backgroundColor: "rgba(255, 255, 255, 0)",
  // },

  // CenterImg: {
  //   width: "10",
  //   height: "10",
  // },

  text: {
    color: "grey",
    fontSize: 20,
    marginLeft: -170,
  },
  topButton: {
    flex: 0,
    flexDirection: "row",
  },
  // activity: {},
  bottomButton: {
    flexDirection: "row",
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
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    zIndex: 1,
  },

  lockIcon: {
    fontSize: 24,
    color: "#fff",
    opacity: 0.9,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  backText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
