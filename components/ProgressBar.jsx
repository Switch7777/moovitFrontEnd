import { StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import questionForm from "../data/onBoardingQuestion.json";
// Progress bar au top du onBOARDING, a modifier si le fetch
const ProgressBarComp = (props) => {
  let indice = props.count / (questionForm.length - 1); // Accepte seulement un poucentage
  return (
    <ProgressBar
      progress={indice}
      color={"rgb(100,81,159)"}
      backgroundColor={"#7d6bb3"}
      style={styles.progress}
    />
  );
};
export default ProgressBarComp;

const styles = StyleSheet.create({
  progress: {
    width: "100vw",
  },
});
