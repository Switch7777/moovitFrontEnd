import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart, Grid } from "react-native-svg-charts";
import { G, Text as SvgText } from "react-native-svg";

// Module pour les graph sur les statistique
const Labels = ({ x, y, bandwidth, data }) => (
  <G>
    {data.map((item, index) => (
      <React.Fragment key={index}>
        {/* Valeur au-dessus de la barre */}
        <SvgText
          x={x(index) + bandwidth / 2}
          y={y(item.value) - 10}
          fontSize={16}
          fill="#fff"
          alignmentBaseline="middle"
          textAnchor="middle"
          fontWeight="bold"
        >
          {item.value}
        </SvgText>

        {/* Label en dessous de la barre */}
        <SvgText
          x={x(index) + bandwidth / 2}
          y={y(0) + 20}
          fontSize={12}
          fill="#fff"
          alignmentBaseline="hanging"
          textAnchor="middle"
        >
          {item.label}
        </SvgText>
      </React.Fragment>
    ))}
  </G>
);

export default function MooveItFunChart({
  totalTime = 0,
  exercises = 0,
  xp = 0,
}) {
  const data = [
    { value: totalTime, label: "Temps", svg: { fill: "#E9FEE1" } },
    { value: exercises, label: "Exos", svg: { fill: "#E4F0F4" } },
    { value: xp, label: "XP", svg: { fill: "#C5C4D9" } },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tes perfomances du moment</Text>
      <BarChart
        style={{ height: 100, width: 250 }}
        data={data}
        yAccessor={({ item }) => item.value}
        svg={({ item }) => item.svg}
        spacingInner={0.75}
        gridMin={0}
        contentInset={{ top: 24, bottom: 30 }}
      >
        <Grid />
        <Labels />
      </BarChart>
      <Text style={styles.xpCongrats}>
        {xp > 0
          ? `Bravo ! +${xp} XP gagnés aujourd'hui `
          : " Il est temps de commencer ton entraînement ! "}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "93%",
    backgroundColor: "#3D3F65",
    padding: 10,
    borderRadius: 18,
    alignItems: "center",
    margin: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  xpCongrats: {
    marginTop: 22,
    marginBottom: 20,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#CFDED3",
    letterSpacing: 0.3,
  },
});
