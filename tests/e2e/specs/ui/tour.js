import { generateSelector as selector } from "../../lib/generate-selector";

describe("Tour", () => {
  it("starts and closes", () => {
    cy.visit("/");
    cy.get(selector("start-tour")).click();
    cy.get(".driver-popover").should("exist");
    cy.get(".driver-popover-next-btn").click();
    cy.get(".driver-popover").should("not.exist");
  });

  it("starts finishes generic tour and starts layers tour", () => {
    cy.visit("/");
    cy.get(selector("start-tour")).click();
    cy.get(".driver-popover").should("exist");
    cy.get(selector("Start algemene tour")).click();
    cy.get(".driver-popover-title").should(
      "contain",
      "Landelijk Informatiesysteem Water en Overstromingen"
    );

    for (let i = 0; i < 5; i++) {
      cy.get(".driver-popover-next-btn").click();
    }

    cy.get(".driver-popover-title").should("contain", "Kaartlagen");
    cy.get(".driver-popover-close-btn").click();

    cy.get(".driver-popover").should("not.exist");
  });

  it("opens a new page via the tour", () => {
    cy.visit("/");
    cy.get(selector("start-tour")).click();
    cy.get(".driver-popover").should("exist");
    cy.get(selector("Start expert tour")).click();
    cy.location().should(($loc) => {
      expect($loc.hash).to.equal(
        "#/combine/7/19435,19431?center=52.40661,5.40390&zoom=10"
      );
    });

    for (let i = 0; i < 6; i++) {
      cy.get(".driver-popover-next-btn").click();
    }

    cy.get(".driver-popover").should("not.exist");
  });
});
