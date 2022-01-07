import React from 'react';
import '../styles/memberlist.css';
import 'antd/dist/antd.css';
import { FaRocketchat } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown, message } from 'antd';
import {
  MoreOutlined, UserOutlined, UserDeleteOutlined, UserAddOutlined, CrownOutlined,
} from '@ant-design/icons';

function Member({
  currentUser, user, deleteUser, setAdmin, revokeAdmin, isLoggedIn, isChat,
}) {
  const handleMenuClick = (e) => {
    console.log(currentUser);
    console.log(user);
    if (currentUser.id === user.id && user.level === 3) {
      message.info('You cannot operate on creator.');
      return;
    }
    if (currentUser.level >= user.level && currentUser.level > 1) {
      if (e.key === '1') {
        message.info('OK! The user has been deleted from the group');
        deleteUser(user.id);
      } else if (e.key === '2') {
        message.info('OK! set the user to be an admin');
        setAdmin(user.id);
      } else {
        message.info('OK! revoke the admin role of users');
        revokeAdmin(user.id);
      }
      console.log('click', e);
    } else {
      message.info('Sorry, you dont have such authorization!');
    }
  };

  const history = useHistory();

  const redirectToPrivateChat = () => {
    console.log(currentUser.name, user.name);
    history.push(`/pChat/${currentUser.name}/${user.name}`);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserDeleteOutlined />}>
        delete member
      </Menu.Item>
      <Menu.Item key="2" icon={<UserAddOutlined />}>
        set admin
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        revoke admin
      </Menu.Item>
    </Menu>
  );

  const titleDisplay = (duser) => {
    if (duser.level === 3) {
      return (
        <div>
          <span>
            {duser.name}
            &nbsp;
          </span>
          <CrownOutlined />
        </div>
      );
    }
    if (duser.level === 2) {
      return (
        <div>
          <span>
            {duser.name}
            &nbsp;
          </span>
          <UserOutlined />
        </div>
      );
    }
    return <span>{duser.name}</span>;
  };

  return (
    <div className="member">
      <div className="member-img-info">
        <div className="member-img-container">
          <img className="member-img" src={user.avatar} alt="img" />
        </div>
        <div className="member-info">
          <div className="member-name">
            {titleDisplay(user)}
          </div>
        </div>
      </div>
      <div>
        { !isChat && isLoggedIn && <FaRocketchat className="chat-icon" onClick={() => redirectToPrivateChat()} />}
      </div>
      <div>
        { user.id !== currentUser.id && !isChat
        && (
          <Dropdown.Button
            overlay={menu}
            icon={<MoreOutlined style={{ fontSize: '15px', color: 'black' }} />}
          />
        )}
      </div>
    </div>
  );
}

export default Member;
