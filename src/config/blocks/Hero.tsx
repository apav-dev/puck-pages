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
  imageUrlField?: { fieldId?: string; imageUrl: string };
  buttons: {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
  }[];
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
  },
  resolveData: async ({ props, readOnly }, { changed }) => {
    // const data = {
    //   props: { ...props },
    //   readOnly: {},
    // };

    if (props.titleFieldId || props.subtitleFieldId) {
      const stringFields = await getEntityFieldsList("string");

      const titleField = stringFields.find(
        (field) => field.fieldId === props.titleFieldId
      );

      const subtitleField = stringFields.find(
        (field) => field.fieldId === props.subtitleFieldId
      );

      if (titleField) {
        props.title = titleField.value as string;
        readOnly = { ...readOnly, title: true };
      } else {
        readOnly = { ...readOnly, title: false };
      }

      if (subtitleField) {
        props.subtitle = subtitleField.value as string;
        readOnly = { ...readOnly, subtitle: true };
      } else {
        readOnly = { ...readOnly, subtitle: false };
      }
    }

    if (changed.imageUrlField && props.imageUrlField?.fieldId) {
      const imageFields = await getEntityFieldsList("image");
      const imageField = imageFields.find(
        (field) => field.fieldId === props.imageUrlField?.fieldId
      ) as ComplexImageType | ImageType | undefined;

      if (imageField) {
        props.imageUrlField = {
          ...props.imageUrlField,
          imageUrl: imageField.image ? imageField.image.url : imageField.url,
        };
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
    const { document } = useTemplateData();

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
        {imageMode === "background" && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("${imageUrlField?.imageUrl}")`,
              }}
            ></div>

            <div className="absolute top-0 right-0 bottom-0 left-0 hero-gradient"></div>
          </>
        )}

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

          {align !== "center" &&
            imageMode !== "background" &&
            imageUrlField && (
              <div
                style={{
                  backgroundImage: `url('${imageUrlField.imageUrl}')`,
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
