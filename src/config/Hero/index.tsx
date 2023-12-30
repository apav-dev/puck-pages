import { ComponentConfig } from "@measured/puck";
import { Button } from "@measured/puck";
import { Section } from "../Section";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../utils/puck-utils";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import { ImageSelector } from "../../components/fields/ImageUrlField";
import { TextField } from "../../components/fields/TextField";
import { HeadingField } from "../../components/fields/HeadingField";
import { EntityHeadingText } from "../../components/EntityHeadingText";

const getClassName = getClassNameFactory("Hero", styles);

export type HeroProps = {
  title?: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
  subtitle?: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
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
    title: {
      label: "Title",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <HeadingField
            entityId={entityId}
            field={field}
            value={value}
            name={name}
            onChange={onChange}
            label="Title"
          />
        );
      },
    },
    subtitle: {
      label: "Subtitle",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <HeadingField
            entityId={entityId}
            field={field}
            value={value}
            name={name}
            onChange={onChange}
            label="Subtitle"
          />
        );
      },
    },
    description: {
      label: "Description",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <TextField
            entityId={entityId}
            field={field}
            value={value}
            name={name}
            onChange={onChange}
            label="Description"
          />
        );
      },
    },
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
    // title: { value: "Title" },
    align: "left",
    description: "Description",
    buttons: [{ label: "Learn more", href: "#" }],
    padding: "64px",
  },
  render: ({
    title,
    subtitle,
    align,
    description,
    buttons,
    padding,
    image,
    imageMode,
  }) => {
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
            <EntityHeadingText text={subtitle} headingLevel="h3" />
            <EntityHeadingText text={title} headingLevel="h1" />
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
