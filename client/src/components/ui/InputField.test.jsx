import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField from "./InputField";

describe("InputField", () => {
  it("renders label correctly", () => {
    render(<InputField id="test" label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("associates label with input using htmlFor", () => {
    render(<InputField id="email" label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "email");
  });

  it("renders input with correct type", () => {
    render(<InputField id="email" type="email" label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders placeholder text", () => {
    render(<InputField id="test" label="Test" placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when input value changes", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <InputField id="test" label="Test" value="" onChange={handleChange} />
    );

    const input = screen.getByLabelText("Test");
    await user.type(input, "Hello");
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays value correctly", () => {
    render(
      <InputField
        id="test"
        label="Test"
        value="Test Value"
        onChange={vi.fn()}
      />
    );
    const input = screen.getByLabelText("Test");
    expect(input).toHaveValue("Test Value");
  });

  it("applies required attribute when required is true", () => {
    render(<InputField id="test" label="Test" required />);
    const input = screen.getByLabelText("Test");
    expect(input).toBeRequired();
  });

  it("does not apply required attribute when required is false", () => {
    render(<InputField id="test" label="Test" required={false} />);
    const input = screen.getByLabelText("Test");
    expect(input).not.toBeRequired();
  });

  it("disables input when disabled is true", () => {
    render(<InputField id="test" label="Test" disabled />);
    const input = screen.getByLabelText("Test");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  });

  it("sets autoComplete attribute", () => {
    render(<InputField id="email" label="Email" autoComplete="email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("autoComplete", "email");
  });

  it("sets name attribute to match id", () => {
    render(<InputField id="username" label="Username" />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("name", "username");
  });
});
