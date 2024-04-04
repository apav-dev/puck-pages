import { ComponentConfig } from "@measured/puck";
import { cn } from "../../utils/cn";
import { Section } from "../components/Section";
import { EntityHeadingText } from "../components/EntityHeadingText";
import { Locations } from "../../types/autogen";
import { useDocument } from "../../hooks/useDocument";
import { Image } from "@yext/pages-components";

export type AdvisorHeroProps = {};

export const AdvisorHero: ComponentConfig<AdvisorHeroProps> = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    const document = useDocument<Locations>();
    const hero = document.c_hero;

    return (
      <div className="h-[900px] relative bg-white">
        <div className="w-10 h-full left-0 top-0 absolute bg-sky-900"></div>
        <div className="flex h-full">
          <div className="w-[46.67%] flex flex-col">
            <div className="flex flex-grow justify-center items-center pl-[110px] pr-[70px]">
              <div className="flex-grow space-y-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Investment Advisor of RBC Dominion Securities
                </h1>
                <div className="w-[109px] h-0.5  bg-sky-900" />
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Your life goals are our life’s work
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#"
                    className="w-[174px] h-[45px] bg-sky-900 border-2 text-center text-white font-semibold rounded-md flex items-center justify-center"
                  >
                    Get started
                  </a>
                </div>
              </div>
            </div>
            <div className="h-[272px] w-full bg-slate-200 self-end" />
          </div>
          <div className="w-[53.33%] flex flex-col">
            <div className="flex flex-grow"></div>
            <div className="h-[136px] w-full bg-sky-900 self-end" />
          </div>
        </div>
      </div>
    );
  },
};
