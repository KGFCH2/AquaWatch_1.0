import React from "react";
import { CrisisOverview } from "../components/CrisisOverview";
import { StateGrid } from "../components/StateGrid";

export const HomePage: React.FC = () => {
  return (
    <>
      <CrisisOverview />
      <StateGrid />
    </>
  );
};
