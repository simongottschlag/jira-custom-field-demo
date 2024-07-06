import Resolver from "@forge/resolver";
import api from "@forge/api";
import { Result, Ok, Err } from "@thames/monads";

const resolver = new Resolver();

export interface PizzaTopping {
  id: string;
  name: string;
}

export interface PizzaToppings {
  items: PizzaTopping[];
}

export const checkPizzaToppings = (
  response: any
): Result<PizzaToppings, string> => {
  if (
    !response ||
    !response.items ||
    !Array.isArray(response.items) ||
    response.items.length === 0
  ) {
    return Err("The response does not contain items array");
  }

  for (const [index, item] of response.items.entries()) {
    if (
      !item.id ||
      !item.name ||
      typeof item.id !== "string" ||
      typeof item.name !== "string"
    ) {
      return Err(`Invalid item ${index} in the response`);
    }
  }

  return Ok(response);
};

resolver.define("getPizzaToppings", async () => {
  const API_URL = process.env.API_URL;
  if (!API_URL) {
    return { error: "API_URL is not defined" };
  }
  const response = await api.fetch(`${API_URL}`);
  const data = await response.json();
  const result = checkPizzaToppings(data);

  if (result.isErr()) {
    return { error: result.unwrapErr() };
  }

  return result.unwrap();
});

export const handler = resolver.getDefinitions();
