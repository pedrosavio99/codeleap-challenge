import type { ReactNode } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

type Props = {
  children?: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <>
      <RouterProvider router={router} />
      {children}
    </>
  );
}