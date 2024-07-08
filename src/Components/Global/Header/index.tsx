import { useState } from "react";
import { CityButton } from "../../Pages/Home/CityButton";
import { BackButton } from "../Back";
import { AltContainer, AltLogo, Container, Logo } from "./styles";

interface HeaderProps {
  page?: string;
  selectedCity?: any;
  setSelectedCity?: any;
}
export function Header({ page, selectedCity, setSelectedCity }: HeaderProps) {
  return (
    <>
      {page === "main" ? (
        <Container>
          <>
            <Logo source={require("../../../../assets/Global/Logo.png")} />
            <CityButton
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </>
        </Container>
      ) : (
        <AltContainer>
          <>
            <BackButton />
            <AltLogo source={require("../../../../assets/Global/Logo.png")} />
          </>
        </AltContainer>
      )}
    </>
  );
}
