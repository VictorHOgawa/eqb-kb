import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Chat } from '../pages/Chat';
import { Event } from '../pages/Event';
import { Gift } from '../pages/Gift';
import { Portaria } from '../pages/JobDetails/Portaria';
import { Promoter } from '../pages/JobDetails/Promoter';
import { Jobs } from '../pages/Jobs';
import { Login } from '../pages/Login';
import { Checkout } from '../pages/MakeCheckout';
import { Match } from '../pages/Match';
import { MatchRegister } from '../pages/MatchRegister';
import { MyMatches } from '../pages/MyMatches';
import { Place } from '../pages/Place';
import { Products } from '../pages/Products';
import { Profile } from '../pages/Profile';
import { Purchased } from '../pages/PurchasedItems';
import { Search } from '../pages/Search';
import { Tickets } from '../pages/Tickets';
import { VIP } from '../pages/VIP';
import { AppRoutes } from './NavBar.routes';
import { Match2 } from '../pages/Match2';
import EventProducts from '../pages/EventProducts';
import Teste from '../Components/Global/ChoseCityButton';
import PlaceProducts from '../pages/PlaceProducts';
import Push from '../pages/Push';

const { Navigator, Screen } = createStackNavigator();

export function StackRoutes() {
  return (
    <Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        // cardStyle: {
        //   flex: 1,
        //   bg: "red",
        //   backgroundColor: "red",
        //   margin: 0,
        //   border: 0,
        // },
        gestureEnabled: true,
        detachPreviousScreen: false,
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              opacity: current.progress,
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  translateX: next
                    ? next.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, -layouts.screen.width],
                      })
                    : 0,
                },
              ],
            },
          };
        },
      })}
    >
      <Screen name="Push" component={Push} />
      <Screen name="AppRoutes" component={AppRoutes} />
      <Screen name="MyMatches" component={MyMatches} />
      <Screen name="Tickets" component={Tickets} />
      <Screen name="Place" component={Place} />
      <Screen name="Products" component={Products} />
      <Screen name="EventProducts" component={EventProducts} />

      <Screen name="Login" component={Login} />
      <Screen name="MatchRegister" component={MatchRegister} />
      {/* <Screen name="Teste" component={Teste} /> */}
      <Screen name="Profile" component={Profile} />
      <Screen name="Event" component={Event} />
      <Screen name="PlaceProducts" component={PlaceProducts} />
      <Screen name="Search" component={Search} />
      <Screen name="Checkout" component={Checkout} />
      <Screen name="Jobs" component={Jobs} />
      <Screen name="Promoter" component={Promoter} />
      <Screen name="Match" component={Match2} />
      <Screen name="Portaria" component={Portaria} />

      {/* <Screen name="VIP" component={VIP} /> */}
      <Screen name="Gift" component={Gift} />
      <Screen name="Chat" component={Chat} />
    </Navigator>
  );
}
