import { PageContext } from "@yext/pages";
import { hydrateRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

export { render };

const render = async (pageContext: PageContext<any>) => {
  const { Page, pageProps } = pageContext;
  hydrateRoot(
    document.getElementById("reactele"),
    <Auth0Provider
      domain="dev-u3433rooy5m6eezt.us.auth0.com"
      clientId="GF0dafL06NHsW1uSr2IRU840z5I8RP0Z"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/oauth/callback`,
      }}
    >
      <Page {...pageProps} />
    </Auth0Provider>
  );
};
