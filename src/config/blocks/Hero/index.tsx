import { ComponentConfig } from "@measured/puck";
import { Section } from "../../components/Section";
import styles from "./styles.module.css";
import {
  getClassNameFactory,
  getEntityFieldsList,
} from "../../../utils/puck-utils";
import { getEntityIdFromUrl } from "../../../utils/getEntityIdFromUrl";
import { ImageSelector } from "../../../components/fields/ImageUrlField";
import { HeadingField } from "../../../components/fields/HeadingField";
import { EntityHeadingText } from "../../components/EntityHeadingText";
import { SelectorField } from "../../../components/fields/SelectorField";
import { Link, HoursType } from "@yext/pages-components";
import { Button } from "../../components/Button";
import { HoursStatus } from "@yext/sites-react-components";

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
  hours?: { fieldId?: string; value: HoursType };
  align?: string;
  padding: string;
  imageMode?: "inline" | "background";
  // imageUrlField?: { fieldId: string; value: string };
  image?: { fieldId?: string; value: string };
  buttons: {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
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
    hours: {
      label: "Hours",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <SelectorField
            entityId={entityId}
            field={field}
            value={value}
            name={name}
            onChange={onChange}
            label="Hours"
            entityFieldType="hours"
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
  resolveData: async ({ props }, { changed }) => {
    console.log("resolveData", props, changed);
    const items = await getEntityFieldsList("aarons-store", "string");
    return { props };
  },
  defaultProps: {
    // title: { value: "Title" },
    align: "left",
    buttons: [{ label: "Learn more", href: "#" }],
    padding: "64px",
  },
  render: ({
    title,
    subtitle,
    align,
    buttons,
    padding,
    image,
    imageMode,
    hours,
  }) => {
    console.log("hours", hours);
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
            <EntityHeadingText
              text={subtitle}
              headingLevel="h3"
              className="text-2xl font-semibold mb-1"
            />
            <EntityHeadingText
              text={title}
              headingLevel="h1"
              className="text-5xl font-bold mb-4"
            />
            {hours && (
              <div className="mb-4">
                <HoursStatus
                  hours={hours.value}
                  separatorTemplate={() => (
                    <span className="w-2 h-2 rounded-full inline-block bg-black mx-2" />
                  )}
                  dayOfWeekTemplate={() => null}
                />
              </div>
            )}
            <div className="flex flex-col lg:flex-row mb-4 gap-4">
              {buttons.map((button, i) => (
                <Button variant={button.variant} size="lg">
                  <Link key={i} href={button.href}>
                    {button.label}
                  </Link>
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
