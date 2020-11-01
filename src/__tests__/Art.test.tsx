import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test("render of art", () => {
  const app = render(<App />);
  const woodsArt = app.getByTestId("woods");
  expect(woodsArt).toBeInTheDocument();
});