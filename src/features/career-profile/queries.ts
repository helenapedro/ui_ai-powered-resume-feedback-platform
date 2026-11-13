import { useQuery } from '@tanstack/react-query';
import { careerProfileService } from '@/services/career-profile';
import { queryKeys } from '@/features/queries/keys';

export function useCareerProfileQuery() {
  return useQuery({
    queryKey: queryKeys.careerProfile.profile,
    queryFn: () => careerProfileService.getProfile(),
  });
}
