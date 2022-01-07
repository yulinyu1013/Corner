describe('register', () => {
  beforeEach(() => {
    cy.visit('https://corner202.herokuapp.com/');
    cy.get('.register_redirect_link').contains('Register').click();
  })

  it('username must be alphanumeric', () => {
    cy.get('.register-username').type('!!!');
    cy.get('.registration-validation').should('contain', 'Username must be alphanumeric.');
    cy.get('.register-username').clear();
  })

  it('email must be in the write format', () => {
    cy.get('.register-email').type('notemailaddress');
    cy.get('.registration-validation').should('contain', 'Invalid email format.');
    cy.get('.register-email').clear();
  })

  it('password must have a length between 8 and 16', () => {
    cy.get('.register-password').type('123456');
    cy.get('.registration-validation').should('contain', 'Password must have a length between 8 and 16.');
    cy.get('.register-password').clear();
  })

  it('password must contain 1 uppercase letter', () => {
    cy.get('.register-password').type('abc123456');
    cy.get('.registration-validation').should('contain', 'Password must contain at least 1 upper case character.');
    cy.get('.register-password').clear();
  })


  it('fails to register due to duplicated username ', () => {
    cy.get('.register-username').type('test1name');
    cy.get('.register-email').type('test1name@gmail.com');
    cy.get('.register-password').type('123456789A');
    cy.get('.register-password_comfirm').type('123456789A');
    cy.get('.register-button').contains('Register').click();
    cy.get('.registration-validation').should('contain', 'Username has already been used.');
  })

  it('register successfully', () => {
    cy.get('.register-username').type('cypress');
    cy.get('.register-email').type('cypresstest@gmail.com');
    cy.get('.register-password').type('123456789A');
    cy.get('.register-password_comfirm').type('123456789A');
    cy.get('.register-button').contains('Register').click();
    cy.get('.getUserName').should('contain', 'cypress');
    cy.get('.createGroup').should('contain', 'Create Group');
    cy.get('.homeFeed').should('contain', 'Home Feed');
    cy.get('.explore').should('contain', 'Explore');
    cy.get('.settings').should('contain', 'Setting');
    cy.get('.userLogout').should('contain', 'Log out');
    cy.get('.settings').contains('Setting').click();
    cy.get('.deleteUser').contains('Delete Account').click();
  })
})