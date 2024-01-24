import { ComponentConfig } from "@measured/puck";
import { ComplexImageType, ImageType, Link } from "@yext/pages-components";
import { cn } from "../../utils/cn";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import { SelectorField } from "../../components/fields/SelectorField";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { useTemplateData } from "../../utils/useTemplateData";
import { Section } from "../components/Section";
import { EntityHeadingText } from "../components/EntityHeadingText";
import { Button } from "../components/Button";
import { ImageField } from "../../components/fields/ImageField";
import { getImageUrl } from "../../utils/type-utils";
import { getTemplateIdFromUrl } from "../../utils/getTemplateIdFromUrl";
import { fetchEntityDocument } from "../../utils/api";

const placeholderImgUrl =
  "https://a.mktgcdn.com/p/XS2QGe2SHfM-UxL6qOCxmjUVUYUZ8_lVwj1nIDrqFR4/1560x878.jpg";

export type HeroProps = {
  titleFieldId?: string;
  title?: string;
  subtitleFieldId?: string;
  subtitle?: string;
  // hours?: { fieldId?: string; value: HoursType };
  align?: string;
  padding: string;
  imageMode?: "inline" | "background";
  imageUrlField?:
    | { imageUrl: string }
    | { fieldId: string; value: ComplexImageType | ImageType };
  buttons: {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
  }[];
  document?: Record<string, unknown>;
};

// TODO: fix gradient (maybe)
export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    titleFieldId: {
      label: "Title Field",
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
            label="Title Field"
            entityFieldType="string"
          />
        );
      },
    },
    title: {
      label: "Title",
      type: "text",
    },
    subtitleFieldId: {
      label: "Subtitle Field",
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
            label="Subtitle Field"
            entityFieldType="string"
          />
        );
      },
    },
    subtitle: {
      label: "Subtitle",
      type: "text",
    },
    // hours: {
    //   label: "Hours",
    //   type: "custom",
    //   render: ({ field, onChange, value, name }) => {
    //     const entityId = getEntityIdFromUrl();
    //     return (
    //       <SelectorField
    //         entityId={entityId}
    //         field={field}
    //         value={value}
    //         name={name}
    //         onChange={onChange}
    //         label="Hours"
    //         entityFieldType="hours"
    //       />
    //     );
    //   },
    // },
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
    imageUrlField: {
      label: "Image URL",
      type: "custom",
      render: ({ field, name, onChange, value }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <ImageField
            field={field}
            name={name}
            onChange={onChange}
            value={value ?? { imageUrl: placeholderImgUrl }}
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
    // "hidden" document prop to prevent it from showing up in the sidebar
    document: {
      type: "custom",
      render: () => {
        return <></>;
      },
    },
  },
  resolveData: async ({ props, readOnly }, { changed }) => {
    let document: Record<string, unknown>;
    if (props.document) {
      document = props.document;
    } else {
      // TODO: see if this can be grabbed from the context
      const entityId = getEntityIdFromUrl();
      const templateId = getTemplateIdFromUrl();
      const apiResp = await fetchEntityDocument(templateId, entityId);
      document = apiResp.response.document;
    }

    if (document) {
      if (props.titleFieldId) {
        const titleField = document[props.titleFieldId];
        if (titleField) {
          props.title = titleField as string;
          readOnly = { ...readOnly, title: true };
        }
      }

      if (props.subtitleFieldId) {
        const subtitleField = document[props.subtitleFieldId];
        if (subtitleField) {
          props.subtitle = subtitleField as string;
          readOnly = { ...readOnly, subtitle: true };
        }
      }

      if (props.imageUrlField && "fieldId" in props.imageUrlField) {
        const imageField = document[props.imageUrlField.fieldId] as
          | { imageUrl: string }
          | { fieldId: string; value: ComplexImageType | ImageType };
        if (imageField) {
          props.imageUrlField = imageField;
        }
      }
    }

    return { props, readOnly };
  },
  defaultProps: {
    title: "Title",
    subtitle: "Subtitle",
    align: "left",
    buttons: [{ label: "Learn more", href: "#" }],
    padding: "64px",
    imageUrlField: { imageUrl: placeholderImgUrl },
  },
  render: ({
    title,
    subtitle,
    align,
    buttons,
    padding,
    imageUrlField,
    imageMode,
    // hours,
  }) => {
    return (
      <Section
        padding={padding}
        className={cn(
          "flex items-center relative", // Base classes
          align === "left" && "justify-start", // Conditional classes
          align === "center" && "justify-center text-center"
          // Add more conditional classes as needed
        )}
      >
        {/* {imageUrlField && imageMode === "background" && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${
                  "fieldId" in imageUrlField
                    ? document
                      ? getImageUrl({
                          fieldId: imageUrlField.fieldId,
                          value: document[imageUrlField.fieldId],
                        })
                      : getImageUrl(imageUrlField)
                    : imageUrlField.imageUrl
                }')`,
              }}
            ></div>

            <div className="absolute top-0 right-0 bottom-0 left-0 hero-gradient"></div>
          </>
        )} */}

        <div className="flex items-center relative gap-12 flex-wrap lg:flex-nowrap">
          <div className="flex flex-col gap-4 w-full md:max-w-1/2">
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
            {/* {hours && (
              <div className="mb-4">
                <HoursStatus
                  hours={hours.value}
                  separatorTemplate={() => (
                    <span className="w-2 h-2 rounded-full inline-block bg-black mx-2" />
                  )}
                  dayOfWeekTemplate={() => null}
                />
              </div>
            )} */}
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

          {/* {align !== "center" &&
            imageMode !== "background" &&
            imageUrlField && (
              <div
                style={{
                  backgroundImage: `url('${
                    "fieldId" in imageUrlField
                        ? getImageUrl({
                            fieldId: imageUrlField.fieldId,
                            value: document[imageUrlField.fieldId],
                          })
                        : getImageUrl(imageUrlField)
                  }')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  borderRadius: 24,
                  height: 356,
                  marginLeft: "auto",
                  width: "100%",
                }}
              />
            )} */}
        </div>
      </Section>
    );
  },
};
