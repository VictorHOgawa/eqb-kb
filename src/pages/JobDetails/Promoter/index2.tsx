import { useState, useEffect } from 'react';
import { AuthPutAPI, authGetAPI } from '../../../utils/api';
import { Container, Help, Icon, Image, JobCard, Map, Text } from './styles';
import { LoadingIn } from '../../../Components/Loading/LoadingIn';
import { Header } from '../../../Components/Global/Header';
import { Ad } from '../../../Components/Global/Ad';
import { GlobalTitle } from '../../../Components/Global/Title';
import { HorizontalView } from '../../../Components/Global/View/HorizontalView';
import { VerticalView } from '../../../Components/Global/View/VerticalView';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Button } from '../../../Components/Global/Button';
import Theme from '../../../styles/themes';
import { More } from '../../../Components/Global/More';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export function Promoter() {
  const navigation = useNavigation<any>();
  const [jobs, setJobs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);

  async function getDetails() {
    setLoading(true);
    const connect = await authGetAPI('/user/promoter');

    if (connect.status !== 200) {
      alert(connect.body);
      return setLoading(false);
    }
    setJobs(connect.body.userEventPromoter);

    return setLoading(false);
  }

  async function handleStatus(item: any, index: number) {
    setCurrentIndex(index);
    setLoading1(true);
    const connect: any = await AuthPutAPI(`/user/promoter/${item.id}`, {
      status: item.status,
    });
    if (connect.status !== 200) {
      Alert.alert(connect.body);
      return setLoading1(false);
    }
    navigation.replace('Promoter');
    return setLoading1(false);
  }

  useEffect(() => {
    getDetails();
  }, []);
  return (
    <>
      <Container>
        {loading ? (
          <LoadingIn />
        ) : (
          <>
            <Header />
            <Ad />
            <GlobalTitle title={'Jobs - Promoter'} />
            {jobs.length === 0 ? (
              <Text
                style={{
                  color: Theme.color.primary_100,
                  padding: 20,
                  alignSelf: 'center',
                  fontFamily: Theme.fonts.Poppins.Regular,
                  fontSize: RFValue(18),
                }}
                className="font-poppinsRegular"
              >
                Nenhum Job encontrado
              </Text>
            ) : (
              <>
                <Map
                  data={jobs}
                  renderItem={({ item, index }) => (
                    <JobCard>
                      <HorizontalView style={{ alignItems: 'center' }}>
                        <Image
                          source={{
                            uri: item.event_promoter.event.photo_location,
                          }}
                        />
                        <VerticalView style={{ marginLeft: '5%' }}>
                          <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                            {item.event_promoter.event.name}
                          </Text>
                          <Text className="font-poppinsRegular">
                            <Icon
                              source={require('../../../../assets/Global/Icons/clockIcon.png')}
                            />
                            <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                              {''} {moment(item.event_promoter.event.date).format('DD/MM/YYYY')}
                            </Text>{' '}
                            às {moment(item.event_promoter.event.date).format('HH:mm')}
                          </Text>
                          <Text className="font-poppinsRegular">
                            <Icon source={require('../../../../assets/Global/Icons/pinIcon.png')} />
                            <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                              {''} {item.event_promoter.event.local}
                            </Text>{' '}
                            {item.event_promoter.event.city.name} /{' '}
                            {item.event_promoter.event.city.state}
                          </Text>
                        </VerticalView>
                      </HorizontalView>
                      <HorizontalView>
                        <VerticalView>
                          <HorizontalView style={{ alignItems: 'center' }}>
                            <Icon
                              source={require('../../../../assets/Global/Icons/Promotion.png')}
                            />
                            <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                              {''} Código: {''}
                            </Text>
                            <Text className="font-poppinsRegular">
                              {''} {item.code}
                            </Text>
                          </HorizontalView>
                          <HorizontalView style={{ alignItems: 'center' }}>
                            <Icon source={require('../../../../assets/Global/Icons/sell.png')} />
                            <Text className="font-poppinsBold" style={{ fontWeight: 'bold' }}>
                              {''} Vendas: {''}
                            </Text>
                            <Text className="font-poppinsRegular">
                              {' '}
                              {item.user_event_product.length + item.user_ticket.length}
                            </Text>
                          </HorizontalView>
                        </VerticalView>
                      </HorizontalView>
                      <Button
                        title={item.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
                        background={
                          item.status === 'ACTIVE' ? Theme.color.red_60 : Theme.color.confirmation
                        }
                        color={
                          item.status === 'ACTIVE' ? Theme.color.gray_10 : Theme.color.background
                        }
                        height={40}
                        width={150}
                        onPress={() => handleStatus(item, index)}
                        loading={loading1 && currentIndex === index}
                      />
                    </JobCard>
                  )}
                />
                <Help>
                  <Icon source={require('../../../../assets/Global/Icons/youtubeIcon.png')} />
                  <Text className="font-poppinsRegular"> {''}Dúvidas? Veja esse Rápido Vídeo</Text>
                </Help>
              </>
            )}

            <More style={{ bottom: '2%' }} type="promoter" />
          </>
        )}
      </Container>
    </>
  );
}
