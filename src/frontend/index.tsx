import React, { useState, useEffect } from "react";
import ForgeReconciler, { Text, TagGroup, Tag } from "@forge/react";
import { view } from "@forge/bridge";
import { PizzaToppings, checkPizzaToppings } from "../resolvers";

const View = () => {
  const [pizzaToppings, setPizzaToppings] = useState<PizzaToppings | null>(
    null
  );

  useEffect(() => {
    view.getContext().then((context) => {
      const result = checkPizzaToppings(context.extension.fieldValue);
      if (result.isErr()) {
        return;
      }
      setPizzaToppings(result.unwrap());
    });
  }, []);

  if (!pizzaToppings) {
    return <>None</>;
  }

  return (
    <>
      <TagGroup>
        {pizzaToppings.items.map((item) => (
          <Tag text={`[${item.id}] ${item.name}`} key={item.id} />
        ))}
      </TagGroup>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <View />
  </React.StrictMode>
);
