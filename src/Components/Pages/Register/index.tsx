import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import Theme from "../../../styles/themes";
import { PostAPI } from "../../../utils/api";
import { storageToken } from "../../../utils/tokenManagement";
import { Button } from "../../Global/Button";
import { InputForm } from "../../Global/Forms/FormInput";
import { Container, FormContainer, Label } from "./styles";

export function Form() {
  const navigation = useNavigation<any>();
  const { page, matchId, matchType } = useRoute().params as any;
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  async function handleRegister(formData: any) {
    setLoading(true);
    const connect = await PostAPI("/user/register", formData);
    if (connect.status !== 200) {
      Alert.alert(connect.body);
      return setLoading(false);
    }
    await storageToken(connect.body);
    if (page === "Checkout") {
      navigation.replace("Checkout");
      return setLoading(false);
    } else if (page === "MatchRegister") {
      navigation.replace("MatchRegister", {
        matchId: matchId,
        matchType: matchType,
      });
      return setLoading(false);
    }
    navigation.replace("AppRoutes", { screen: "Home" });
    return setLoading(false);
  }
  return (
    <Container>
      <FormContainer>
        <Label>Nome</Label>
        <InputForm
          name="name"
          control={control}
          placeholder="Nome"
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Label>CPF</Label>
        <InputForm
          name="cpfCnpj"
          control={control}
          placeholder="CPF ou CNPJ"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Label>Número Aqui</Label>
        <InputForm
          name="mobilePhone"
          control={control}
          placeholder="Telefone"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Label>Senha</Label>
        <InputForm
          name="password"
          control={control}
          placeholder="Senha"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Label>Repita a Senha</Label>
        <InputForm
          name="password2"
          control={control}
          placeholder="Repita a senha"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title="Cadastrar"
          onPress={handleSubmit(handleRegister)}
          background={`${Theme.color.primary_100}`}
          color={`${Theme.color.background}`}
          loading={loading}
        />
      </FormContainer>
      <View style={{ height: 300 }} />
    </Container>
  );
}
