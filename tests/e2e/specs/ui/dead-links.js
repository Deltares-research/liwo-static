describe("Dead links", () => {
  it("Has anchors with href attributes", () => {
    cy.visit("/");

    cy.get("a").each(($a) => {
      const message = $a.parent().parent().text();
      expect($a, message).to.have.attr("href");
      expect($a, message).to.not.have.attr("href", "");
    });
  });

  it("Links to existing links", () => {
    const pages = ["/", "/#/contact", "/#/accessibility", "/#/about"];
    const checkedHrefs = new Set();
    const results = []

    pages.forEach((page) => {
      cy.visit(page);

      cy.get("a").each(($a) => {
        const href = $a.prop("href");
        if (!checkedHrefs.has(href)) {
          checkedHrefs.add(href);
          cy.task('checkLink', { url: href }, { timeout: 60000 }).then((r) => results.push(r))
        }
      });

      cy.then(() => {
        const broken = results.filter((r) => r.error || r.status === 404)
        expect(broken, `broken links:\n${JSON.stringify(broken, null, 2)}`).to.be.empty
      })
    });
  });
});
