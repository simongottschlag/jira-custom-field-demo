import { describe, test, expect } from "vitest";
import { checkPizzaToppings, PizzaToppings } from "./index";
import { Result, Ok, Err } from "@thames/monads";

describe("checkPizzaToppings", () => {
  const cases: {
    description: string;
    input: any;
    expected: Result<PizzaToppings, string>;
  }[] = [
    {
      description: "should return Err for undefined",
      input: undefined,
      expected: Err("The response does not contain items array"),
    },
    {
      description: "should return Err for empty object",
      input: {},
      expected: Err("The response does not contain items array"),
    },
    {
      description: "should return Err for empty items array",
      input: { items: [] },
      expected: Err("The response does not contain items array"),
    },
    {
      description: "should return Err for missing id",
      input: { items: [{ name: "Cheese" }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err for missing name",
      input: { items: [{ id: "1" }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err for invalid id",
      input: { items: [{ id: 1, name: "Cheese" }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err for invalid name",
      input: { items: [{ id: "1", name: false }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err for empty id",
      input: { items: [{ id: "", name: "Cheese" }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err for empty name",
      input: { items: [{ id: "1", name: "" }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err for empty id and empty name",
      input: { items: [{ id: "", name: "" }] },
      expected: Err("Invalid item 0 in the response"),
    },
    {
      description: "should return Err if second item is invalid",
      input: {
        items: [
          { id: "1", name: "Cheese" },
          { id: 2, name: "Pepperoni" },
        ],
      },
      expected: Err("Invalid item 1 in the response"),
    },
    {
      description: "should return Ok for valid response",
      input: { items: [{ id: "1", name: "Cheese" }] },
      expected: Ok({ items: [{ id: "1", name: "Cheese" }] }),
    },
    {
      description: "should return Ok for valid response with multiple items",
      input: {
        items: [
          { id: "1", name: "Cheese" },
          { id: "2", name: "Pepperoni" },
        ],
      },
      expected: Ok({
        items: [
          { id: "1", name: "Cheese" },
          { id: "2", name: "Pepperoni" },
        ],
      }),
    },
  ];

  test.each(cases)("$description", ({ description, input, expected }) => {
    expect(checkPizzaToppings(input)).toEqual(expected);
  });
});
