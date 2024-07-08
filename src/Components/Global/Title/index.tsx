import { Container, Title, TitleContainer } from "./styles";

interface TitleProps {
  title: string;
  fontSize?: number;
  background?: string;
  color?: string;
  marginTop?: number;
}
export function GlobalTitle({
  title,
  fontSize,
  background,
  color,
  marginTop,
}: TitleProps) {
  return (
    <Container marginTop={marginTop}>
      <TitleContainer fontSize={fontSize} background={background} />
      <Title fontSize={fontSize} color={color}>
        {title}
      </Title>
    </Container>
  );
}
