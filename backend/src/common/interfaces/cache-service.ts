export interface CacheService {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  expire(key: string, ttl: number): Promise<void>
  rememberFor<Value>(
    key: string,
    ttl: number,
    callback: () => Promise<Value> | Value,
  ): Promise<Value>
  rememberAndProlong<Value>(
    key: string,
    ttl: number,
    callback: () => Promise<Value> | Value,
  ): Promise<Value>
}
