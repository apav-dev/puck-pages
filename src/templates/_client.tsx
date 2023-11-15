import { PageContext } from "@yext/pages";
import { hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export { render };

const queryClient = new QueryClient();

const render = async (pageContext: PageContext<any>) => {
  const { Page, pageProps } = pageContext;
  hydrateRoot(
    document.getElementById("reactele"),
    <QueryClientProvider client={queryClient}>
      {/* <Page {...pageProps} /> */}
      <Router>
        <Routes>
          <Route path="/*" element={<Page {...pageProps} />} />
          {/* <Route path="/edit" element={<EditPage />} /> */}
          {/* Define other routes here */}
          {/* You can still pass pageProps to your components if needed */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};
