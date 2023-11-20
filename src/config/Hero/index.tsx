import { useState } from "react";
import { ComponentConfig } from "@measured/puck";
import { Button } from "@measured/puck";
import { Section } from "../Section";
import styles from "./styles.module.css";
import {
  getClassNameFactory,
  getEntityFieldsList,
  getValueByPath,
} from "../../utils/puck-utils";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import { fetchLocation } from "../../utils/api";
import { ImageSelector } from "../../components/fields/ImageUrlField";

const getClassName = getClassNameFactory("Hero", styles);

// TODO: Add photo and address fields
export type HeroProps = {
  entityTitleField?: { fieldId: string; value: string };
  title: string;
  description: string;
  align?: string;
  padding: string;
  imageMode?: "inline" | "background";
  // imageUrlField?: { fieldId: string; value: string };
  image?: { fieldId?: string; value: string };
  buttons: {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
    more?: { text: string }[];
  }[];
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    entityTitleField: {
      label: "Entity Title Field",
      type: "external",
      placeholder: "Title",
      fetchList: async () => {
        const entityId = getEntityIdFromUrl();

        if (!entityId) return [];

        return getEntityFieldsList(entityId, "string");
      },
      getItemSummary: (item) => item?.fieldId || "Select a Field Value",
    },
    title: { type: "text" },
    description: { type: "textarea" },
    buttons: {
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "primary", value: "primary" },
            { label: "secondary", value: "secondary" },
          ],
        },
      },
    },
    align: {
      type: "radio",
      options: [
        { label: "left", value: "left" },
        { label: "center", value: "center" },
      ],
    },
    // imageUrlField: {
    //   label: "Image URL Field",
    //   type: "external",
    //   placeholder: "Title",
    //   fetchList: async () => {
    //     const entityId = getEntityIdFromUrl();

    //     if (!entityId) return [];

    //     return getEntityFieldsList(entityId, "url");
    //   },
    //   getItemSummary: (item) => item?.fieldId || "Select a Field Value",
    // },
    image: {
      label: "Image URL",
      type: "custom",
      render: ({ field, name, onChange, value }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <ImageSelector
            field={field}
            name={name}
            onChange={onChange}
            value={value}
            entityId={entityId}
          />
        );
      },
    },
    imageMode: {
      type: "radio",
      options: [
        { label: "inline", value: "inline" },
        { label: "background", value: "background" },
      ],
    },
    padding: { type: "text" },
  },
  defaultProps: {
    title: "Hero",
    align: "left",
    description: "Description",
    buttons: [{ label: "Learn more", href: "#" }],
    padding: "64px",
  },
  /**
   * The resolveData method allows us to modify component data after being
   * set by the user.
   *
   * It is called after the page data is changed, but before a component
   * is rendered. This allows us to make dynamic changes to the props
   * without storing the data in Puck.
   *
   * For example, requesting a third-party API for the latest content.
   */
  resolveData: async ({ props }, { changed }) => {
    // Determine if there's nothing to update
    if (!changed.entityTitleField) {
      return { props };
    }

    // Fetch the entity if necessary
    let entity;
    if (changed.entityTitleField) {
      const entityId = getEntityIdFromUrl();
      const entityResponse = await fetchLocation(entityId);
      entity = entityResponse.response.docs?.[0];
    }

    // Create a new props object based on the old one
    const newProps = { ...props };

    // Update title if entityTitleField has changed
    if (changed.entityTitleField && props.entityTitleField) {
      newProps.title = getValueByPath(entity, props.entityTitleField.fieldId);
    }

    // Set defaults or other logic for unchanged props
    newProps.description = newProps.description || "description goes here";

    return {
      props: newProps,
      readOnly: {
        title: false,
        description: true,
        // imageUrl: false,
      },
    };
  },
  render: ({
    title,
    align,
    description,
    buttons,
    padding,
    image,
    imageMode,
  }) => {
    // Empty state allows us to test that components support hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_] = useState(0);

    return (
      <Section
        padding={padding}
        className={getClassName({
          left: align === "left",
          center: align === "center",
          hasImageBackground: imageMode === "background",
        })}
      >
        {imageMode === "background" && (
          <>
            <div
              className={getClassName("image")}
              style={{
                backgroundImage: `url("${image?.value}")`,
              }}
            ></div>

            <div className={getClassName("imageOverlay")}></div>
          </>
        )}

        <div className={getClassName("inner")}>
          <div className={getClassName("content")}>
            <h1>{title}</h1>
            {/* <p className={getClassName("subtitle")}>{description}</p> */}
            <div className={getClassName("actions")}>
              {buttons.map((button, i) => (
                <Button
                  key={i}
                  href={button.href}
                  variant={button.variant}
                  size="large"
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>

          {align !== "center" && imageMode !== "background" && image && (
            <div
              style={{
                backgroundImage: `url('${image.value}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderRadius: 24,
                height: 356,
                marginLeft: "auto",
                width: "100%",
              }}
            />
          )}
        </div>
      </Section>
    );
  },
};
