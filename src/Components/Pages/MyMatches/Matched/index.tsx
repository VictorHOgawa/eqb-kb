import { Platform } from "react-native";
import Theme from "../../../../styles/themes";
import { GlobalTitle } from "../../../Global/Title";
import { HorizontalView } from "../../../Global/View/HorizontalView";
import {
  Container,
  Icon,
  InfoButton,
  Locked,
  Map,
  Person,
  PersonView,
} from "./styles";
import { useState } from "react";

interface MatchedProps {
  liked: any;
}
export function Matched({ liked }: MatchedProps) {
  const [locked, setLocked] = useState(true);
  return (
    <Container>
      <HorizontalView style={{ alignItems: "center" }}>
        <GlobalTitle
          title="Quem te deu Like"
          background={`${Theme.color.secondary_40}`}
        />
        <InfoButton>
          <Icon name="infocirlce" size={24} />
        </InfoButton>
      </HorizontalView>
      <Map
        horizontal
        data={liked}
        renderItem={({ item }) => (
          <PersonView>
            <Person
              locked={locked}
              source={{ uri: item.photo }}
              blurRadius={Platform.OS === "android" ? 50 : 8}
            />
            {locked ? (
              <Locked
                source={require("../../../../../assets/MyMatches/Locked.png")}
              />
            ) : (
              <></>
            )}
          </PersonView>
        )}
      />
    </Container>
  );
}
