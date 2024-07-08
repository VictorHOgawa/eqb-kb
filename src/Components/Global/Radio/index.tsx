import { Inside, Outside } from "./styles";

interface RadioProps {
  active: boolean;
}

export function Radio({ active }: RadioProps) {
  return (
    <>
      <Outside>
        <Inside active={active} />
      </Outside>
    </>
  );
}
