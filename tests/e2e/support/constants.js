/**
 * @note This should be two real variants.
 * Since the live data can be changed and ids could change
 * we need to update this when live data changes so tests keep working
 * These variants should be
 * cy.get('.leaflet-marker-icon').eq(1), cy.get('.leaflet-marker-icon').eq(2),
 * cy.get('.leaflet-marker-icon').eq(3) and cy.get('.leaflet-marker-icon').eq(4)
 */
export const testVariants = [
  {
    id: 115917,
    name: "Waddenzee",
    variantName: "Buitendijkse gebieden Waddenzee en Waddeneilanden 1:10.000",
    breachId: 3105
  },
  {
    id: 20936,
    name: "Meren",
    variantName: "Buitendijkse gebieden Meren 1:10.000",
    breachId: 2142
  },
  {
    id: 20941,
    name: "Hollandse kust",
    variantName: "Buitendijkse gebieden Hollandse Kust 1:10.000",
    breachId: 1998
  },
  {
    id: 111235,
    name: "Rijn-Maasmonding",
    variantName: "Buitendijkse gebieden Rijn-Maasmonding 1:10000",
    breachId: 2614
  },
];

export const variantIds = testVariants.map(variant => variant.id)
