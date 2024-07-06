import React, { useState, useEffect } from "react";
import ForgeReconciler, {
  Form,
  Label,
  useForm,
  FormSection,
  FormFooter,
  ButtonGroup,
  LoadingButton,
  Button,
  Select,
  Spinner,
} from "@forge/react";
import { invoke, view } from "@forge/bridge";
import { PizzaTopping, PizzaToppings, checkPizzaToppings } from "../resolvers";

const Edit = () => {
  const [renderContext, setRenderContext] = useState(null);
  const [currentPizzaToppings, setCurrentPizzaToppings] =
    useState<PizzaToppings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, getFieldId } = useForm();
  const [pizzaToppings, setPizzaToppings] = useState<PizzaToppings | null>(
    null
  );

  useEffect(() => {
    view.getContext().then((context) => {
      setRenderContext(context.extension.renderContext);
      const result = checkPizzaToppings(context.extension.fieldValue);
      if (result.isOk()) {
        setCurrentPizzaToppings(result.unwrap());
      }
    });
    invoke("getPizzaToppings").then((response: any) => {
      if (response.error) {
        console.error(response.error);
        return;
      }

      setPizzaToppings(response);
    });
  }, []);

  console.error("FOO");

  const onSubmit = async (data: any) => {
    if (!data.items || data.items.length === 0) {
      await view.submit(null);
      return;
    }

    setIsLoading(true);

    try {
      const items = data.items.map((item: any) => {
        return item.value;
      });

      const result = checkPizzaToppings({ items: items });

      if (result.isErr()) {
        throw new Error(`Unable to validate items: ${result.unwrapErr()}`);
      }

      await view.submit(result.unwrap());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pizzaToppings) {
    return <Spinner />;
  }

  const pizzaToppingsOptions = pizzaToppings.items.map((item) => {
    if (!item.id || !item.name) {
      return null;
    }
    return { label: `[${item.id}] ${item.name}`, value: item };
  });

  let defaultPizzaToppings: {
    label: string;
    value: PizzaTopping;
  }[] = [];
  if (currentPizzaToppings) {
    defaultPizzaToppings = currentPizzaToppings.items.map((item) => {
      return { label: `[${item.id}] ${item.name}`, value: item };
    });
  }

  return renderContext === "issue-view" ? (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormSection>
        <Label labelFor={getFieldId("fieldName")}>Choose your toppings</Label>
        <Select
          isMulti={true}
          isClearable={true}
          {...register("items")}
          options={pizzaToppingsOptions}
          defaultValue={defaultPizzaToppings}
        />
      </FormSection>
      <FormFooter>
        <ButtonGroup>
          <Button appearance="subtle" onClick={view.close}>
            Close
          </Button>
          <LoadingButton
            appearance="primary"
            type="submit"
            isLoading={isLoading}
          >
            Submit
          </LoadingButton>
        </ButtonGroup>
      </FormFooter>
    </Form>
  ) : (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Label labelFor={getFieldId("fieldName")}>Choose your toppings</Label>
      <Select
        isMulti={true}
        isClearable={true}
        {...register("items")}
        options={pizzaToppingsOptions}
        defaultValue={defaultPizzaToppings}
      />
    </Form>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <Edit />
  </React.StrictMode>
);
