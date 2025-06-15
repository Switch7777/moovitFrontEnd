import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CardComp from "../Card";
// Si type de question === checkbox
export default function CheckBoxGroup({ question, infos, handleChange }) {
  return (
    <View style={styles.container}>
      {/* si presence de mainquestion dans le questionnaire  */}
      {question.mainQuestion && (
        <View>
          <CardComp
            color="#F5F5F5"
            text={question.mainQuestion}
            borderColor="#D5D5D5"
          />
        </View>
      )}
      {/* si presence de secondaryquestion dans le questionnaire  */}
      {question.secondaryQuestion && (
        <View>
          <Text style={styles.secondary}>{question.secondaryQuestion}</Text>
        </View>
      )}
      {/* si presence de tertiaryquestion dans le questionnaire  */}
      {question.tertiary && (
        <View>
          <Text style={styles.tertiary}>({question.tertiary})</Text>
        </View>
      )}

      <View style={styles.questionDisp}>
        {/* Map sur les question  CheckBOX , ONPRESS = fonction dans le parent (ajout dun objet avec les data de l'objet selctionné) */}
        {question.data.map((data) => (
          <TouchableOpacity
            key={data.answer}
            style={styles.option}
            onPress={() => handleChange(data.name, data.answer)}
          >
            <View
              style={[
                styles.box,

                infos[data.name] === data.answer && styles.boxChecked,
              ]}
            >
              {" "}
              {/* Si data.name selectionné === checbox= checked  */}
              {infos[data.name] === data.answer && (
                <Text style={styles.check}>✔</Text>
              )}
            </View>
            <Text style={styles.text}>{data.answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    height: "100%",
  },
  tertiary: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 100,
    fontStyle: "italic",
  },
  secondary: {
    fontSize: 16,

    marginHorizontal: "auto",
    fontSize: 18,
    fontFamily: "ManropeBold",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: "5%",
    marginBottom: "10%",
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#7d6bb3",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  boxChecked: {
    backgroundColor: "#7d6bb3",
  },
  check: {
    color: "white",
    fontWeight: "bold",
  },
  questionDisp: {
    marginBottom: "20%",
  },
  text: {
    fontSize: 20,
    fontFamily: "Questrial-Regular",
  },
});
