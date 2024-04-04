import { ComponentConfig } from "@measured/puck";
import { cn } from "../../utils/cn";
import { Section } from "../components/Section";
import { EntityHeadingText } from "../components/EntityHeadingText";
import { Locations } from "../../types/autogen";
import { useDocument } from "../../hooks/useDocument";
import { Image } from "@yext/pages-components";

export type HeroProps = {
  imageMode?: "inline" | "background";
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    imageMode: {
      type: "radio",
      options: [
        { label: "inline", value: "inline" },
        { label: "background", value: "background" },
      ],
    },
  },
  defaultProps: {
    imageMode: "inline",
  },
  render: ({ imageMode }) => {
    const document = useDocument<Locations>();
    const hero = document.c_hero;

    return (
      <Section
        // padding={padding}
        className={cn(
          "flex items-center relative" // Base classes
          // align === "left" && "justify-start", // Conditional classes
          // align === "center" && "justify-center text-center"
          // Add more conditional classes as needed
        )}
      >
        {hero?.image && imageMode === "background" && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${hero.image.image.url}')`,
              }}
            >
              {/* <Image image={hero.image} layout="" /> */}
            </div>

            <div className="absolute top-0 right-0 bottom-0 left-0 hero-gradient"></div>
          </>
        )}
        <div className="flex items-center relative gap-12 flex-wrap lg:flex-nowrap">
          <div className="flex flex-col gap-4 w-full md:max-w-1/2">
            {/* <EntityHeadingText
              text={subtitle}
              headingLevel="h3"
              className="text-2xl font-semibold mb-1"
            /> */}
            <EntityHeadingText
              text={hero?.title}
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
            {/* <div className="flex flex-col lg:flex-row mb-4 gap-4">
              {buttons.map((button, i) => (
                <Button variant={button.variant} size="lg">
                  <Link key={i} href={button.href}>
                    {button.label}
                  </Link>
                </Button>
              ))}
            </div> */}
          </div>
          {imageMode !== "background" && hero.image && (
            <Image
              image={hero.image.image}
              className="rounded-3xl w-auto ml-auto"
              layout="fixed"
              height={356}
            />
          )}
        </div>
      </Section>
    );
  },
};
