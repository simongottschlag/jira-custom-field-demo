# Jira Custom Field: Pizza Toppings!

This is a demo project for a jira custom field using Atlassian Forge (UI Kit). It will store an array of objects in an issue, in this case the id and name of a pizza topping which will be fetched from an external API (Azure Functions in this case).

I've also added some steps to convert it to TypeScript as well as enabling vitest.

## Setup

### Create the project

Run `forge create`

- Name for your app: `pizza-toppings-jira-custom-field`
- Select a category: `UI Kit`
- Select a product: `Jira`
- Select a template: `jira-custom-field`

### Convert to TypeScript

Rename files:

- `src/frontend/edit.jsx` -> `src/frontend/edit.tsx`
- `src/frontend/index.jsx` -> `src/frontend/index.tsx`

Create `tsconfig.json`:

```json
{
  "include": ["./src"],
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "importHelpers": true,
    "removeComments": true,
    "jsx": "react-jsx"
  }
}
```

Change the `resources` in `manifest.yml` from `.jsx` to `.tsx`.

### Setup testing

Install vitest: `npm install -D vitest @vitest/coverage-v8`

Add the following to `package.json` (in the `script` section):

```json
{
  [...]
  "scripts": {
    [...]
    "test": "vitest --run --coverage",
    "test:watch": "vitest --watch --coverage"
  },
  [...]
}
```

Add coverage to `.gitignore`: `echo coverage/ >> .gitignore`

Add dummy test `src/frontend/edit.test.tsx`:

```typescript
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
```

Run tests: `npm run test`

> NOTE: If you don't have `react` as a dependency in `package.json`, add it to devDependencies or else vitest may not work as expected.

## Setup Azure Function

Setup an Azure Function (TypeScript, v4) with this code:

```TypeScript
import {
  app,
  output,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

interface PizzaTopping {
  id: string;
  name: string;
}

const pizzaToppings: PizzaTopping[] = [
  { id: "PT-001", name: "Pepperoni" },
  { id: "PT-002", name: "Mushrooms" },
  { id: "PT-003", name: "Onions" },
  { id: "PT-004", name: "Sausage" },
  { id: "PT-005", name: "Bacon" },
  { id: "PT-006", name: "Extra cheese" },
  { id: "PT-007", name: "Black olives" },
  { id: "PT-008", name: "Green peppers" },
  { id: "PT-009", name: "Pineapple" },
  { id: "PT-010", name: "Spinach" },
  { id: "PT-011", name: "Broccoli" },
  { id: "PT-012", name: "Eggplant" },
  { id: "PT-013", name: "Sliced tomatoes" },
  { id: "PT-014", name: "Chicken" },
  { id: "PT-015", name: "Artichoke hearts" },
  { id: "PT-016", name: "Buffalo chicken" },
  { id: "PT-017", name: "Barbecue sauce" },
  { id: "PT-018", name: "Pesto sauce" },
  { id: "PT-019", name: "Garlic" },
  { id: "PT-020", name: "Red peppers" },
  { id: "PT-021", name: "Anchovies" },
  { id: "PT-022", name: "Basil" },
  { id: "PT-023", name: "Feta cheese" },
  { id: "PT-024", name: "Ham" },
  { id: "PT-025", name: "Salami" },
  { id: "PT-026", name: "Meatball" },
  { id: "PT-027", name: "Pepperoncini" },
  { id: "PT-028", name: "Jalapeno" },
  { id: "PT-029", name: "Kalamata olives" },
  { id: "PT-030", name: "Ground beef" },
  { id: "PT-031", name: "Ricotta cheese" },
  { id: "PT-032", name: "Sun-dried tomatoes" },
  { id: "PT-033", name: "Fresh tomatoes" },
];

export async function getPizzaToppings(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return { status: 200, jsonBody: { items: pizzaToppings } };
}

app.http("getPizzaToppings", {
  methods: ["GET"],
  route: "v1/pizza-toppings",
  authLevel: "function",
  handler: getPizzaToppings,
});
```

## Configure the manifest

```yaml
modules:
  jira:customField:
    - key: pizza-toppings
      name: Pizza Toppings
      description: A custom field for pizza toppings!
      type: object
      formatter:
        expression: "value.items.map((item) => `[${item.id}] ${item.name}`).join(', ')"
      schema:
        properties:
          items:
            type: array
            items:
              type: object
              properties:
                id:
                  type: string
                  searchAlias: ID
                name:
                  type: string
                  searchAlias: Name
        required: ["items"]
      render: native
      resource: main
      edit:
        resource: edit
        render: native
      resolver:
        function: resolver
  function:
    - key: resolver
      handler: index.handler
resources:
  - key: main
    path: src/frontend/index.tsx
  - key: edit
    path: src/frontend/edit.tsx
permissions:
  external:
    fetch:
      backend:
        - "https://[function-app-name].azurewebsites.net"
app:
  runtime:
    name: nodejs18.x
  id: ari:cloud:ecosystem::app/[uuid]
```

## Setup resolver

Add forge dependencies: `npm install --save @forge/resolver @forge/api`

Add monads (just because I like them): `npm install --save @thames/monads`

Create `src/index.ts`, `src/resolvers/index.ts` and `src/resolvers/index.test.ts`.

## Update code

Now modify `src/frontend/edit.tsx` and `src/frontend/index.tsx`.

## Deploy and install

Deploy and install it:

```shell
forge deploy
forge install
```

Configure a variable for API_URL:

```shell
forge variables set --encrypt --environment development API_URL "https://[function-app-name].azurewebsites.net/api/v1/pizza-toppings?code=[your-code]"
```

To run it locally:

```shell
export FORGE_USER_VAR_API_URL="https://[function-app-name].azurewebsites.net/api/v1/pizza-toppings?code=[your-code]
forge tunnel
```
