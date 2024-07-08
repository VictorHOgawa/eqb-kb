import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { baseURL } from '../utils/api';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  message: string;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export interface Websocket<ServerToClientEvents, ClientToServerEvents> extends Socket {
  emit: (event: string, data: any) => any;
}

const socketContext = createContext({} as any);

export default function SocketProvider({ children }: any) {
  const [token, setToken] = useState('');
  const [socketError, setSocketError] = useState('');
  const [socketId, setSocketId] = useState('');
  const [socketIsActive, setSocketIsActive] = useState(true);
  const [socket, setSocket] = useState<Websocket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    async function getToken() {
      const token = await AsyncStorage.getItem('@nightapp:userToken');
      if (!token) {
        return;
      }

      setToken(token);
    }

    getToken();
  }, []);

  useEffect(() => {
    // Inicializa o socket apenas quando o token estiver disponível
    if (token && socketIsActive) {
      const newSocket: Websocket<ServerToClientEvents, ClientToServerEvents> = io(baseURL, {
        auth: {
          token,
        },
      });

      return setSocket(newSocket);
    }

    return setSocket(null);
  }, [token, socketIsActive]);

  useEffect(() => {
    if (socket && socketIsActive) {
      socket.on('connected', (data) => {
        setSocketId(data);
      });
      socket.on('connect_error', (err) => setSocketError(err.message));
      socket.on('disconnect', () => console.log('disconnected'));
    }
  }, [socket, socketIsActive]);

  const store = {
    socketError,
    setSocketError,
    token,
    setToken,
    socket,
    socketId,
    setSocketIsActive,
  };

  return <socketContext.Provider value={store}>{children}</socketContext.Provider>;
}

export function useSocket() {
  const context = useContext(socketContext);

  const { token, setToken, socket, socketId, setSocketIsActive, socketError, setSocketError } =
    context;

  return {
    socketError,
    setSocketError,
    setSocketIsActive,
    token,
    setToken,
    socket,
    socketId,
  };
}
