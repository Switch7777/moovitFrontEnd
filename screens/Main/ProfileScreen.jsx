import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { removeUserToStore } from "../../reducers/userSlice";
import { removeUserInfoToStore } from "../../reducers/userInfoSlice";
import { addUserPhotoToStore } from "../../reducers/userInfoSlice";
import { API_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

export default function ProfileScreen({}) {
  const userInfo = useSelector((state) => state.userInfo.value);
  const token = useSelector((state) => state.user.value.token);
  const [imageUri, setImageUri] = useState(userInfo.photoUrl);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const handleLogout = () => {
    dispatch(removeUserToStore());
    dispatch(removeUserInfoToStore());
    navigation.navigate("Welcome");
  };

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Permission refusée");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
      dispatch(addUserPhotoToStore(selectedAsset.uri));
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri: selectedAsset.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      formData.append("token", token);

      fetch(`${API_URL}/api/cloudinary/idphoto`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            console.log("Photo mise à jour :", data.url);
          } else {
            console.error("Erreur backend :", data.error);
          }
        })
        .catch((err) => {
          console.error("Erreur réseau:", err);
        });
    }
  };
  const deleteAccount = () => {
    Alert.prompt(
      "Confirmation",
      "Entrez votre mot de passe pour supprimer votre compte",
      async (password) => {
        try {
          const response = await fetch(`${API_URL}/api/update/deleteaccount`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token, password: password }),
          });

          const data = await response.json();

          if (data.result) {
            alert("Compte supprimé avec succès");
            navigation.navigate("Welcome");
          } else {
            alert(data.error || "Erreur lors de la suppression du compte");
          }
        } catch (err) {
          console.error("Erreur suppression :", err);
          alert("Une erreur est survenue");
        }
      },
      "secure-text"
    );
  };

  let medalsData;

  let natationImages = [
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747826097/projectFinDeBatch/front/images/medals/medal-natation-04_dabzkx.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747811166/projectFinDeBatch/front/images/medals/medal-natation-01_sva2zb.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747747696/projectFinDeBatch/front/images/medals/medal-natation-05_rhqkre.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747747682/projectFinDeBatch/front/images/medals/medal-natation-01_bktbt8.png",
  ];

  let padelImages = [
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747827625/projectFinDeBatch/front/images/medals/medal-padel-04_pspous.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747827083/projectFinDeBatch/front/images/medals/medal-padel-03_j1xbl9.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747826943/projectFinDeBatch/front/images/medals/medal-padel-02_enz2s8.png",
    "https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1747827941/projectFinDeBatch/front/images/medals/medal-padel-05_shbhmg.png",
  ];

  if (userInfo.sport.title === "Padel") {
    medalsData = padelImages.map((e, i) => {
      return (
        <Image
          source={{
            uri: e,
          }}
          style={styles.badge}
          key={i}
        />
      );
    });
  } else if (userInfo.sport.title === "Natation") {
    medalsData = natationImages.map((e, i) => {
      return (
        <Image
          source={{
            uri: e,
          }}
          style={styles.badge}
          key={i}
        />
      );
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with back and deconnexion */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile image */}
      <View style={styles.profileImageWrapper}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
          <Ionicons
            name="camera"
            size={20}
            color="#fff"
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{userInfo.name}</Text>
      <Text style={styles.username}>{userInfo.username}</Text>

      {/* Stats box poids taille */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="barbell-outline" size={20} color="#555" />
          <View style={styles.statTextBox}>
            <Text style={styles.statLabel}>Poids</Text>
            <Text style={styles.statValue}>{userInfo.weight} kg</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="body-outline" size={20} color="#555" />
          <View style={styles.statTextBox}>
            <Text style={styles.statLabel}>Taille</Text>
            <Text style={styles.statValue}>{userInfo.height} cm</Text>
          </View>
        </View>
      </View>

      {/* Badges */}
      <Text style={styles.subtitle}>Mes médailles</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.badgesContainer}
      >
        {medalsData}
      </ScrollView>

      <View style={styles.xpContainer}>
        <Text style={styles.xpTitle}>XP Gagnés</Text>
        <Text style={styles.xpValue}>{userInfo.xp} XP</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteAccount()}
      >
        <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 40,
  },
  profileImageWrapper: {
    position: "relative",
    width: 200,
    height: 200,
    marginBottom: 10,
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#00000080",
    padding: 6,
    borderRadius: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 10,
  },
  username: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
    marginTop: 30,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  statTextBox: {
    marginLeft: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  badgesContainer: {
    flexDirection: "row",
  },
  badge: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  xpContainer: {
    backgroundColor: "#EFEAFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
    marginBottom: 50,
  },
  xpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  xpValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#785BFF",
  },
  deleteButton: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
