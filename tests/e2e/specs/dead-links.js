describe('Dead links', () => {
  it('Has anchors with href attributes', () => {
    cy.visit('/')

    cy.get('a').each($a => {
      const message = $a.parent().parent().text()
      expect($a, message).to.have.attr('href')
      expect($a, message).to.not.have.attr('href', '')
    })
  })

  it('Links to existing links', () => {
    const pages = ['/', '#/contact', '#/accessibility', '#/about']

    pages.forEach(page => {
      cy.visit(page)

      cy.get('a').each($a => {
        const href = $a.prop('href')

        cy.request(href)
          .should((response) => {
            expect(response.status).to.eq(200)
          })
      })
    })
  })
})
