import React from 'react';
import renderer from 'react-test-renderer';
import Feed from '../components/Feed';
import user from '../images/user.png';

const post = {
  id: 1,
  creator: 1,
  creatorName: 'Jack',
  corner: 'test_corner',
  cornerName: 'test_corner',
  type: 'post',
  pid: null,
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed doloribus natus, nulla voluptates voluptate vitae amet qui consequuntur repellat repellendus sint! Non voluptas doloremque tempore ex perferendis labore illo totam.',
  pic: [{ user }],
  audio: null,
  video: null,
  createdAt: '2021-08-16T23:00:33.010+02:00',
  updatedAt: '2021-08-16T23:00:33.010+02:00',
  isFlagged: 1,
  isHidden: 0,
};

const Alldata = [
  {
    id: 1,
    creator: 1,
    creatorName: 'Jack',
    corner: 'test_corner',
    cornerName: 'test_corner',
    type: 'post',
    pid: null,
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed doloribus natus, nulla voluptates voluptate vitae amet qui consequuntur repellat repellendus sint! Non voluptas doloremque tempore ex perferendis labore illo totam.',
    pic: [{ user }],
    audio: null,
    video: null,
    createdAt: '2021-08-16T23:00:33.010+02:00',
    updatedAt: '2021-08-16T23:00:33.010+02:00',
    isFlagged: 1,
    isHidden: 0,
  },
  {
    id: 2,
    creator: 1,
    creatorName: 'Amy',
    corner: 'test_corner',
    cornerName: 'test_corner',
    type: 'post',
    pid: null,
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed doloribus natus, nulla voluptates voluptate vitae amet qui consequuntur repellat repellendus sint! Non voluptas doloremque tempore ex perferendis labore illo totam.',
    pic: [{ user }, { user }, { user }, { user }, { user }],
    audio: null,
    video: null,
    createdAt: '2021-08-16T23:00:33.010+02:00',
    updatedAt: '2021-08-16T23:00:33.010+02:00',
    isFlagged: 0,
    isHidden: 1,
  },
];

const noComment = [];
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
]

it('renders Feed correctly when user loggedin and is admin', () => {
  const tree = renderer.create(<Feed post={post} comments={noComment} allPosts={Alldata} isLoggedIn avatar={user} isAdmin cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Feed correctly when user not loggedin and is admin', () => {
  const tree = renderer.create(<Feed post={post} comments={noComment} allPosts={Alldata} isLoggedIn={false} avatar={user} isAdmin cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Feed correctly when user not loggedin and is not admin', () => {
  const tree = renderer.create(<Feed post={post} comments={noComment} allPosts={Alldata} isLoggedIn={false} avatar={user} isAdmin={false} cornerid='1' userName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Feed correctly when user loggedin and admin and has comment', () => {
  const tree = renderer.create(<Feed post={post} comments={noComment} allPosts={Alldata} isLoggedIn={false} avatar={user} isAdmin={false} cornerid='1' userName='test' userId='1' comments={comment} />).toJSON();
  expect(tree).toMatchSnapshot();
});