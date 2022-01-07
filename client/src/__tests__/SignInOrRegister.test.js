import React from 'react';
import SignInOrRegister from '../components/SignInOrRegister';
import renderer from 'react-test-renderer';
import {act, render, fireEvent, cleanup, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const fetcherHelpers = require('../fetchers/signInAndRegister');
jest.mock('../fetchers/signInAndRegister');


describe('UI', () => {
  it('sign in page', () => {
    render(<SignInOrRegister />);
    const linkElement = screen.getByTestId('signIn');
    expect(linkElement).toBeInTheDocument();
  });

  it('redirect to register page', () => {
    render(<SignInOrRegister />);
    const RegisterButton = screen.getByTestId('to-register');
    fireEvent.click(RegisterButton);
    const register = screen.getByTestId('registration');
    expect(register).toBeInTheDocument();
  });

  it('back to the sign in page', () => {
    render(<SignInOrRegister />);
    const RegisterButton = screen.getByTestId('to-register');
    fireEvent.click(RegisterButton);
    const signInButton = screen.getByTestId('to-signIn');
    fireEvent.click(signInButton);
    const signInAgain = screen.getByTestId('signIn');
    expect(signInAgain).toBeInTheDocument();
  });


})

describe('SignIn', () => {

  afterEach(cleanup);

  it('enter username', () => {
    render(<SignInOrRegister />);
    userEvent.type(screen.getByPlaceholderText('Username'), 'testUsername');
    expect(screen.getByPlaceholderText('Username')).toHaveValue('testUsername')
  })

  it('enter password', () => {
    render(<SignInOrRegister />);
    userEvent.type(screen.getByPlaceholderText('Password'), 'testPassword');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('testPassword');
  })

  it('sign in successfully', async () => {
    const mockUser = {
      name: 'testUsername', 
      bio: 'test bio', 
      email: 'test@gmail.com', 
      password: 'testPassword', avatar: null,
    }
    jest.spyOn(fetcherHelpers, 'login').mockResolvedValue({ data: mockUser });
   
    const setCurrentUser = jest.fn();
    const setIsLoggedIn = jest.fn();
    const setSignInValidation = jest.fn();
    render(<SignInOrRegister setCurrentUser={setCurrentUser} setIsLoggedIn={setIsLoggedIn} setSignInValidation={setSignInValidation}/>);
    userEvent.type(screen.getByPlaceholderText('Username'), 'testUsername');
    userEvent.type(screen.getByPlaceholderText('Password'), 'testPassword');
    act(() => {
      fireEvent.click(screen.getByText('Sign In'));
    })
    await waitFor(() => expect(setCurrentUser).toHaveBeenCalled());
    await waitFor(() => expect(setIsLoggedIn).toHaveBeenCalled());
    await waitFor(() => expect(setSignInValidation).not.toHaveBeenCalled());

  })

  it('sign in unsuccessfully', async () => {
  
    jest.spyOn(fetcherHelpers, 'login').mockRejectedValue('log in failed');
    
    const setCurrentUser = jest.fn();
    const setIsLoggedIn = jest.fn();
    const setSignInValidation = jest.fn();
    render(<SignInOrRegister setCurrentUser={setCurrentUser} setIsLoggedIn={setIsLoggedIn} setSignInValidation={setSignInValidation}/>);
    userEvent.type(screen.getByPlaceholderText('Username'), 'wrongUsername');
    userEvent.type(screen.getByPlaceholderText('Password'), 'wrongPassword');
    act(() => {
      fireEvent.click(screen.getByText('Sign In'));
    })
    
    await waitFor(() => expect(screen.getByText('Invalid Username or Password.')).toBeInTheDocument); 
  })

})

describe('Register', () => {
  afterEach(cleanup);

  it('enter username', () => {
    render(<SignInOrRegister />);
    fireEvent.click(screen.getByTestId('to-register'));
    userEvent.type(screen.getByPlaceholderText('Username'), 'testUsername');
    expect(screen.getByPlaceholderText('Username')).toHaveValue('testUsername')
  })

  it('enter email', () => {
    render(<SignInOrRegister />);
    fireEvent.click(screen.getByTestId('to-register'));
    userEvent.type(screen.getByPlaceholderText('Email'), 'test@gmail.com');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@gmail.com');
  })

  it('enter password', () => {
    render(<SignInOrRegister />);
    fireEvent.click(screen.getByTestId('to-register'));
    userEvent.type(screen.getByPlaceholderText('Password'), 'testPassword');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('testPassword');
  })

  it('enter password confirm', () => {
    render(<SignInOrRegister />);
    fireEvent.click(screen.getByTestId('to-register'));
    userEvent.type(screen.getByPlaceholderText('Comfirm Password'), 'testPassword');
    expect(screen.getByPlaceholderText('Comfirm Password')).toHaveValue('testPassword');
  })

  it('register successfully', async () => {
    const mockNewUser = {
      name: 'testUsername',
      email: 'test@gmail.com',
      password: 'testPassword'
    }
    jest.spyOn(fetcherHelpers, 'register').mockResolvedValue({ data: mockNewUser });
    
    act(() => {
      render(<SignInOrRegister setSignIn={jest.fn()}/>);
    })
    fireEvent.click(screen.getByTestId('to-register'));
    userEvent.type(screen.getByPlaceholderText('Username'), 'testUsername');
    userEvent.type(screen.getByPlaceholderText('Email'), 'test@gmail.com');
    userEvent.type(screen.getByPlaceholderText('Password'), 'testPassword');
    userEvent.type(screen.getByPlaceholderText('Comfirm Password'), 'testPassword');
    act(() => {
      fireEvent.click(screen.getByText('Register'));
    })
    const linkElement = screen.getByTestId('signIn');
    expect(linkElement).toBeInTheDocument();

  })
})

it('renders SignInOrRegister correctly', () => {
  const tree = renderer.create(<SignInOrRegister />).toJSON();
  expect(tree).toMatchSnapshot();
});
