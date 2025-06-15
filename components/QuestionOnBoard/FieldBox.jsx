import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CardComp from "../Card";
import { useState } from "react";
import * as Location from "expo-location";
import { API_URL } from "@env";
// Si type de question === fieldboc
export default function FieldBox({ question, infos, handleChange }) {
  const [errors, setErrors] = useState({}); // Mise en place dun systeme d'erreur
  const [loadingGeo, setLoadingGeo] = useState(false); // Pour geoloc

  const validate = (name, value, range) => {
    if (range && value !== "") {
      const val = parseInt(value, 10); // cOnversion dun input en number base decimal (10)

      if (isNaN(val) || val < range[0] || val > range[1]) {
        setErrors((e) => ({
          ...e,
          [name]: `Valeur entre ${range[0]} et ${range[1]}`, // Spread de erreur afin de garder les erreur existante
        }));
      } else {
        setErrors((e) => ({ ...e, [name]: null }));
      }
    } else {
      setErrors((e) => ({ ...e, [name]: null }));
    }
  };

  const getLocation = async () => {
    try {
      setLoadingGeo(true);

      let { status } = await Location.requestForegroundPermissionsAsync(); // Demande autorisation de geoloc
      if (status !== "granted") {
        alert("Permission refusée pour la géolocalisation.");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      // Appel backend
      const response = await fetch(`${API_URL}/api/geoloc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: latitude, lon: longitude }),
      });

      if (!response.ok) throw new Error("Erreur backend");

      const data = await response.json();
      console.log(data);
      if (data.city) {
        handleChange("city", data.city);
      } else {
        alert("Ville non détectée par le backend.");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingGeo(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* si presence de mainquestion dans le questionnaire  */}
      {question.mainQuestion && (
        <CardComp
          color="#F5F5F5"
          text={question.mainQuestion}
          borderColor="#D5D5D5"
        />
      )}
      {/* si presence de secondaryquestion dans le questionnaire  */}
      {question.secondaryQuestion && (
        <Text style={styles.secondary}>{question.secondaryQuestion}</Text>
      )}

      <View style={styles.fields}>
        {/* Map sur les question  CheckBOX , ONPRESS = fonction dans le parent (ajout dun objet avec les data de l'objet selctionné) */}
        {question.data.map((data) => (
          <View key={data.name} style={styles.inputGroup}>
            <Text style={styles.label}>{data.title}</Text>
            <TextInput
              value={infos[data.name] || ""}
              onChangeText={(text) => {
                handleChange(data.name, text);
                {
                  /* a CHAQUE changetext , verification si l'input est entre le range dans le form */
                }
                validate(data.name, text, data.range);
              }}
              placeholder={data.desc}
              style={styles.input}
              // en fonction du fieldtype , formattage du keyboard (Securite)
              keyboardType={data.fieldType === "number" ? "numeric" : "default"}
            />
            {/* si geoloc dans le json , mise en place du bouton */}
            {data.useGeolocation && (
              <TouchableOpacity style={styles.geoBtn} onPress={getLocation}>
                <Text style={styles.geoBtnText}>
                  {loadingGeo ? "Recherche..." : "Géolocalise-moi"}
                </Text>
              </TouchableOpacity>
            )}
            {/* Afiichage des erreur */}
            {errors[data.name] && (
              <Text style={styles.errorText}>{errors[data.name]}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  secondary: {
    fontSize: 18,
    fontFamily: "ManropeBold",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  fields: {
    gap: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: "ManropeBold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: "Questrial-Regular",
    backgroundColor: "#fff",
  },
  geoBtn: {
    marginTop: 20,

    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  geoBtnText: {
    color: "black",
    fontFamily: "ManropeBold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "ManropeRegular",
  },
});
