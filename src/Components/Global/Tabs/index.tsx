import { Container } from "./styles";

interface TabProps extends React.ComponentProps<typeof Container> {
  active: boolean;
}

export function Tabs({ active, ...rest }: TabProps) {
  return <Container active={active} {...rest} />;
}
