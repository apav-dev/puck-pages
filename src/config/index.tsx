import { Config, Data } from "@measured/puck";
// import { Hero, HeroProps } from "./blocks/Hero";

import Root, { RootProps } from "./root";
import { Hero } from "./blocks/Hero";
import { AdvisorHeroProps, AdvisorHero } from "./blocks/AdvisorHero";

export type FinancialProProps = {
  AdvisorHero: AdvisorHeroProps;
};

export type LocationProps = {
  Hero: AdvisorHeroProps;
};

export const financialProConfig: Config<FinancialProProps, RootProps> = {
  root: {
    render: Root,
  },
  components: {
    AdvisorHero,
  },
};

export const locationConfig: Config<LocationProps, RootProps> = {
  root: {
    render: Root,
  },
  components: {
    Hero,
  },
};

export const initialData: Data = {
  content: [],
  root: { props: { title: "Title" } },
  zones: {},
};
