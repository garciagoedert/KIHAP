// Endereço do servidor central
// Em desenvolvimento, usa a variável de ambiente ou localhost
// Em produção, deve ser configurado com o IP do servidor central
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

// Função para verificar conexão com o servidor
export async function checkServerConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${SERVER_URL}/api/healthcheck`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Erro ao conectar ao servidor:', error);
    return false;
  }
}

// Função para obter informações do servidor
export async function getServerInfo() {
  try {
    const response = await fetch(`${SERVER_URL}/api/server-info`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter informações do servidor:', error);
    return null;
  }
}

// Verifica se está rodando em produção (Vercel)
export const isProduction = import.meta.env.PROD;
