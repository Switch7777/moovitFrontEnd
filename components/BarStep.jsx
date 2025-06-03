import { AnimatedCircularProgress } from "react-native-circular-progress";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { View } from "react-native";

//a importé dans le terminal !!!npm i react-native-circular-progress + npm i --save react-native-circular-progress react-native-svg// npx expo install react-native-reanimated + yarn add react-native-circular-progress-indicator + yarn add react-native-svg

const BarStep = (props) => {
  let blue = props.value * 2.55;
  let newRGB = `rgba(0, 255 , ${blue},0.99)`;
  console.log(blue);

  return (
    <View style={styles.arc}>
      <AnimatedCircularProgress
        // z-index={9999}
        size={310}
        width={35}
        fill={props.value}
        // tintColor="#00e0ff"
        tintColor={newRGB}
        backgroundColor="#3d5875"
        padding={10}
        arcSweepAngle={180}
        rotation={"270"}
        lineCap="round"
      />
    </View>
  );
};

export default BarStep;
const styles = StyleSheet.create({
  arc: {
    marginLeft: "8%",
    marginTop: "10%",
    paddingBottom: "9%",
  },
});
