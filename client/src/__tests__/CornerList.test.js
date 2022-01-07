import React from 'react';
import renderer from 'react-test-renderer';
import CornerList from '../components/CornerList';
import user from '../images/user.png';

const currentUser = {
  id: '1',
  name: 'test',
  avatar: {user},
  bio: '',
}

it('renders CornerList correctly when user not loggedin', () => {
  const tree = renderer.create(<CornerList isLoggedIn={false} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders CornerList correctly when user loggedin', () => {
  const tree = renderer.create(<CornerList isLoggedIn currentUser={currentUser} />).toJSON();
  expect(tree).toMatchSnapshot();
});
