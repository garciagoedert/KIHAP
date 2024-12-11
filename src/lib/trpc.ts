import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../api';

// URL da API - em desenvolvimento usa localhost, em produção usa a URL da Vercel
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // browser deve usar URL relativa
    return '';
  }
  // em produção, use a URL da Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // fallback para localhost
  return `http://localhost:5177`;
};

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api`,
    }),
  ],
});
