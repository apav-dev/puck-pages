import { Config, Data } from "@measured/puck";
import { Hero, HeroProps } from "./Hero";

import Root, { RootProps } from "./root";
import { Gallery, GalleryProps } from "./Gallery";

type Props = {
  Hero: HeroProps;
  Gallery: GalleryProps;
};

// We avoid the name config as next gets confused
export const conf: Config<Props, RootProps> = {
  root: {
    render: Root,
  },
  components: {
    Hero,
    Gallery,
  },
};

export const initialData: Data = {
  content: [],
  root: { props: { title: "Title" } },
  zones: {},
};

export default conf;
