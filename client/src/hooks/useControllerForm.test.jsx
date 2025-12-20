import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useControlledFormHook from "./useControllerForm";

describe("useControllerFormHook", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with provided initial values", () => {
    const initialValues = { email: "", password: "" };
    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    expect(result.current.values).toEqual(initialValues);
  });

  it("updates values when changeHandler is called", () => {
    const initialValues = { email: "", password: "" };
    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    act(() => {
      const mockEvent = {
        target: {
          name: "email",
          value: "test@example.com",
        },
      };
      result.current.changeHandler(mockEvent);
    });

    expect(result.current.values.email).toBe("test@example.com");
    expect(result.current.values.password).toBe("");
  });

  it("updates multiple fields independently", () => {
    const initialValues = { email: "", password: "" };
    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.changeHandler({
        target: { name: "email", value: "test@example.com" },
      });
    });

    act(() => {
      result.current.changeHandler({
        target: { name: "password", value: "password123" },
      });
    });

    expect(result.current.values.email).toBe("test@example.com");
    expect(result.current.values.password).toBe("password123");
  });

  it("calls onSubmit when submitHandler is called", async () => {
    const initialValues = { email: "test@example.com", password: "pass123" };
    mockOnSubmit.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    const mockEvent = {
      preventDefault: vi.fn(),
    };

    await act(async () => {
      await result.current.submitHandler(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(initialValues);
  });

  it("resets values to initial values after successful submit", async () => {
    const initialValues = { email: "", password: "" };
    mockOnSubmit.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    // Update values
    act(() => {
      result.current.changeHandler({
        target: { name: "email", value: "test@example.com" },
      });
    });

    expect(result.current.values.email).toBe("test@example.com");

    // Submit form
    await act(async () => {
      await result.current.submitHandler({ preventDefault: vi.fn() });
    });

    // Values should be reset
    expect(result.current.values).toEqual(initialValues);
  });

  it("does not reset values if onSubmit throws an error", async () => {
    const initialValues = { email: "", password: "" };
    const error = new Error("Submission failed");
    mockOnSubmit.mockRejectedValue(error);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    // Update values
    act(() => {
      result.current.changeHandler({
        target: { name: "email", value: "test@example.com" },
      });
    });

    // Submit form (should fail)
    await act(async () => {
      await result.current.submitHandler({ preventDefault: vi.fn() });
    });

    // Values should NOT be reset
    expect(result.current.values.email).toBe("test@example.com");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error submitting form:",
      error
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles complex initial values", () => {
    const initialValues = {
      name: "",
      email: "",
      age: 0,
      interests: [],
    };
    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    expect(result.current.values).toEqual(initialValues);
  });

  it("preserves other fields when updating one field", () => {
    const initialValues = { email: "old@example.com", password: "oldpass" };
    const { result } = renderHook(() =>
      useControlledFormHook(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.changeHandler({
        target: { name: "email", value: "new@example.com" },
      });
    });

    expect(result.current.values.email).toBe("new@example.com");
    expect(result.current.values.password).toBe("oldpass");
  });
});
