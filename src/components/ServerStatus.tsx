import React, { useEffect, useState } from 'react';
import { checkServerConnection } from '../config';

export function ServerStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  async function checkConnection() {
    const connected = await checkServerConnection();
    setIsConnected(connected);
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm">
          {isConnected ? 'Conectado ao servidor' : 'Desconectado'}
        </span>
      </div>
    </div>
  );
}
