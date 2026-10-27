/**
 * @note This should be two real variants.
 * Since the live data can be changed and ids could change
 * we need to update this when live data changes so tests keep working
 * The first two variants should be
 * cy.get('.leaflet-marker-icon').eq(1) and cy.get('.leaflet-marker-icon').eq(2)
 */
export const testVariants = [
  {
    id: 115825,
    name: "Onbeschermd_Maas",
    variantName: "Onbeschermd gebied Maas 1:10000",
    breachId: 2233
  },
  {
    id: 115778,
    name: "Hedwige",
    variantName: "Hedwigepolder_T100000_GISanalyse",
    breachId: 1977
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
