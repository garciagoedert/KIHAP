import React, { useEffect, useState } from 'react';
import { checkServerConnection, getServerInfo, SERVER_URL } from '../config';

export function ServerStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [serverInfo, setServerInfo] = useState<{ip: string; port: number; url: string} | null>(null);
  const [customUrl, setCustomUrl] = useState(localStorage.getItem('serverUrl') || '');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  async function checkConnection() {
    const connected = await checkServerConnection();
    setIsConnected(connected);
    if (connected) {
      const info = await getServerInfo();
      setServerInfo(info);
    }
  }

  function handleSaveUrl() {
    if (customUrl) {
      localStorage.setItem('serverUrl', customUrl);
      window.location.reload(); // Recarrega a página para usar o novo endereço
    }
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
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          ⚙️
        </button>
      </div>

      {showConfig && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">Configuração do Servidor</h3>
          
          {serverInfo && (
            <div className="mb-4 text-sm">
              <p>IP do Servidor: {serverInfo.ip}</p>
              <p>Porta: {serverInfo.port}</p>
              <p>URL: {serverInfo.url}</p>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="http://ip-do-servidor:3000"
              className="flex-1 px-2 py-1 border rounded"
            />
            <button
              onClick={handleSaveUrl}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            URL atual: {SERVER_URL}
          </p>
        </div>
      )}
    </div>
  );
}
