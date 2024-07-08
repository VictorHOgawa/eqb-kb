import YoutubeIframe from "react-native-youtube-iframe";
import { Container } from "./styles";
import { useEffect, useState } from "react";
import { GlobalTitle } from "../../../Global/Title";
import { LineBreak } from "../../../Global/LineBreak";

interface VideoProps {
  video: string;
}
export function Video({ video }: VideoProps) {
  const [cleanUrl, setCleanUrl] = useState("");

  useEffect(() => {
    const [, , , urlPart1] = video.split("/");
    const [, urlPart2] = urlPart1.split("=");
    const [urlPart3] = urlPart2.split("&");
    setCleanUrl(urlPart3);
  }, []);
  return (
    <Container>
      <>
        <GlobalTitle title="Música" />
        <LineBreak />
        <YoutubeIframe
          height={400}
          videoId={cleanUrl}
          play={true}
          webViewStyle={{ opacity: 0.99 }}
        />
      </>
    </Container>
  );
}
