import { ReactNode } from "react";

import { DefaultRootProps } from "@measured/puck";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export type RootProps = {
  children: ReactNode;
  title: string;
} & DefaultRootProps;

function Root({ children, editMode }: RootProps) {
  return (
    <>
      <Header
        logo={"https://placehold.co/144x144"}
        links={[
          { label: "Home", link: "#" },
          { label: "About", link: "#" },
          { label: "Contact", link: "#" },
        ]}
      />
      {children}
      <Footer
        copyrightMessage={"© 2024. All Rights Reserved."}
        // facebook={_site.c_facebook}
        // instagram={_site.c_instagram}
        // youtube={_site.c_youtube}
        // twitter={_site.c_twitter}
        // linkedIn={_site.c_linkedIn}
        footerLinks={[
          { label: "Home", link: "#" },
          { label: "About", link: "#" },
          { label: "Contact", link: "#" },
        ]}
      />
    </>
  );
}

export default Root;
