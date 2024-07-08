import { View } from 'react-native';
import { Header } from '../../Components/Global/Header';
import { Form } from '../../Components/Pages/Login';

export function Login() {
  return (
    <View className="flex-1 bg-purple-500 items-center">
      <Header />
      <Form />
    </View>
  );
}
