import React from "react";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

//creation d'une carte d'activité clicable
// Valeurs par default
function CardLevelClicable(
  {
    text = "", //text
    num = "", //numero de la carte
    description = "", //description s'affiche sous le txt
    color = "black", //color de la font
    fontSize = 13, //fontseize pour le titre
    fontWeight = "700", //la fontWeight de toute les lettre
    width = "150", //long du boutton
    height = "150", //haut du boutton
    backgroundColor = "#FCEACE", //couleur du fond de la carte
    url = "https://reactnative.dev/img/tiny_logo.png", //petite img sur le coté
    linkTo = "Dashboard", //nom de la page ou rediriger
    opacity = "1",
    fill = false, //image qui fait tout le composant
    subLevelSent = {},
  },
  props
) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity //propriete qui permet de clicker comme button et onpress
      onPress={() => {
        navigation.navigate(linkTo, { subLevel: subLevelSent }); // Données envoyées au prochain écran // Inutilisé grace au fetch mais a reutiliser
      }} //lien executable au click
      style={[styles.button, { width, height, backgroundColor }]} //modif du css via les props
    >
      <View
        style={[styles.container, { opacity }]} // contenaier general
      >
        <View
          style={styles.lines} //container uniquement des lignes txt+description permet de gardé l'img dans le cadre du container
        >
          <Text
            style={[styles.buttonText, { color, fontWeight, fontSize }]} //txt en titre modifiable via les props
          >
            {text}
            {/* {num} */}
          </Text>
          <Text
            style={styles.buttonDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>
        <Image
          style={
            url === ""
              ? styles.tinyLogo0
              : fill
              ? styles.tinyLogo2
              : styles.tinyLogo
          }
          source={{ uri: url }}
          resizeMode={fill ? "cover" : "contain"}
        />
      </View>
    </TouchableOpacity>
  );
}
export default CardLevelClicable;

const styles = StyleSheet.create({
  button: {
    //c'est le composant en lui meme
    width: "150", //long du composant
    height: "150", //haut du composant
    borderRadius: 15, //arrondi des angles
    backgroundColor: "#FCEACE", //couleur du bg du composant
    margin: 5, //
    marginRight: 5,
  },
  container: {
    //zone d'affichage interne au composant

    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(1, 1, 1, 0)",
    minWidth: "99%",
    opacity: "0.4",
  },

  buttonText: {
    // titre
    marginLeft: 15,
    fontSize: 13,
    fontWeight: "700",
    color: "black",
  },
  buttonDescription: {
    flexWrap: "wrap",
    fontSize: 12,
    marginLeft: 15,
    fontWeight: "500",
    color: "#9a9898",
    lineHeight: 16,
  },
  lines: {
    flex: 1,
    paddingRight: 10,
  },
  tinyLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: "cover",
  },

  tinyLogo2: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    zIndex: -1,
  },
});
