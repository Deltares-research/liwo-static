import mockLayerSetData from '../mock/layerset.json'
import mockDoubleFeaturesData from '../mock/double-features.json'

// The url you want to test with.
const url = '/#/viewer/1?center=52,5&zoom=4'

// Describe the subject of your test(s)
describe('Version', () => {
  // Testing multiple things on the same page/url?
  // Use beforeEach to avoid repeating yourself.
  beforeEach(() => {
    // We intercept the requests, return some mock data and alias them.
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')

    // Visit the url
    cy.visit(url)

    // And wait for the requests to finish.
    cy.wait('@layerset', { timeout: 20000 })
    cy.wait('@features', { timeout: 20000 })
  })

  // Describe the behavior of your test(s)
  it('Renders correct version on', () => {
    // Intercepts the request you depent on. Replace it with some mock data.
    // This way we don't have to wait for the request to finish.
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')

    // Visit the page you want to test and wait for it to load
    cy.visit(url)

    // Before continuing with the test, wait for the intercepted
    // request, and give it some time to finish.
    cy.wait('@layerset', { timeout: 20000 })

    // Example: get a specific element.
    // In this case get the third one, because there are multiple elements with the same selector.
    // Click on it. (Use '.click({ force: true })' if it's hidden or covered by another element).
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    // Example: an element should contain a specific text.
    // You can use '.contain('.some-selector', 'text')' to target more specific elements.
    cy.contains('p', 'test')

    // Example: the url should contain a specific string.
    // The timeout is optional, could be useful if the request takes a long time.
    cy.url().should('contain', '?foo=bar', { timeout: 30000 })


    // Example: see if the element changes when clicking on it.
    // You can check attributes or it's text contents for any changes.
    // Here we test if a marker icon changes color (different image) when clicked. More
    // specifically, is the `src` attribute different after clicking on the element?
    // We then assume it's a different color.
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(3)
          .click({ force: true })
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })
  })
})
