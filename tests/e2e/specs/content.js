describe('Maps content', () => {
  it('Opens a blank map', () => {
    cy.visit('#/scenarios/6/19431')

    cy.get('.leaflet-control-layers')
      .click()
    cy.get('.leaflet-control-layers label:nth-child(5) > div > input')
      .click()

    cy.wait(8000)

    cy.get('.layerpanel-item--collapsed > .layerpanel-item__title > .layerpanel-item__collapse > .layerpanel-item__collapse-icon')
      .click()


    cy.get('#gebiedsindeling_doorbraaklocaties_buitendijks__LIWO_Basis_Doorbraaklocaties_Buitendijks .layer-control__vis-label')
      .click()

    cy.get('#gebiedsindeling_doorbraaklocaties_primair__LIWO_Basis_Doorbraaklocaties_Primair .layer-control__vis-label')
      .click()

    cy.get('#gebiedsindeling_doorbraaklocaties_regionaal__LIWO_Basis_Doorbraaklocaties_Regionaal .layer-control__vis-label')
      .click()

    cy.get('#gebiedsindeling_doorbraaklocaties_regionaalwatersysteem__LIWO_Basis_Doorbraaklocaties_RegionaalWatersysteem  .layer-control__vis-label')
      .click()

    cy.get('#infrastructuur_dijkringen__LIWO_Basis_Dijkringen .layer-control__vis-label')
      .click()


  })
})
