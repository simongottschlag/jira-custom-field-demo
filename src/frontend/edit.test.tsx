import { describe, expect, test } from "vitest";

const add = (a: number, b: number) => a + b;

describe("add", () => {
  const cases = [
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 3, expected: 5 },
    { a: 3, b: 4, expected: 7 },
  ];

  test.each(cases)("add($a, $b) -> $expected", ({ a, b, expected }) => {
    expect(add(a, b)).toEqual(expected);
  });
});
