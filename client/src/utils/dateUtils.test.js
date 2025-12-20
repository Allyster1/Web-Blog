import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, formatBlogDate } from "./dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("formats a valid date string", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatDate(dateString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("formats a Date object", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("returns empty string for null", () => {
      expect(formatDate(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
      expect(formatDate(undefined)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(formatDate("")).toBe("");
    });

    it("returns empty string for invalid date string", () => {
      expect(formatDate("invalid-date")).toBe("");
    });

    it("accepts custom options", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatDate(dateString, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      expect(result).toContain("2024");
      expect(result).toContain("January");
    });

    it("formats date with default options", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatDate(dateString);
      // Should contain month abbreviation, day, and year
      expect(result).toMatch(/\w+\s+\d+,\s+\d{4}/);
    });
  });

  describe("formatDateTime", () => {
    it("formats date with time", () => {
      const dateString = "2024-01-15T14:30:00Z";
      const result = formatDateTime(dateString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should contain time indicators (AM/PM or 24-hour format)
      expect(result.length).toBeGreaterThan(0);
    });

    it("includes date components", () => {
      const dateString = "2024-01-15T14:30:00Z";
      const result = formatDateTime(dateString);
      expect(result).toContain("2024");
      expect(result).toContain("Jan");
    });

    it("returns empty string for invalid date", () => {
      expect(formatDateTime("invalid")).toBe("");
    });

    it("handles Date object", () => {
      const date = new Date("2024-01-15T14:30:00Z");
      const result = formatDateTime(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("formatBlogDate", () => {
    it("formats date in blog format", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatBlogDate(dateString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // Should match format like "Jan 15, 2024"
      expect(result).toMatch(/\w+\s+\d+,\s+\d{4}/);
    });

    it("includes month abbreviation", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatBlogDate(dateString);
      expect(result).toContain("Jan");
    });

    it("includes day", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatBlogDate(dateString);
      expect(result).toContain("15");
    });

    it("includes year", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatBlogDate(dateString);
      expect(result).toContain("2024");
    });

    it("returns empty string for invalid date", () => {
      expect(formatBlogDate("invalid")).toBe("");
    });

    it("handles Date object", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatBlogDate(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("formats different dates correctly", () => {
      const dates = [
        "2024-01-15T10:30:00Z",
        "2024-12-25T10:30:00Z",
        "2023-06-01T10:30:00Z",
      ];

      dates.forEach((dateString) => {
        const result = formatBlogDate(dateString);
        expect(result).toBeTruthy();
        expect(result).toMatch(/\w+\s+\d+,\s+\d{4}/);
      });
    });
  });
});
