import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3114/api/openapi.json',
  output: 'generated/api',
  plugins: ['@hey-api/client-fetch'],
})
