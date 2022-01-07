import React from 'react';
import renderer from 'react-test-renderer';
import MyMessage from '../components/MyMessage';
import user from '../images/user.png';

const message = {
  sender: {
    username: 'test',
    avatar: {user}
  },
  attachments: [],
  text: 'test',
}

const messagenotext = {
  sender: {
    username: 'test',
    avatar: {user}
  },
  attachments: [],
  text: '',
}

it('renders TheirMessage correctly when sending only text', () => {
  const tree = renderer.create(<MyMessage message = {message}/>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders TheirMessage correctly when sending only text', () => {
  const tree = renderer.create(<MyMessage message = {messagenotext}/>).toJSON();
  expect(tree).toMatchSnapshot();
});