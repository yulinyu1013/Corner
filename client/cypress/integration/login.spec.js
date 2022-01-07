describe('login', () => {
  beforeEach(() => {
    cy.visit('https://corner202.herokuapp.com/');
  })

  it('log in successfully', () => {
    cy.get('.signIn_username').type('test1name');
    cy.get('.signIn_password').type('123456789A');
    cy.get('.signIn_button').click();
    cy.get('.getUserName').should('contain', 'test1name');
    cy.get('.getUserBios').should('contain', 'this is bio');
    cy.get('.createGroup').should('contain', 'Create Group');
    cy.get('.homeFeed').should('contain', 'Home Feed');
    cy.get('.explore').should('contain', 'Explore');
    cy.get('.settings').should('contain', 'Setting');
    cy.get('.userLogout').should('contain', 'Log out');
    cy.get('.userLogout').contains('Log out').click();
  })

  it('account logout due to 3 failed attempts in 5 min', () => {
    cy.get('.signIn_username').type('test16name');
    cy.get('.signIn_password').type('wrongpassword1');
    cy.get('.signIn_button').click();
    cy.get('.signIn_validation').should('contain', 'Invalid Username or Password.');
    cy.get('.signIn_password').clear();
    cy.get('.signIn_password').type('wrongpassword2');
    cy.get('.signIn_button').click();
    cy.get('.signIn_password').clear();
    cy.get('.signIn_password').type('wrongpassword3');
    cy.get('.signIn_button').click();
    cy.get('.signIn_validation').should('contain', '3 failed login attempts in 5 min. Please try 30 min later.');
    cy.get('.signIn_password').clear();
    cy.get('.signIn_password').type('123456789A');
    cy.get('.signIn_button').click();
    cy.get('.signIn_validation').should('contain', 'Account locked due to multiple failed login attempts. Please try again later.');
  })
})