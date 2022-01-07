import React from 'react';
import renderer from 'react-test-renderer';
import InputBox from '../components/InputBox';
import user from '../images/user.png';

it('renders Inputbox correctly when having text in box', () => {
  const tree = renderer.create(<InputBox newPost='test post' cornerid='1' userName='test' userId='1' avatar={user}/>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Inputbox correctly when no text in box', () => {
  const tree = renderer.create(<InputBox newPost='' cornerid='1' userName='test' userId='1' avatar={user}/>).toJSON();
  expect(tree).toMatchSnapshot();
});