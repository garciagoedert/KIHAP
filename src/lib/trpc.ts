import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../api';
import { SERVER_URL } from '../config';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${SERVER_URL}/api`,
    }),
  ],
});
