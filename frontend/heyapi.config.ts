import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3113/api/openapi.json',
  output: 'generated/api',
})
