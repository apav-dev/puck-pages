import * as ReactDOMServer from "react-dom/server";
import { PageContext } from "@yext/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export { render };

const queryClient = new QueryClient();

const render = async (pageContext: PageContext<any>) => {
  const { Page, pageProps } = pageContext;
  const viewHtml = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <Page {...pageProps} />
    </QueryClientProvider>
  );
  return `<!DOCTYPE html>
    <html lang="<!--app-lang-->">
      <head></head>
      <body>
        <div id="reactele">${viewHtml}</div>
      </body>
    </html>`;
};
