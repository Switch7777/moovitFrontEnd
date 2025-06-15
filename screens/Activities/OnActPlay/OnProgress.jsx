import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import ProgressStep from "../../../components/ProgressStep";
import { upUserToStore } from "../../../reducers/userInfoSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { API_URL } from "@env";

import { FontAwesome } from "@expo/vector-icons";

export default function OnReward({
  xp,
  name,
  level,
  subLevel,
  levelmoins,
  pourcent,
  sport,
  token,
  levelplus,
}) {
  const dispatch = useDispatch();

  // Random sur medaille en attendant la mise en place d'une bdd coherente avec les activité
  const imagePadel = [
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747827625/projectFinDeBatch/front/images/medals/medal-padel-04_pspous.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747827083/projectFinDeBatch/front/images/medals/medal-padel-03_j1xbl9.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747826943/projectFinDeBatch/front/images/medals/medal-padel-02_enz2s8.png",
  ];

  const imagePool = [
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747826097/projectFinDeBatch/front/images/medals/medal-natation-04_dabzkx.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747811166/projectFinDeBatch/front/images/medals/medal-natation-01_sva2zb.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747747696/projectFinDeBatch/front/images/medals/medal-natation-05_rhqkre.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747747682/projectFinDeBatch/front/images/medals/medal-natation-01_bktbt8.png",
  ];

  function getRandomImage(sport) {
    const images = sport === "Padel" ? imagePadel : imagePool;
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }

  const image = getRandomImage(sport);
  console.log({
    token: token,
    sport: sport,
    subLevel: subLevel,
    level: level,
  });
  useEffect(() => {
    fetch(`${API_URL}/api/update/level`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        sport: sport,
        subLevel: subLevel,
        level: level,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.result) {
          dispatch(upUserToStore(data));
          console.log("demontage");
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du update au démontage :", err);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Ton avancement !</Text>
        <Text style={styles.subText}>
          Suis tes progrès et découvre à quel point tu es proche du niveau
          suivant.
        </Text>
        <View style={styles.prog}>
          <ProgressStep niv={pourcent} epaisseur={30} largeur={300} />
        </View>
        <View style={styles.textProg}>
          <Text>Niveau {levelmoins}</Text>
          <Text>{pourcent}%</Text>
          <Text>Niveau {levelplus}</Text>
        </View>
        <View style={styles.rewardBox}>
          <FontAwesome
            name="star"
            size={20}
            color="#facc15"
            style={styles.icon}
          />
          <Text style={styles.rewardText}>
            Au prochain exercice, tu gagneras {xp} XP !
          </Text>
        </View>
        <Text style={styles.rec}>Ta prochaine récompense !</Text>
        <Image
          source={{
            uri: image,
          }}
          style={styles.medal}
          resizeMode="contain"
        />

        <Text style={styles.medalTitle}>{name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  rec: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  prog: {
    width: 100,
    height: 100,
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    fontFamily: "ManropeRegular",
  },
  subText: {
    fontSize: 15,
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
    fontFamily: "ManropeRegular",
  },
  rewardBox: {
    backgroundColor: "#E4F0F4",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    marginTop: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  rewardText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  medal: {
    width: 120,
    height: 120,
    marginTop: 10,
  },
  medalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textTransform: "uppercase",
    textAlign: "center",
  },
  textProg: {
    flexDirection: "row",
    bottom: "-12%",
    width: "80%",
    justifyContent: "space-between",
  },
});
