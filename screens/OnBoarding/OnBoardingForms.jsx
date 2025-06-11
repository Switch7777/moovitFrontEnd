import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Button from "../../components/Buttons";
import questionForm from "../../data/onBoardingQuestion.json";
import ProgressBarComp from "../../components/ProgressBar";
import CheckBoxGroup from "../../components/QuestionOnBoard/CheckBoxGroup";
import FieldBox from "../../components/QuestionOnBoard/FieldBox";
import ImageSelect from "../../components/QuestionOnBoard/ImageSelect";
import CheckBoxObjectGroup from "../../components/QuestionOnBoard/CheckBoxObjectGroup";
import {
  addInfoToStore,
  removeAllInfoToStore,
} from "../../reducers/onBoardingSlice";
import { addUserToStore } from "../../reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "@env";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function OnBoarding({ navigation }) {
  const [numQuestion, setNumQuestion] = useState(0);
  const [infos, setInfos] = useState({});
  const dispatch = useDispatch();

  const tokenFromRedux = useSelector((state) => state.user.value.provToken);

  const handleChange = (key, value) => {
    setInfos((e) => ({ ...e, [key]: value }));
  };

  useEffect(() => {
    setInfos((e) => ({ ...e, provToken: tokenFromRedux }));
  }, []);

  useEffect(() => {
    dispatch(addInfoToStore(infos));
  }, [infos]);

  useEffect(() => {
    console.log("numQuestion = ", numQuestion);
    if (numQuestion === questionForm.length) {
      fetch(`${API_URL}/api/auth/postsignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(infos),
      }).then((response) => {
        const status = response.status;
        response.json().then((data) => {
          console.log(status);
          if (status === 200) {
            console.log(data);
            dispatch(addUserToStore({ token: data.token }));

            dispatch(removeAllInfoToStore());
            navigation.navigate("Dashboard");
          } else if (status === 400) {
            console.log(data.error);
          } else if (status === 404) {
            console.log(data.error);
          } else if (status === 422) {
            console.log(data.error);
          }
        });
      });
    }
  }, [numQuestion]);

  const btnclick = () => {
    if (questionForm[numQuestion]?.required) {
      for (let i = 0; i < questionForm[numQuestion].data.length; i++) {
        const key = questionForm[numQuestion].data[i].name;
        const fieldType = questionForm[numQuestion].data[i].fieldType;
        const range = questionForm[numQuestion].data[i].range;

        const val = infos[key];

        if (!val) {
          alert("Merci de remplir tous les champs obligatoires");
          return;
        }

        if (fieldType === "number" && range) {
          const numberVal = parseInt(val, 10);
          if (
            isNaN(numberVal) ||
            numberVal < range[0] ||
            numberVal > range[1]
          ) {
            alert(
              `${questionForm[numQuestion].data[i].title} doit être un nombre entre ${range[0]} et ${range[1]}`
            );
            return;
          }
        }
      }
    }

    setNumQuestion((n) => n + 1);
  };

  const onBoardingDisp = (numQuestion) => {
    if (questionForm[numQuestion]?.type) {
      switch (questionForm[numQuestion].type) {
        case "checkBox":
          return (
            <CheckBoxGroup
              question={questionForm[numQuestion]}
              infos={infos}
              handleChange={handleChange}
            />
          );
        case "fieldBox":
          return (
            <FieldBox
              question={questionForm[numQuestion]}
              infos={infos}
              handleChange={handleChange}
            />
          );
        case "imgSelect":
          return (
            <ImageSelect
              question={questionForm[numQuestion]}
              infos={infos}
              handleChange={handleChange}
            />
          );
        case "checkBoxObject":
          return (
            <CheckBoxObjectGroup
              question={questionForm[numQuestion]}
              infos={infos}
              handleChange={handleChange}
            />
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    numQuestion < questionForm.length && (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flexGrow}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.flexGrow}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.countForm}>
                  <Text style={styles.countFormText}>
                    Question : {numQuestion + 1}/{questionForm.length}
                  </Text>
                </View>

                <ProgressBarComp
                  count={numQuestion}
                  total={questionForm.length}
                />

                <View style={styles.formContent}>
                  {onBoardingDisp(numQuestion)}
                </View>
              </ScrollView>

              <View style={styles.fixedButton}>
                <Button title="Continuer" onPress={btnclick} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: responsiveHeight(6),
  },
  flexGrow: {
    flex: 1,
  },
  countForm: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5),
    alignItems: "center",
    marginBottom: responsiveHeight(1.2),
  },
  countFormText: {
    fontFamily: "Questrial",
    fontSize: responsiveFontSize(2.4),
    color: "#858585",
    textAlign: "center",
    flex: 1,
    width: "100%",
  },
  formContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: responsiveHeight(3.5),
    paddingBottom: responsiveHeight(3.5),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  fixedButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 0 : 0,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
