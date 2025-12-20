import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies primary variant styles by default", () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-[#53946c]");
  });

  it("applies secondary variant styles", () => {
    const { container } = render(
      <Button variant="secondary">Secondary</Button>
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("border", "border-gray-300");
  });

  it("applies rounded variant styles", () => {
    const { container } = render(<Button variant="rounded">Rounded</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("rounded-3xl");
  });

  it("disables button when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByText("Loading");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("shows loading spinner when isLoading is true", () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("does not show loading spinner when isLoading is false", () => {
    const { container } = render(<Button>Not Loading</Button>);
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-class");
  });

  it("sets button type correctly", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByText("Submit");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    await user.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when isLoading", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} isLoading>
        Loading
      </Button>
    );

    await user.click(screen.getByText("Loading"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
