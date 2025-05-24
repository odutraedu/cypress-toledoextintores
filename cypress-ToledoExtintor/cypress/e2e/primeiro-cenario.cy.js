describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://google.com')

    cy.get('textarea[name="q"]').type('Cypress {enter}')
     
  })
})