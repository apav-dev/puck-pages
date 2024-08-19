import { Config, Data } from "@measured/puck";
// import { Hero, HeroProps } from "./blocks/Hero";

import Root, { RootProps } from "./root";
import { Hero } from "./blocks/Hero";
import { AdvisorHeroProps, AdvisorHero } from "./blocks/AdvisorHero";
import { AddressProps, Address } from "./blocks/Address";

export type FinancialProProps = {
  AdvisorHero: AdvisorHeroProps;
};

export type LocationProps = {
  Hero: AdvisorHeroProps;
  Address: AddressProps;
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
    Address,
  },
};

export const initialData: Data = {
  content: [],
  root: { props: { title: "Title" } },
  zones: {},
};
