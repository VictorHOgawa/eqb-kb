// import React, { useState } from "react";
// import { ActivityIndicator, TouchableOpacityProps } from "react-native";

// import {
//   Button,
//   Container,
//   ImageContainer,
//   PickedPhoto,
//   Title,
// } from "./styles";
// import Theme from "../../../../../styles/themes";

// interface Props extends TouchableOpacityProps {
//   loading: boolean;
//   title?: string;
//   fontSize?: number;
//   Photo: string;
// }

// export function ImageUpload({
//   loading,
//   title = "Adicionar Foto",
//   fontSize = 18,
//   Photo,
//   ...rest
// }: Props) {
//   return (
//     <>
//       <Container>
//         <ImageContainer>
//           <Button {...rest}>
//             {loading ? (
//               <ActivityIndicator color={Theme.color.gray_10} />
//             ) : Photo === "" ? (
//               <Title>Adicionar Foto </Title>
//             ) : (
//               <PickedPhoto source={{ uri: Photo }} />
//             )}
//           </Button>
//         </ImageContainer>
//       </Container>
//     </>
//   );
// }

// //{}
