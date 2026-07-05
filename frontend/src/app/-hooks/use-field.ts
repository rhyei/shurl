import type { ChangeEventHandler, FocusEventHandler, RefObject } from 'react'
import type { BaseSchema, BaseSchemaAsync } from 'valibot'

import { useRef, useState } from 'react'
import { safeParseAsync } from 'valibot'

import { useRerender } from '#/hooks/use-rerender/use-rerender'

/** The use field element type */
type UseFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/** The use field params type */
export interface UseFieldOptions<TSchema> {
  /** The valibot schema for validation */
  schema?: TSchema
  /** The auto focus */
  autoFocus?: boolean
  /** The initial touched */
  initialTouched?: boolean
  /** The validate on blur */
  validateOnBlur?: boolean
  /** The validate on change */
  validateOnChange?: boolean
  /** The validate on mount */
  validateOnMount?: boolean
}

/** The use field register params type */
export interface UseFieldRegisterParams {
  /** The blur event handler */
  onBlur?: FocusEventHandler<UseFieldElement>
  /** The change event handler */
  onChange?: ChangeEventHandler<UseFieldElement>
}

/** The use field return type */
export interface UseFieldReturn<Value> {
  /** The dirty state */
  dirty: boolean
  /** The error state */
  error?: string
  /** The input ref */
  ref: RefObject<UseFieldElement | null>
  /** The set error function */
  touched: boolean
  /** The set error function */
  clearError: () => void
  /** The focus function */
  focus: () => void
  /** The get value function */
  getValue: () => Value
  /** The register function */
  register: (params?: UseFieldRegisterParams) => {
    onBlur: FocusEventHandler<UseFieldElement>
    onChange: ChangeEventHandler<UseFieldElement>
    ref: (node: UseFieldElement | null | undefined) => void
  }
  /** The reset function */
  reset: () => void
  /** The set error function */
  setError: (error: string) => void
  /** The set value function */
  setValue: (value: Value) => void
  /** The watch function */
  watch: () => Value
}

export const useField = <
  Value = string,
  TSchema extends BaseSchema<unknown, unknown, any> | BaseSchemaAsync<unknown, unknown, any> = any,
>(
  initialValue: Value,
  options?: UseFieldOptions<TSchema>,
): UseFieldReturn<Value> => {
  const inputRef = useRef<UseFieldElement | null>(null)
  const watchingRef = useRef(false)
  const rerender = useRerender()

  const [dirty, setDirty] = useState(false)
  const [touched, setTouched] = useState(options?.initialTouched ?? false)
  const [error, setError] = useState<string | undefined>(undefined)

  const getValue = (): Value => {
    if (!inputRef.current) {
      return initialValue
    }
    if (
      'checked' in inputRef.current &&
      (inputRef.current.type === 'radio' || inputRef.current.type === 'checkbox')
    ) {
      return inputRef.current.checked as unknown as Value
    }
    return inputRef.current.value as unknown as Value
  }

  const setValue = (value: Value) => {
    if (!inputRef.current) return

    if (
      'checked' in inputRef.current &&
      (inputRef.current.type === 'radio' || inputRef.current.type === 'checkbox')
    ) {
      inputRef.current.checked = value as unknown as boolean
      if (watchingRef.current) rerender()
      return
    }

    inputRef.current.value = String(value)
    if (watchingRef.current) rerender()
  }

  const reset = () => {
    setValue(initialValue)
    setDirty(false)
    setTouched(false)
    setError(undefined)
  }

  const focus = () => {
    inputRef.current?.focus()
  }

  const validate = async () => {
    if (!options?.schema) return true

    const value = getValue()
    const result = await safeParseAsync(options.schema, value)

    if (!result.success) {
      const firstIssue = result.issues[0]
      setError(firstIssue.message)
      return false
    }

    setError(undefined)
    return true
  }

  const register = (registerParams?: UseFieldRegisterParams) => ({
    ref: async (node: UseFieldElement | null | undefined) => {
      if (!node) {
        inputRef.current = null
        return
      }

      if (inputRef.current !== node) {
        if (options?.autoFocus) node.focus()
        inputRef.current = node
        if ('checked' in node && node.type === 'radio') {
          node.defaultChecked = (initialValue as unknown) === node.value
          return
        }
        if ('checked' in node && node.type === 'checkbox') {
          node.defaultChecked = !!initialValue
          return
        }
        if ('defaultValue' in node) {
          node.defaultValue = String(initialValue)
        } else {
          node.value = String(initialValue)
        }

        if (options?.validateOnMount) {
          await validate()
        }
      }
    },
    onChange: (async (event) => {
      if (watchingRef.current) rerender()
      const currentValue = getValue()
      setDirty(currentValue !== initialValue)

      if (options?.validateOnChange) {
        await validate()
      } else if (options?.validateOnBlur) {
        setError(undefined)
      }

      registerParams?.onChange?.(event)
    }) as ChangeEventHandler<UseFieldElement>,
    onBlur: (async (event) => {
      if (options?.validateOnBlur) {
        await validate()
      }
      setTouched(true)
      registerParams?.onBlur?.(event)
    }) as FocusEventHandler<UseFieldElement>,
  })

  const watch = (): Value => {
    watchingRef.current = true
    return getValue()
  }

  const clearError = () => setError(undefined)

  return {
    register,
    dirty,
    touched,
    error,
    setError,
    clearError,
    getValue,
    setValue,
    reset,
    watch,
    focus,
    ref: inputRef,
  }
}
