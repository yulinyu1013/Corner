import React from 'react';
import renderer from 'react-test-renderer';
import SingleComment from '../components/SingleComment';

const comment =   {
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
}

it('renders SingleComment correctly', () => {
  const tree = renderer.create(<SingleComment singlecomment={comment} userId='5' />).toJSON();
  expect(tree).toMatchSnapshot();
});