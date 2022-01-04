const pages = ['/', '#/contact', '#/accessibility', '#/about']

describe('Images', () => {
  it('Has images with alt attributes', () => {
    pages.forEach(page => {
      cy.visit(page)

      cy.get('img').each($a => {
        expect($a).to.have.attr('alt')
      })
    })
  })

  // TODO: enable when images are working again
  it.skip("Contains images with valid url's", () => {
    pages.forEach(page => {
      cy.visit(page)

      cy.get('img').each($a => {
        const src = $a.prop('src')

        cy.request(src)
          .should((response) => {
            expect(response.status).to.eq(200)
          })
      })
    })
  })
})
