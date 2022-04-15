import { render } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../store";
import StatisticsDashboard from "./StatisticsDashboard";

it("render without crashing  StatisticsDashboard", () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <StatisticsDashboard />
      </Provider>
    </BrowserRouter>
  );
});
