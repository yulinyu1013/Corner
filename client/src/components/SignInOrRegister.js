import React, { useState } from 'react';
import '../styles/signIn.css';
import '../styles/registration.css';
import Cookies from 'js-cookie';
import { register, login } from '../fetchers/signInAndRegister';
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
  passwordConfirmValidation,
} from '../helpers/userInfoValidationHelper';

function SignInOrRegister({ setIsLoggedIn, setCurrentUser }) {
  const [signIn, setSignIn] = useState(true);
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInValidation, setSignInValidation] = useState('');

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');

  const [registerUsernameValidation, setRegisterUsernameValidation] = useState('');
  const [registerEmailValidation, setRegisterEmailValidation] = useState('');
  const [registerPasswordValidation, setRegisterPasswordValidation] = useState('');
  const [registerPasswordConfirmValidation, setRegisterPasswordConfirmValidation] = useState('');

  // lockout

  // redirect handlers
  const redirectToRegister = (e) => {
    e.preventDefault();
    setSignIn(false);
  };

  const redirectToSignIn = (e) => {
    e.preventDefault();
    setSignIn(true);
  };

  // sign in handlers
  const signInUsernameChangeHandler = (e) => {
    setSignInUsername(e.target.value);
  };

  const signInPasswordChangeHandler = (e) => {
    setSignInPassword(e.target.value);
  };

  // const history = useHistory();

  const signInHandler = async (e) => {
    e.preventDefault();
    // check if account is locked
    if (Cookies.get(signInUsername)) {
      setSignInValidation('Account locked due to multiple failed login attempts. Please try again later.');
      return;
    }
    const signInInfo = { name: signInUsername, password: signInPassword };
    login(signInInfo).then((res) => {
      const currentUser = res.data;
      console.log(currentUser);
      const tempStorage = {
        id: currentUser.id,
        name: currentUser.name,
        bio: currentUser.bio,
        avatar: currentUser.avatar,
      };
      sessionStorage.setItem('userInfo', JSON.stringify(tempStorage));
      // history.push(`/${currentUser.id}`);
      console.log(window.location.href);
      setCurrentUser(currentUser);
      setIsLoggedIn();
    }).catch((err) => {
      console.log(err);
      const currTime = Date.now();
      if (!sessionStorage.getItem(`${signInUsername}-loginAttempts`)) {
        sessionStorage.setItem(`${signInUsername}-loginAttempts`, JSON.stringify({ num: 1, first: currTime, last: currTime }));
        setSignInValidation('Invalid Username or Password.');
        return;
      }

      let attemptsInfo = JSON.parse(sessionStorage.getItem(`${signInUsername}-loginAttempts`));
      // if over 5 min since last attempt - treated as a new attempt
      if (currTime - attemptsInfo.first > 5 * 60 * 1000) {
        attemptsInfo = { num: 1, first: currTime, last: currTime };
      } else {
        // else - update attempts
        attemptsInfo = { num: attemptsInfo.num + 1, first: attemptsInfo.first, last: currTime };
      }
      sessionStorage.setItem(`${signInUsername}-loginAttempts`, JSON.stringify(attemptsInfo));

      if (attemptsInfo.num < 3) {
        setSignInValidation('Invalid Username or Password.');
      } else if (attemptsInfo.num === 3) {
        Cookies.set(signInUsername, 'failed', { expires: Date.now() + (30 * 60 * 1000) });
        setSignInValidation('3 failed login attempts in 5 min. Please try 30 min later.');
        sessionStorage.removeItem(`${signInUsername}-loginAttempts`);
      }
    });
  };

  // registration handlers
  const registerUsernameHandler = (e) => {
    setRegisterUsername(e.target.value);
    setRegisterUsernameValidation(usernameValidation(e.target.value));
  };

  const registerEmailHandler = (e) => {
    setRegisterEmail(e.target.value);
    setRegisterEmailValidation(emailValidation(e.target.value));
  };

  const registerPasswordHandler = (e) => {
    setRegisterPassword(e.target.value);
    setRegisterPasswordValidation(passwordValidation(e.target.value));
  };

  const registerPasswordConfirmHandler = (e) => {
    const { value } = e.target;
    setRegisterPasswordConfirm(value);
    setRegisterPasswordConfirmValidation(passwordConfirmValidation(registerPassword, value));
  };

  const registerHandler = async () => {
    const newUser = { name: registerUsername, email: registerEmail, password: registerPassword };
    if (registerUsernameValidation === ''
      && registerEmailValidation === ''
      && registerPasswordValidation === ''
      && registerPasswordConfirmValidation === '') {
      register(newUser).then((res) => {
        const currentUser = res.data;
        console.log(currentUser);
        const tempStorage = {
          id: currentUser.id,
          name: currentUser.name,
          bio: currentUser.bio,
          avatar: currentUser.avatar,
        };
        sessionStorage.setItem('userInfo', JSON.stringify(tempStorage));
        // history.push(`/${currentUser.id}`);
        setCurrentUser(currentUser);
        setIsLoggedIn();
      }).catch((err) => {
        if (err.message === 'Request failed with status code 409') {
          setRegisterUsernameValidation('Username has already been used.');
        }
      });
    }
  };

  return (
    <div className="signInOrRegisterContainer" data-testid="signIn">
      {signIn
        ? (
          <div className="signIn_container">
            <div className="signIn_welcome">
              Welcome
              <br />
              Back to
            </div>
            <div className="signIn_corner"> Corner. </div>
            <div className="signIn_welcomeMsg">
              Get relax &amp; get enlightened
              <br />
              with book📚, movie🎬, music🎵
              <br />
              and people.
            </div>
            <div className="signInMsg">Sign in your account below.</div>
            <div className="signIn_input">
              <input className="signIn_username" type="text" name="username" value={signInUsername} placeholder="Username" onChange={signInUsernameChangeHandler} />
              <input className="signIn_password" type="password" name="password" value={signInPassword} placeholder="Password" onChange={signInPasswordChangeHandler} />
            </div>
            <div className="signIn_validation" data-testid="test">{signInValidation}</div>
            <button className="signIn_button" type="submit" onClick={signInHandler} disabled={!signInUsername || !signInPassword}> Sign In </button>
            <div className="register_redirect_div">
              <div className="register_redirect">
                Don&apos;t an account? &nbsp;
                <a href="/" className="register_redirect_link" data-testid="to-register" onClick={redirectToRegister}>Register</a>
              </div>
            </div>
          </div>
        )
        : (
          <div className="registeration-container" data-testid="registration">
            <div className="register-welcome"> Welcome to </div>
            <div className="register-corner"> Corner. </div>
            <div className="register-welcomeMsg">
              A cozy space to
              <br />
              relax &amp; get enlightened
              <br />
              with book📚, movie🎬, music🎵
              <br />
              and people.
            </div>
            <div className="registerMsg">Create your account below.</div>
            <div className="register-input">
              <div className="registration-validation">{registerUsernameValidation}</div>
              <input className="register-username" type="text" name="username" placeholder="Username" value={registerUsername} onChange={registerUsernameHandler} />
              <div className="registration-validation">{registerEmailValidation}</div>
              <input className="register-email" type="email" name="email" placeholder="Email" value={registerEmail} onChange={registerEmailHandler} />
              <div className="registration-validation">{registerPasswordValidation}</div>
              <input className="register-password" type="password" name="password" placeholder="Password" value={registerPassword} onChange={registerPasswordHandler} />
              <div className="registration-validation">{registerPasswordConfirmValidation}</div>
              <input className="register-password_comfirm" type="password" name="password_comfirm" placeholder="Comfirm Password" value={registerPasswordConfirm} onChange={registerPasswordConfirmHandler} />
            </div>
            <button className="register-button" type="submit" onClick={registerHandler} disabled={!registerUsername || !registerEmail || !registerPassword || !registerPasswordConfirm}> Register </button>
            <div className="sign_in_redirect">
              Already have an account?&nbsp;
              <a href="/" className="sign_in_redirect_button" data-testid="to-signIn" onClick={redirectToSignIn}>Sign In</a>
            </div>
          </div>
        )}
    </div>
  );
}

export default SignInOrRegister;
