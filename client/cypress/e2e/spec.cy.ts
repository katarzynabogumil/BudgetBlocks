describe("home page", () => {
  it("the h1 contains the correct text", () => {
    cy.visit('http://localhost:4200/');
    cy.get("h1").contains('BudgetBlocks');
  });
});