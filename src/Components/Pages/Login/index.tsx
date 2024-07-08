import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Linking, Text, View } from "react-native";
import Theme from "../../../styles/themes";
import { PostAPI, authGetAPI } from "../../../utils/api";
import { maskCpfCnpj } from "../../../utils/masks";
import { storageToken } from "../../../utils/tokenManagement";
import { Button } from "../../Global/Button";
import { InputForm } from "../../Global/Forms/FormInput";
import { Container, Icon, LoginArts, Remember, Title } from "./styles";
import { GlobalTitle } from "../../Global/Title";
import { VerticalView } from "../../Global/View/VerticalView";
import { HorizontalView } from "../../Global/View/HorizontalView";

export function Form() {
  const navigation = useNavigation<any>();
  const { page, id, type } = useRoute().params as any;
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  async function handleLogin(formData: any) {
    setLoading(true);
    formData.cpfCnpj = maskCpfCnpj(formData.cpfCnpj);
    const connect = await PostAPI("/user/login", formData);
    if (connect.status !== 200) {
      Alert.alert(connect.body);
      return setLoading(false);
    }
    await storageToken(connect.body);
    if (page === "Checkout") {
      navigation.replace("Checkout");
      return setLoading(false);
    }
    if (page === "Event" || page === "Place") {
      const matchValidation = await authGetAPI(
        `/match/profile/${id}?type=${type}`
      );
      if (matchValidation.status === 401 && matchValidation.body === "ticket") {
        Alert.alert(
          "Ops!",
          "Para ver a Galera da Night desse Evento você precisa ter um Ingresso"
        );
        return navigation.dispatch(
          StackActions.replace("Event", {
            id: id,
          })
        );
      }
      if (
        matchValidation.status === 401 &&
        matchValidation.body === "profile"
      ) {
        return navigation.navigate("MatchRegister", {
          id: id,
          type: "event",
        });
      }

      navigation.navigate("Match", {
        id: id,
        type: type === "Event" ? "event" : "place",
      });
      return setLoading(false);
    }

    navigation.replace("AppRoutes", { screen: "Home" });
    return setLoading(false);
  }

  const handleRegister = async () => {
    const request = await requestTrackingPermissionsAsync();
    if (request.status !== "granted" && !request.canAskAgain) {
      Alert.alert(
        "Rastreamento de dados",
        "Para criar conta é necessário permitir o rastreamento de dados",
        [
          {
            text: "Cancelar",
          },
          {
            text: "OK",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      setLoading1(true);
      return setLoading1(false);
    }

    setLoading1(true);
    if (page === "Checkout") {
      navigation.replace("Register", { page: "Checkout" });
      return setLoading1(false);
    } else if (page === "MatchRegister") {
      navigation.replace("Register", {
        page: "MatchRegister",
        id: id,
        type: type,
      });
      return setLoading1(false);
    }
    navigation.replace("Register", { page: "Login" });
    return setLoading1(false);
  };

  return (
    <>
      <Container>
        <GlobalTitle title="Login:" />
        <InputForm
          control={control}
          name="cpfCnpj"
          placeholder="CPF/CNPJ"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            borderBottomColor: Theme.color.gray_70,
            borderBottomWidth: 1,
          }}
        />
        <InputForm
          control={control}
          name="password"
          placeholder="Senha"
          autoCapitalize="none"
          autoCorrect={false}
          passwordContainerStyle={{
            borderBottomColor: Theme.color.gray_70,
            borderBottomWidth: 1,
          }}
        />
        <Remember>
          <Title>Esqueci a Senha</Title>
        </Remember>
        <View style={{ justifyContent: "space-between" }}>
          <Button
            title="Entrar"
            onPress={handleSubmit(handleLogin)}
            background={`${Theme.color.confirmation}`}
            color={`${Theme.color.background}`}
            width={150}
            height={35}
            loading={loading}
          />
        </View>
      </Container>
      <Button
        title=""
        onPress={handleRegister}
        background={`${Theme.color.primary_100}`}
        width={210}
        height={50}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            marginTop: 15,
          }}
        >
          <Icon
            source={require("../../../../assets/Global/Icons/RegisterIcon.png")}
          />
          <VerticalView>
            <Text>Não tem cadastro?</Text>
            <Text>Clique aqui agora</Text>
          </VerticalView>
        </View>
      </Button>
      <View
        style={{
          borderBottomColor: Theme.color.gray_10,
          borderBottomWidth: 1,
          width: "80%",
          height: 1,
          alignSelf: "center",
          marginTop: "10%",
        }}
      />
      <GlobalTitle title="Nossa Luta" />
      <HorizontalView
        style={{
          marginTop: "5%",
          justifyContent: "space-evenly",
          width: "90%",
        }}
      >
        <Button
          title=""
          width={130}
          height={130}
          onPress={() => Linking.openURL("https://instagram.com/nightapp_")}
        >
          <LoginArts source={require("../../../../assets/Global/Fight1.png")} />
        </Button>
        <Button
          title=""
          width={130}
          height={130}
          onPress={() => Linking.openURL("https://instagram.com/nightapp_")}
        >
          <LoginArts source={require("../../../../assets/Global/Fight2.png")} />
        </Button>
      </HorizontalView>
    </>
  );
}
