export interface DynamicFilterService {
  insert(filterKey: string, value: string): Promise<void> | void
  exists(filterKey: string, value: string): Promise<boolean> | boolean
  delete(filterKey: string, value: string): Promise<void> | void
}
