import { useEffect, useRef, useState, useCallback } from "react";

type WebSocketHookProps<T> = {
  url: string;
  onMessage: (data: T) => void;
  enable: boolean;
};

export default function useWebSocket<T>({ url, onMessage, enable }: WebSocketHookProps<T>) {
  const socket = useRef<WebSocket | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(false);

  const connect = useCallback(() => {
    if (socket.current) {
      socket.current.close();
    }

    socket.current = new WebSocket(url);
    const ws = socket.current;

    ws.onopen = () => {
      console.log("✅ WebSocket подключён:", url);
      setShouldReconnect(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.stream && message.data) {
          onMessage(message.data as T);
        }
      } catch (error) {
        console.error("❌ Ошибка парсинга WebSocket-данных:", error);
      }
    };

    ws.onclose = () => {
      console.log("🔄 WebSocket отключён, переподключение через 3 сек...");
      setShouldReconnect(true);
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket ошибка:", error);
      ws.close();
    };
  }, [url, onMessage]);

  useEffect(() => {
    if (!enable) return;
    connect();

    return () => socket.current?.close();
  }, [connect, enable]);

  useEffect(() => {
    if (shouldReconnect) {
      const timeout = setTimeout(() => {
        connect();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [shouldReconnect, connect]);

  return socket.current;
}
