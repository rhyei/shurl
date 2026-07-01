import { useReducer } from 'react'

export const useRerender = () => useReducer(() => ({}), {})[1]
