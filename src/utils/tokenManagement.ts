import AsyncStorage from '@react-native-async-storage/async-storage';

const dataKey = '@nightapp:userToken';
const phoneKey = '@nightapp:phoneToken';
const refreshDataKey = '@nightapp:userRefreshToken';

export const storageToken = async (data: { token: string; refreshToken: string }) => {
  try {
    await AsyncStorage.setItem(dataKey, JSON.stringify(data.token));
    await AsyncStorage.setItem(refreshDataKey, JSON.stringify(data.refreshToken));
  } catch (err: any) {
    return { status: 400, body: err.message };
  }
  return { status: 200, body: '' };
};

export const storagePhoneToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(phoneKey, token);
  } catch (err: any) {
    return { status: 400, body: err.message };
  }
  return { status: 200, body: '' };
};

export const phoneToken = async () => {
  const token = await AsyncStorage.getItem(phoneKey);
  if (token == null) {
    return '400';
  } else {
    return token;
  }
};

export async function logout() {
  await AsyncStorage.removeItem(dataKey);
  await AsyncStorage.removeItem(refreshDataKey);
}

export const configToken = async () => {
  const token = await AsyncStorage.getItem(dataKey);
  if (token == null) {
    return 400;
  }
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
  };
  return config;
};

export const configRefresh = async () => {
  const refreshToken = await AsyncStorage.getItem('@nightapp:userRefreshToken');
  if (refreshToken == null) {
    return 400;
  }
  const configRefresh = {
    headers: { Authorization: `Bearer ${JSON.parse(refreshToken)}` },
  };
  return configRefresh;
};
