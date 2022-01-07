import React from 'react';
import renderer from 'react-test-renderer';
import ChatBox from '../components/ChatBox';
// import user from '../images/user.png';

// const currentUser = {
//   id: 0,
//   bio: '',
//   name: 'dummy',
//   avatar: {user},
// }

// const chatUser = {
//   id: 1,
//   name: 'dummy2',
//   avatar: null,
//   bio: '',
// }

it('renders ChatBox correctly when corner is private', () => {
  const tree = renderer.create(<ChatBox isPrivate currentUser={'current'} chatUser={'chatuser'} cornerId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders ChatBox correctly when corner is public', () => {
  const tree = renderer.create(<ChatBox isPrivate={false} currentUser={"currentUser"} chatUser={"chatUser"} cornerId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});