import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { CardMethod } from './Cards';
import { PixMethod } from './Pix';
import { useEffect, useState } from 'react';

interface IndividualMethodProps {
  selected: string;
  coupon: string;
  setCoupon: any;
  AddCoupon?: any;
  loadingCoupon: boolean;
  QrCode: boolean;
  setQrCode: any;
  pix: any;
  setPix: any;
  installment: any;
  setInstallment: any;
  installments: any;
  setInstallments: any;
  installmentCount: any;
  setInstallmentCount: any;
}

export function IndividualMethod({
  selected,
  coupon,
  setCoupon,
  loadingCoupon,
  AddCoupon,
  QrCode,
  setQrCode,
  pix,
  setPix,
  installment,
  setInstallment,
  installments,
  setInstallments,
  installmentCount,
  setInstallmentCount,
}: IndividualMethodProps) {
  const [toggle, setToggle] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepTree, setStepTree] = useState(false);
  const [cardsLength, setCardsLength] = useState(0);
  const [isNewCard, setIsNewCard] = useState(true);
  // Shared value para controlar a altura da View
  const height = useSharedValue(300); // altura inicial

  // Handle para mudar a condição e a altura

  useEffect(() => {
    height.value =
      selected === 'Pix' && QrCode
        ? 550
        : selected === 'Pix'
          ? 300
          : stepTwo
            ? 400
            : stepTree
              ? 400
              : isNewCard
                ? 300 + cardsLength * 70
                : 500;
  }, [selected, stepTree, stepTwo, isNewCard, QrCode, cardsLength]);

  const springConfig = {
    damping: 20, // Valor mais alto para amortecimento mais rápido
    stiffness: 120, // Rigidez moderada
    mass: 1, // Massa padrão
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value, springConfig),
    };
  });
  return (
    <Animated.View className="" style={[animatedStyle]}>
      {selected === 'Pix' ? (
        <PixMethod
          coupon={coupon}
          setCoupon={setCoupon}
          AddCoupon={AddCoupon}
          loadingCoupon={loadingCoupon}
          QrCode={QrCode}
          setQrCode={setQrCode}
          pix={pix}
          setPix={setPix}
        />
      ) : (
        <CardMethod
          isStepTwo={stepTwo}
          setCardsLength={setCardsLength}
          setIsStepTwo={setStepTwo}
          coupon={coupon}
          setIsNewCard={setIsNewCard}
          setCoupon={setCoupon}
          setIsStepTree={setStepTree}
          AddCoupon={AddCoupon}
          loadingCoupon={loadingCoupon}
          installment={installment}
          setInstallment={setInstallment}
          installments={installments}
          setInstallments={setInstallments}
          installmentCount={installmentCount}
          setInstallmentCount={setInstallmentCount}
        />
      )}
    </Animated.View>
  );
}
