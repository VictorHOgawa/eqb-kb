import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Theme from "../../../styles/themes";
import { CameraView, Camera } from "expo-camera";
import { Button } from "../Button";
import { BlurView } from "expo-blur";

interface ScannerProps {
  openScanner: boolean;
  setOpenScanner: any;
  qrCodeInfo: any;
  setQrCodeInfo: any;
  handleScan: any;
  scanLoading: boolean;
  scanned: boolean;
  setScanned: any;
  setScanLoading:any;
}

export function Scanner({
  openScanner,
  setOpenScanner,
  qrCodeInfo,
  scanLoading,
  setScanLoading,
  setQrCodeInfo,
  handleScan,

  scanned,
  setScanned,
}: ScannerProps) {
  const [hasPermission, setHasPermission] = useState<any>(null);


  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    if (data[0] !== "{") {
      setScanned(false);
      return Alert.alert("Código inválido");
    }

    let parsedCode;
    try {
      parsedCode = JSON.parse(data);
    } catch (error) {
      setScanned(false);
      return Alert.alert("Código inválido");
    }

    if (!parsedCode.type || !parsedCode.id) {
      setScanned(false);
      return Alert.alert("Código inválido");
    }

    // Supondo que handleScan é uma função que você definiu em outro lugar
    handleScan(data);
    setQrCodeInfo({ type, data });
  };

  if (hasPermission === null) {
    return <Text className="text-white text-center self-center ">Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text className="text-white text-center self-center ">No access to camera</Text>;
  }
  const reload = () => {
    setScanned(false)
    setScanLoading(false)
  }
  return (
    <>
    <BlurView tint="dark" intensity={99} className=" flex-1 p-4 justify-center bg-black ">
    <View className=" overflow-hidden border-[1px] max-h-[85%] w-full self-center z-90 flex-1 border-primary_100 rounded-lg">

       <View className="bg-[#450A88]/100 p-4  h-full w-full   relative">
        {scanned ? (
          <ActivityIndicator
            size="small"
            color={Theme.color.primary_100}
            style={{ marginTop: "100%" }}
          />
        ) : (
            <View  style={{  height: "90%", width:"100%" ,borderRadius: 20, overflow: 'hidden',borderWidth:1,borderColor:"#c759ec" }} >
            {!scanLoading && (
            <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],  // Adicione ou remova tipos conforme necessário
            }}
            style={{ width: '100%',height: '100%'}}
          />          
            )}
          </View>

        )}
        <View className="flex flex-row items-center justify-evenly mt-auto">
        <TouchableOpacity
                          className=" bg-[#C45EEB]/40 border-[1px] self-center   scale-110  border-[#C45EEB] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                          onPress={() => setOpenScanner(false)}
                        >
                          <Image
                            source={require("../../../../assets/Global/blurBuyButton.png")}
                            className="-mt-2 -ml-2 absolute w-36 h-14"
                          />
                          <Image
                            className="h-5 w-3 absolute left-3 "
                            source={require("../../../../assets/Global/Icons/simpleBackArrow.png")}
                          />
                          <Text className="text-white text-[12px]  font-bold ">
                            Voltar
                          </Text>
                        </TouchableOpacity>
                        {scanned || scanLoading &&  
                        <TouchableOpacity
                        className=" bg-[#75FB4C]/40 border-[1px] scale-110 relative border-[#75FB4C] text-white  h-10 w-32 rounded-md items-center justify-center flex flex-row "
                        onPress={reload}
                      >
                        <Image
                          source={require("../../../../assets/Global/seeTicketBlur.png")}
                          className="-mt-2 -ml-2 absolute w-[144px] h-[52px] "
                        />
                        <View className="flex flex-row items-center justify-center w-full">
                          <View className="flex flex-row w-full self-center items-center justify-center  ">
                            <Image
                              className="w-4 h-[17px] absolute left-2"
                              source={require("../../../../assets/Global/Icons/reload-icon.png")}
                            />
                            <View>
                                <Text className="text-[#290948] text-[12px] font-bold">
                                  Recarregar
                                </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                        }
                        </View>
      </View>
      

  </View>
  </BlurView>
    </>
  );
}
