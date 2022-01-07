import React from 'react';
import renderer from 'react-test-renderer';
import Navbar from '../components/Navbar';
import user from '../images/user.png';

const currentUser = {
  id: '1',
  name: 'test',
  avatar: {user},
}

it('renders Navbar correctly when user not loggedin', () => {
  const tree = renderer.create(<Navbar isLoggedIn={false} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Navbar correctly when user not loggedin', () => {
  const tree = renderer.create(<Navbar isLoggedIn={true} currentUser={currentUser} />).toJSON();
  expect(tree).toMatchSnapshot();
});
