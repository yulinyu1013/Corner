import React from 'react';
import renderer from 'react-test-renderer';
import TheirMessage from '../components/TheirMessage';
import user from '../images/user.png';

const message = {
  sender: {
    username: 'test',
    avatar: {user}
  },
  attachments: [],
  text: 'test',
}

const Theirmessage = {
  sender: {
    username: 'test',
    avatar: {user}
  },
  attachments: [],
  text: 'test',
}

const message2= {
  sender: {
    username: 'test2',
    avatar: {user}
  },
  attachments: [],
  text: '',
}

it('renders TheirMessage correctly when sending only text and same name', () => {
  const tree = renderer.create(<TheirMessage lastMessage={message}  message = {Theirmessage}/>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders TheirMessage correctly when sending with no text', () => {
  const tree = renderer.create(<TheirMessage lastMessage={message}  message = {message2}/>).toJSON();
  expect(tree).toMatchSnapshot();
});