import React from 'react';
import renderer from 'react-test-renderer';
import Comment from '../components/Comment';
import user from '../images/user.png';

const comment = [
  {
    id: 3,
    creator: 1,
    creatorName: 'Jhon',
    corner: 'test_corner',
    cornerName: 'test_corner',
    type: 'comment',
    pid: 1,
    text: 'first test comment',
    pic: [],
    audio: null,
    video: null,
    createdAt: '2021-08-16T23:00:33.010+02:00',
    updatedAt: '2021-08-16T23:00:33.010+02:00',
    isFlagged: 0,
    isHidden: 0,
  },
  {
    id: 4,
    creator: 1,
    creatorName: 'Jhon',
    corner: 'test_corner',
    cornerName: 'test_corner',
    type: 'comment',
    pid: 1,
    text: 'second test comment',
    pic: [],
    audio: null,
    video: null,
    createdAt: '2021-08-16T23:00:33.010+02:00',
    updatedAt: '2021-08-16T23:00:33.010+02:00',
    isFlagged: 0,
    isHidden: 0,
  },
];

const noComment = [];

it('renders Comment correctly when user loggedin and is admin', () => {
  const tree = renderer.create(<Comment comment={comment} pid='1' isLoggedIn avatar={user} cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Comment correctly when no comment', () => {
  const tree = renderer.create(<Comment comment={noComment} pid='1' isLoggedIn avatar={user} cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Comment correctly when no avatar', () => {
  const tree = renderer.create(<Comment comment={comment} pid='1' isLoggedIn cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Comment correctly when user not loggedin', () => {
  const tree = renderer.create(<Comment comment={comment} pid='1' isLoggedIn={false} cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Comment correctly when user is not creator', () => {
  const tree = renderer.create(<Comment comment={comment} pid='1' isLoggedIn={false} cornerid='1' userName='test' userId='5' />).toJSON();
  expect(tree).toMatchSnapshot();
});