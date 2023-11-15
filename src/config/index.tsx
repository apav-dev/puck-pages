import { Config, Data } from "@measured/puck";
import { Hero, HeroProps } from "./Hero";

import Root, { RootProps } from "./root";

type Props = {
  Hero: HeroProps;
};

// We avoid the name config as next gets confused
export const conf: Config<Props, RootProps> = {
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

export default conf;
