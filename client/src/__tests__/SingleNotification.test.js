import React from 'react';
import renderer from 'react-test-renderer';
import SingleNotification from '../components/SingleNotification';
// import user from '../images/user.png';


it('renders SingleNotification correctly when notification is not read', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='request' isRead='0' relatedPost='1' sender='1' relatedCorner='1' approved='0' dismissed='0' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SingleNotification correctly when notification is read', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='request' isRead='1' relatedPost='1' sender='1' relatedCorner='1' approved='0' dismissed='0' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SingleNotification correctly when notification type is other', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='other' isRead='1' relatedPost='1' sender='1' relatedCorner='1' approved='0' dismissed='0' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SingleNotification correctly when notification type is other', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='other' isRead='1' relatedPost='1' sender='1' relatedCorner='1' approved='0' dismissed='0' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SingleNotification correctly when notification type is invitation', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='invitation' isRead='1' relatedPost='1' sender='1' relatedCorner='1' approved='0' dismissed='0' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SingleNotification correctly when notification type is invitation and approved', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='invitation' isRead='1' relatedPost='1' sender='1' relatedCorner='1' approved='1' dismissed='0' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SingleNotification correctly when notification type is invitation and rejected', () => {
  const tree = renderer.create(<SingleNotification notificationId='1' content='test' type='invitation' isRead='1' relatedPost='1' sender='1' relatedCorner='1' approved='0' dismissed='1' cornerName='test' userId='1' />).toJSON();
  expect(tree).toMatchSnapshot();
});



