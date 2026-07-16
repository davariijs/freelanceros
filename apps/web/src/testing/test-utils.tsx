import React, { ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/providers/QueryProvider";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AppProvider initialLocale="en" initialTheme="dark">
        {children}
      </AppProvider>
    </QueryProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
