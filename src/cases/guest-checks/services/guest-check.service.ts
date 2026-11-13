import { api } from '@/lib/axios';
import type { GuestCheckDto } from '../dtos/guest-check.dto';

const ENDPOINT = '/guest-checks';

export const GuestCheckService = {
  // Somente comandas abertas (OPENED)
  async listOpened(): Promise<GuestCheckDto[]> {
    const result = await api.get<GuestCheckDto[]>(ENDPOINT, { params: { status: 'OPENED' } });
    return result.data;
  },
};
