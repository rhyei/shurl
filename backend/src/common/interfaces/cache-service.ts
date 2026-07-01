export interface CacheService {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  expire(key: string, ttl: number): Promise<void>
  remember<T>(key: string, ttl: number, callback: () => Promise<T> | T): Promise<T>
}
