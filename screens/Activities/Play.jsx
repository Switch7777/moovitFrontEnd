import { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";

import OnPlay from "./OnActPlay/OnPlay";
import OnDone from "./OnActPlay/OnDone";
import OnProgress from "./OnActPlay/OnProgress";
import Button from "../../components/Buttons";
import LoadingScreen from "../../components/LoadingPage";

export default function Play({ navigation }) {
  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.userInfo.value);

  const tabLevel = ["onPlay", "onDone", "onProgress"];
  const [levelStatus, setLevelStatus] = useState(0);
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [level, setLevel] = useState(user.level);
  const [subLevel, setSubLevel] = useState(user.subLevel);

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
          setActivity(data.activity);
          setIsLoading(false);
        } else {
          console.log("Erreur :", data.error);
        }
      })
      .catch((err) => console.error("Erreur réseau :", err));
  }, []);

  useEffect(() => {
    setLevel(user.level);
    setSubLevel(user.subLevel);
  }, [user.level, user.subLevel]);

  if (isLoading || !activity) {
    return <LoadingScreen message="Chargement du niveau..." />;
  }

  const totalSubLevels = activity.length;
  const subLevelInfos = activity[subLevel - 1];

  const plusstate = () => {
    if (levelStatus < tabLevel.length - 1) {
      setLevelStatus(levelStatus + 1);
    } else {
      navigation.navigate("Dashboard");
      setLevelStatus(0);
    }
  };

  const moinstate = () => {
    if (levelStatus > 0) {
      setLevelStatus(levelStatus - 1);
    } else {
      navigation.goBack();
    }
  };

  let nextLevel = [];
  if (subLevel === totalSubLevels - 1) {
    nextLevel = [level + 1, 1];
  } else {
    nextLevel = [level, subLevel + 1];
  }

  const timing = subLevelInfos.timing;
  const levelxp = subLevelInfos.xp;
  const titleSubLevel = subLevelInfos.title;
  const pourcent = Math.floor((100 * (subLevel - 1)) / totalSubLevels);

  let toDisp = null;
  if (tabLevel[levelStatus] === "onPlay") {
    toDisp = <OnPlay infos={subLevelInfos} title={activity.title} />;
  } else if (tabLevel[levelStatus] === "onDone") {
    toDisp = (
      <OnDone
        user={user.name}
        timing={timing}
        xp={levelxp}
        onPress={moinstate}
        sport={user.sport.title}
      />
    );
  } else if (tabLevel[levelStatus] === "onProgress") {
    toDisp = (
      <OnProgress
        level={user.level}
        subLevel={user.subLevel}
        xp={levelxp}
        name={titleSubLevel}
        pourcent={pourcent}
        token={token}
        sport={user.sport.title}
        levelmoins={level}
        levelplus={level + 1}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.back}>
        <TouchableOpacity style={styles.backButton} onPress={moinstate}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>{toDisp}</View>
      <View style={styles.header}>
        <Button
          title="Continuer"
          onPress={plusstate}
          type="primary"
          style={styles.continueBtn}
          backgroundColor={"#FCEACE"}
          width={"100%"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  back: {
    width: "20%",
  },
  container: {
    flex: 1,
  },
  backButton: {
    paddingLeft: 10,
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
});
