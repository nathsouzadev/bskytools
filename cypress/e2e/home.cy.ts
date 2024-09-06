describe('Home', () => {
  it('should visit home', () => {
    cy.visit('/');
    cy.contains('Threadsky');
  });
});
