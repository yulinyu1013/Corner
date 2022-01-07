import React from 'react';
import renderer from 'react-test-renderer';
import Member from '../components/Member';

const userLevel1 = {
  id: 0,
  name: 'dummy',
  avatar: null,
  level: 1,
}

const currentUserLevel3 = {
  id: 1,
  name: 'dummy',
  avatar: null,
  level: 3,
}

const currentUserLevel1 = {
  id: 2,
  name: 'dummy',
  avatar: null,
  level: 3,
}

const userLevel2 = {
  id: 3,
  name: 'dummy',
  avatar: null,
  level: 1,
}

const currentUserLevelsame = {
  id: 4,
  name: 'dummy',
  avatar: null,
  level: 3,
}

const userLevelsame = {
  id: 4,
  name: 'dummy',
  avatar: null,
  level: 3,
}

it('renders Member correctly when user is admin', () => {
  const tree = renderer.create(<Member currentUser={currentUserLevel3} user={userLevel1} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Member correctly when user is normal user', () => {
  const tree = renderer.create(<Member currentUser={currentUserLevel1} user={userLevel2} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Member correctly when user is the currentuser', () => {
  const tree = renderer.create(<Member currentUser={currentUserLevelsame} user={userLevelsame} />).toJSON();
  expect(tree).toMatchSnapshot();
});
