export const usernameValidation = (username) => {
  if (!username.match(/^[0-9a-zA-Z]+$/)) {
    return 'Username must be alphanumeric.';
  }
  return '';
};

export const emailValidation = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    return 'Invalid email format.';
  }
  return '';
};

export const passwordValidation = (password) => {
  let message = '';
  if (password.length < 8 || password.length > 16) {
    message = 'Password must have a length between 8 and 16.';
  } else if (password.toLowerCase() === password) {
    message = 'Password must contain at least 1 upper case character.';
  }
  return message;
};

export const passwordConfirmValidation = (password, passwordComfirm) => {
  if (password !== passwordComfirm) {
    return 'The input does not match the password above.';
  }
  return '';
};

export const bioValidation = (bio) => {
  if (bio.length > 250) {
    return 'Bio cannot have a length greater than 250 characters';
  }
  return '';
};

export const isEmptyOrSpaces = (str) => str === null || (/^ *$/).test(str) || str === undefined;
