describe('Avoza Shop & Flow', () => {
  it('Should load the homepage and view the featured products', () => {
    cy.visit('/');
    cy.contains('The Art of Minimalism').should('be.visible');
    cy.contains('Curated Categories').should('be.visible');
    cy.contains('Featured Additions').should('be.visible');
  });

  it('Should successfully navigate to Shop and find products', () => {
    cy.visit('/products');
    cy.contains('All Products').should('be.visible');
    
    // Test the category filter functionality instead of search bar
    cy.get('button').contains('Bags').click();
    cy.contains('Minimalist Leather Tote').should('be.visible');
  });

  it('Should login and add to cart', () => {
    // Note: Depends on backend seeder data running
    cy.visit('/login');
    cy.get('input[name="email"]').clear().type('admin@avoza.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button').contains('Sign In').click();

    // After login it should redirect to home or stay logged in
    cy.url().should('not.include', '/login');

    // Go to a product page and interact (add to cart)
    cy.visit('/products');
    cy.contains('Minimalist Leather Tote').click();
    
    cy.contains('Add to Cart').click();

    // Verify item is in cart
    cy.visit('/cart');
    cy.contains('Minimalist Leather Tote').should('be.visible');
    cy.contains('Proceed to Checkout').scrollIntoView().should('be.visible');
  });
});
