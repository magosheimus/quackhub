type FailableQuery = {
  isError: boolean
  data: unknown
  refetch: () => Promise<unknown>
}

export function hasLoadError(...queries: FailableQuery[]): boolean {
  return queries.some((query) => query.isError && query.data === undefined)
}

export function retryFailedQueries(...queries: FailableQuery[]): void {
  queries
    .filter((query) => query.isError)
    .forEach((query) => {
      void query.refetch()
    })
}
