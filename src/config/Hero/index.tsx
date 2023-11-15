import { useState } from "react";
import { ComponentConfig } from "@measured/puck";
import { Button } from "@measured/puck";
import { Section } from "../Section";
import styles from "./styles.module.css";
import { LocationContent, YextResponse } from "../../types/api";
import {
  getClassNameFactory,
  getFieldValues,
  getValueByPath,
} from "../../utils/puck-utils";
import { useEditorContext } from "../../utils/useEditorContext";

const getClassName = getClassNameFactory("Hero", styles);

// const { entityId } = useEditorContext();

// TODO: Add support for different locations
// TODO: Add photo and address fields
export type HeroProps = {
  entityTitleField?: { fieldId: string; value: string };
  title: string;
  description: string;
  align?: string;
  padding: string;
  imageMode?: "inline" | "background";
  imageUrl?: string;
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
        const { entityId } = useEditorContext();
        // TODO: move to a util
        const response = await fetch(
          `https://cdn.yextapis.com/v2/accounts/me/content/locations?api_key=${YEXT_PUBLIC_CONTENT_API_KEY}&v=20231112&id=${entityId}`
        );
        const locationResponse: YextResponse<LocationContent> =
          await response.json();
        const location = locationResponse.response.docs?.[0];
        const stringFieldValues = getFieldValues(location, "string");

        return stringFieldValues;
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
    imageUrl: { type: "text" },
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
    if (!props.entityTitleField)
      return { props, readOnly: { title: false, description: false } };

    if (!changed.entityTitleField) {
      return { props };
    }

    const { entityId } = useEditorContext();
    // TODO: move to a util
    const response = await fetch(
      `https://cdn.yextapis.com/v2/accounts/me/content/locations?api_key=${YEXT_PUBLIC_CONTENT_API_KEY}&v=20231112&id=${entityId}`
    );
    const locationResponse: YextResponse<LocationContent> =
      await response.json();
    const location = locationResponse.response.docs?.[0];

    return {
      props: {
        title: getValueByPath(location, props.entityTitleField.fieldId),
        description: "description goes here",
      },
      readOnly: { title: true, description: true },
    };
  },
  render: ({
    title,
    align,
    description,
    buttons,
    padding,
    imageUrl,
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
                backgroundImage: `url("${imageUrl}")`,
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

          {align !== "center" && imageMode !== "background" && imageUrl && (
            <div
              style={{
                backgroundImage: `url('${imageUrl}')`,
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
