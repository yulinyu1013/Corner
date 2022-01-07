import React from 'react';
import renderer from 'react-test-renderer';
import Profile from '../components/Profile';
import user from '../images/user.png';

const currentUser = {
  id: '0',
  bio: '',
  name: 'dummy',
  avatar: {user},
}

const currentUserNoavatar = {
  id: '0',
  bio: '',
  name: 'dummy',
  avatar: null,
}

it('renders Profile correctly when user is in chat', () => {
  const tree = renderer.create(<Profile currentUser={currentUser} isInChat />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Profile correctly when user is in not chat', () => {
  const tree = renderer.create(<Profile currentUser={currentUser} isInChat={false} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Profile correctly when user has no avatar', () => {
  const tree = renderer.create(<Profile currentUser={currentUserNoavatar} isInChat={false} />).toJSON();
  expect(tree).toMatchSnapshot();
});