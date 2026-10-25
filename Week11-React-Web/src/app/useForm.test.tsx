import { renderHook, act } from "@testing-library/react"
import { useForm } from "./useForm"

describe("CareConnect useForm hook", () => {
  test("initializes form fields with default values", () => {
    const { result } = renderHook(() =>
      useForm({ email: "", password: "" }, () => ({}))
    )

    expect(result.current.values).toEqual({
      email: "",
      password: "",
    })
    expect(result.current.errors).toEqual({})
  })

  test("updates an email field when the user types", () => {
    const { result } = renderHook(() =>
      useForm({ email: "" }, () => ({}))
    )

    act(() => {
      result.current.setValue("email", "patient@example.com")
    })

    expect(result.current.values.email).toBe("patient@example.com")
  })

  test("resets form values to their initial state", () => {
    const { result } = renderHook(() =>
      useForm({ email: "" }, () => ({}))
    )

    act(() => {
      result.current.setValue("email", "patient@example.com")
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.values.email).toBe("")
    expect(result.current.errors).toEqual({})
  })
})

describe("CareConnect form submission", () => {
  const validate = (values: { email: string }) =>
    values.email.includes("@")
      ? {}
      : { email: "Enter a valid email address." }

  test("shows an error when an invalid form is submitted", () => {
    const { result } = renderHook(() =>
      useForm({ email: "" }, validate)
    )
    const onValid = jest.fn()

    act(() => {
      result.current.handleSubmit(onValid)({
        preventDefault: jest.fn(),
      } as any)
    })

    expect(result.current.errors.email).toBe(
      "Enter a valid email address."
    )
    expect(onValid).not.toHaveBeenCalled()
  })

  test("submits valid form values", () => {
    const { result } = renderHook(() =>
      useForm({ email: "patient@example.com" }, validate)
    )
    const onValid = jest.fn()

    act(() => {
      result.current.handleSubmit(onValid)({
        preventDefault: jest.fn(),
      } as any)
    })

    expect(onValid).toHaveBeenCalledWith({
      email: "patient@example.com",
    })
  })
})
