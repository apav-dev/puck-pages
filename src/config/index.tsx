import { Config, Data } from "@measured/puck";
import { Hero, HeroProps } from "./Hero";

import Root, { RootProps } from "./root";
import { Gallery, GalleryProps } from "./Gallery";
import { Columns, ColumnsProps } from "./Columns";
import { TextProps, Text } from "./Text";
import { Banner, BannerProps } from "./Banner";
import { Email, EmailProps } from "./Email";
import { PhoneNumber, PhoneNumberProps } from "./PhoneNumber";
import { AddressProps, Address } from "./Address";

type Props = {
  Hero: HeroProps;
  Gallery: GalleryProps;
  Columns: ColumnsProps;
  Text: TextProps;
  Banner: BannerProps;
  Address: AddressProps;
  Email: EmailProps;
  PhoneNumber: PhoneNumberProps;
};

// We avoid the name config as next gets confused
export const conf: Config<Props, RootProps> = {
  root: {
    render: Root,
  },
  components: {
    Hero,
    Gallery,
    Columns,
    Text,
    Banner,
    Address,
    Email,
    PhoneNumber,
  },
  categories: {
    Basics: { components: ["Banner", "Text"] },
    Entity: { components: ["Address", "Email", "PhoneNumber"] },
    Sections: { components: ["Hero", "Gallery"] },
    Layouts: { components: ["Columns"] },
  },
};

export const initialData: Data = {
  content: [],
  root: { props: { title: "Title" } },
  zones: {},
};

export default conf;
