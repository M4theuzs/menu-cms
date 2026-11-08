import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SpotService } from '../services/spot.service';
import type { SpotFormDto } from '../dtos/spot.dto';

const QUERY_KEY = ['spots'];

export function useSpots() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: SpotService.listAll,
  });
}

export function useCreateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SpotFormDto) => SpotService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: SpotFormDto }) => SpotService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SpotService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
