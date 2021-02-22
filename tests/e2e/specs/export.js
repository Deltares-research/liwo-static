describe('Exporting', () => {
  it('Allows to export maps', () => {
    cy.visit('#/viewer/1')

    cy.intercept('DownloadZipFileDataLayers')
      .as('apiCheck')


    cy.get('.layer-panel footer > button')
      .click()
    cy.get('#export-name')
      .type('filename')
    cy.get('.pop-up.export-popup footer > button.btn.primary')
      .click()

    // This does not work yet....
    // cy.wait('@apiCheck').then((interception) => {
    //   assert.isNotNull(interception.response.body, '1st API call has data')
    // })

  })
})
