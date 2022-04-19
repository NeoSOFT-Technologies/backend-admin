import { render } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../../../../store/index";
import RoleAndPermissions from "./RoleAndPermissions";
it("render without crashing UserDashboard", () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <RoleAndPermissions />
      </Provider>
    </BrowserRouter>
  );
});
