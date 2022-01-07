import React from 'react';
import renderer from 'react-test-renderer';
import MemberList from '../components/MemberList';

const user = {
  id: 0,
  name: 'dummy',
  avatar: null,
  level: -1,
}

it('renders MemberList correctly when user loggedin and currentUser not empty', () => {
  const tree = renderer.create(<MemberList isLoggedIn currentUser={user} cornerId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders MemberList correctly when user not and currentUser is empty', () => {
  const tree = renderer.create(<MemberList isLoggedIn={false} currentUser={user} cornerId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});
