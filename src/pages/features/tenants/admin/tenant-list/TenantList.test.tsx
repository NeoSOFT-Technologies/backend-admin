import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../../../../store/index";
import TenantList from "./TenantList";

const mockApi = new MockAdapter(axios);

it("render without crashing Tenant list", () => {
  mockApi
    .onGet("/api/tenants?isDeleted=false&page=1")
    .reply(200, { data: [{ name: "Rohit" }], count: 1 });
  render(
    <BrowserRouter>
      <Provider store={store}>
        <TenantList />
      </Provider>
    </BrowserRouter>
  );
});

it("render the active, inactive and all buttons", () => {
  mockApi
    .onGet("/api/tenants?page=1")
    .reply(200, { data: [{ name: "Rohit" }], count: 1 });
  render(
    <BrowserRouter>
      <Provider store={store}>
        <TenantList />
      </Provider>
    </BrowserRouter>
  );

  const allButton = screen.getByTestId("all");
  expect(allButton).toBeInTheDocument();
  fireEvent.click(allButton);
});

it("render the active, inactive and all buttons", () => {
  mockApi
    .onGet("/api/tenants?isDeleted=false&page=1")
    .reply(200, { data: [{ name: "Rohit" }], count: 1 });
  render(
    <BrowserRouter>
      <Provider store={store}>
        <TenantList />
      </Provider>
    </BrowserRouter>
  );

  const allButton = screen.getByTestId("active");
  expect(allButton).toBeInTheDocument();
  fireEvent.click(allButton);
});

it("render the active, inactive and all buttons", () => {
  mockApi
    .onGet("/api/tenants?isDeleted=true&page=1")
    .reply(200, { data: [{ name: "Rohit" }], count: 1 });
  render(
    <BrowserRouter>
      <Provider store={store}>
        <TenantList />
      </Provider>
    </BrowserRouter>
  );

  const allButton = screen.getByTestId("inactive");
  expect(allButton).toBeInTheDocument();
  fireEvent.click(allButton);
});
