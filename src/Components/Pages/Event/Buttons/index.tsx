import { Linking } from "react-native";
import { Background, Button, Container, Icon, Text } from "./styles";

interface ButtonProps {
  Geo: string;
  Insta: string;
  Whats: string;
}
export function Buttons({ Geo, Insta, Whats }: ButtonProps) {
  const handlePress = (link: string) => {
    if (link === "Geo") {
      Linking.openURL(Geo);
    }
    if (link === "Insta") {
      Linking.openURL(Insta);
    }
    if (link === "Whats") {
      Linking.openURL(Whats);
    }
  };
  return (
    <Container>
      <Button onPress={() => handlePress("Geo")}>
        <Background source={require("../../../../../assets/Details/Geo.png")} />
        <Text>Localização {""}</Text>
        <Icon
          source={require("../../../../../assets/Global/Icons/geoIcon.png")}
        />
      </Button>
      <Button onPress={() => handlePress("Insta")}>
        <Background
          source={require("../../../../../assets/Details/Insta.png")}
        />
        <Text>Instagram {""}</Text>
        <Icon
          source={require("../../../../../assets/Global/Icons/instaIcon.png")}
        />
      </Button>
      <Button onPress={() => handlePress("Whats")}>
        <Background
          source={require("../../../../../assets/Details/Whats.png")}
        />
        <Text>Whatsapp {""}</Text>
        <Icon
          source={require("../../../../../assets/Global/Icons/whatsIcon.png")}
        />
      </Button>
    </Container>
  );
}
