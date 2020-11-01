import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../App';

test("render pagetitle", () => {
  const app = render(<App />);
  const pageheader = app.getByText("Prosjekt 2");
  expect(pageheader).toBeInTheDocument();
});

test("render of themebutton", () => {
  const app = render(<App />);
  const winterButton = app.getByTestId("winter");
  expect(winterButton).toBeInTheDocument();

  fireEvent.mouseEnter(winterButton);
});