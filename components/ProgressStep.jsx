import { StyleSheet } from "react-native";
import { useState } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View } from "react-native";
// Progress bar demie circulair , sur on reward
const ProgressStep = (props) => {
  const [value, setValue] = useState(0);
  let blue = value * 2.55;

  let newRGB = `rgba(0, 255 , ${blue},0.99)`;
  console.log(blue);

  return (
    <View style={styles.arc}>
      <AnimatedCircularProgress
        size={props.largeur}
        width={props.epaisseur}
        fill={props.niv}
        tintColor="rgba(222, 125, 251, 0.92)"
        backgroundColor="#3d5875"
        padding={10}
        arcSweepAngle={180}
        rotation={"270"} // Presque demi cercle
        lineCap="round"
      />
    </View>
  );
};

export default ProgressStep;
const styles = StyleSheet.create({});
