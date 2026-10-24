import { FormEvent, useState } from "react"

type FormErrors<T> = Partial<Record<keyof T, string>>

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate: (values: T) => FormErrors<T>,
) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [submitted, setSubmitted] = useState(false)

 function setValue<K extends keyof T>(name: K, value: T[K]) {
  const nextValues = { ...values, [name]: value }
  setValues(nextValues)

  if (submitted) {
    setErrors(validate(nextValues))
  }
}

  function handleSubmit(onValid: (values: T) => void) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setSubmitted(true)
      const nextErrors = validate(values)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length === 0) {
        onValid(values)
      }
    }
  }

  function reset() {
    setValues(initialValues)
    setErrors({})
    setSubmitted(false)
  }

  return { values, errors, setValue, handleSubmit, reset }
}
