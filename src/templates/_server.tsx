import * as ReactDOMServer from "react-dom/server";
import { PageContext } from "@yext/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export { render };

const queryClient = new QueryClient();

const render = async (pageContext: PageContext<any>) => {
  const { Page, pageProps } = pageContext;
  const viewHtml = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <Page {...pageProps} />
      {/* <Router>
        <Routes>
          <Route path="/no-content" element={<h1>Hello from SPA Page!</h1>} />
          <Route path="/*" element={<Page {...pageProps} />} />
        </Routes>
      </Router> */}
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
