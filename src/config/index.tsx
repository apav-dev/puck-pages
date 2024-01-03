import { Config, Data } from "@measured/puck";
import { Hero, HeroProps } from "./blocks/Hero";

import Root, { RootProps } from "./root";
import { Gallery, GalleryProps } from "./blocks/Gallery";
import { Columns, ColumnsProps } from "./blocks/Columns";
import { TextProps, Text } from "./blocks/Text";
import { Banner, BannerProps } from "./blocks/Banner";
import { Email, EmailProps } from "./blocks/Email";
import { PhoneNumber, PhoneNumberProps } from "./blocks/PhoneNumber";
import { AddressProps, Address } from "./blocks/Address";

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
