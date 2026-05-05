import { manualProvider } from "@core-nexus/providers/mission";
import { queryOptions } from "@tanstack/react-query";

export const epicsQueryOptions = () =>
  queryOptions({
    queryKey: ["epics"] as const,
    queryFn: () => manualProvider.fetchEpics(),
    staleTime: 5 * 60 * 1000,
  });
