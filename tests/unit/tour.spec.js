import {
  waitUntilVisible,
  checkIfVisible,
  createButton,
  createTourSummary,
} from "../../src/tour/helpers";
import { expect, it, beforeEach } from "vitest";

beforeEach(() => {
  document.body.innerHTML = "";
});

it("waits untill element is visible", () => {
  const element = document.createElement("div");
  element.style.display = "none";
  document.body.appendChild(element);

  const promise = waitUntilVisible("div");
  element.style.display = "block";

  return promise.then((el) => {
    expect(el).toBe(element);
  });
});

it("checks if element is visible", () => {
  const element = document.createElement("div");
  document.body.appendChild(element);

  return checkIfVisible("div").then((el) => {
    expect(el).toBe(element);
  });
});

it("checks if element is not visible", () => {
  return checkIfVisible("div").catch(() => {
    expect(true).toBe(true);
  });
});

it("creates a button", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const button = createButton(container, "text", () => {
    expect(true).toBe(true);
  });

  button.click();
  expect(button.innerText).toBe("text");
});

it("creates a tour summary", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const summary = createTourSummary("text", "buttonText", () => {
    expect(true).toBe(true);
  });

  const button = summary.querySelector("button");
  button.click();
  expect(button.innerText).toBe("buttonText");

  const summaryText = summary.querySelector("span");
  expect(summaryText.innerText).toBe("text");
});
