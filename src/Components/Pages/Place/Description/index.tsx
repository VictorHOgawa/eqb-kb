import { LineBreak } from "../../../Global/LineBreak";
import { GlobalTitle } from "../../../Global/Title";
import { Container, Text } from "./styles";

interface DescriptionProps {
  description: {
    name: string;
    description: string;
  };
}
export function Description({ description }: DescriptionProps) {
  return (
    <Container>
      <GlobalTitle title={description.name} />
      <LineBreak />
      <Text>{description.description}</Text>
    </Container>
  );
}
