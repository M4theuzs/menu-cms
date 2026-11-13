export interface GuestCheckDto {
  id: string;
  createdAt: string;
  status: 'OPENED' | 'CLOSED';
  spot: { id: string; name: string };
}
