import React from 'react';
import renderer from 'react-test-renderer';
import MessageForm from '../components/MessageForm';

it('renders MessageForm correctly', () => {
  const tree = renderer.create(<MessageForm userName={'testname'}/>).toJSON();
  expect(tree).toMatchSnapshot();
});