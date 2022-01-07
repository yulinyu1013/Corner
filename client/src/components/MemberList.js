import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import '../styles/memberlist.css';
import 'antd/dist/antd.css';
import { FaSearch } from 'react-icons/fa';
import {
  getMemberList,
  getCurrentUserLevel,
  setRoleInCorner,
  removeUserFromCorner,
} from '../fetchers/userApis';
import Member from './Member';

function MemberList({
  isLoggedIn,
  currentUser,
  cornerId,
  isChat,
}) {
  const [memberList, setMemberList] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserLevel, setCurrentUserLevel] = useState({
    id: 0,
    name: currentUser.name,
    avatar: null,
    level: -1,
  });

  useEffect(() => {
    console.log(isLoggedIn);
    // if loggedIn, fetch current user's level in the corner and etc.
    if (isLoggedIn) {
      // currentUser.id = 'test1';
      console.log('-------');
      console.log(currentUser.id);
      getCurrentUserLevel(currentUser.id, cornerId).then((res) => {
        console.log('-------');
        console.log(res);
        setCurrentUserLevel(res);
      });
    }
    // fetch the current memberlist
    getMemberList(cornerId).then((res) => {
      setMemberList(res);
      console.log(res);
    });
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    if (searchTerm !== '') {
      const lowSearchTerm = searchTerm.toLowerCase();
      const filteredData = [...memberList].filter(
        (val) => val.name.toLowerCase().includes(lowSearchTerm),
      );
      setMemberList(filteredData);
    } else {
      // fetch the current memberlist
      getMemberList(cornerId).then((res) => {
        setMemberList(res);
      });
    }
  }, [searchTerm, isLoggedIn]);

  const deleteUser = (id) => {
    if (currentUserLevel.level === 1) {
      message.info('Sorry! You are not authorized to delete a user');
      return;
    }
    if (id === currentUser.id) {
      message.info('Sorry! You cannot delete yosurself');
      return;
    }
    const filteredData = [...memberList].filter(
      (val) => val.id !== id,
    );
    const newList = filteredData.sort((m1, m2) => (m2.level - m1.level));
    setMemberList(newList);
    removeUserFromCorner(cornerId, id);
  };

  const setAdmin = (id) => {
    // console.log(currentUser);
    if (currentUserLevel.level === 1) {
      message.info('Sorry! You are not authorized to set an admin role');
      return;
    }
    const newAdmin = [...memberList].filter(
      (val) => val.id === id,
    );
    const temp = [...memberList].filter(
      (val) => val.id !== id,
    );
    newAdmin[0].level = 2;
    const newList = temp.concat(newAdmin).sort((m1, m2) => (m2.level - m1.level));
    setMemberList(newList);
    setRoleInCorner(id, cornerId, 2);
  };

  const revokeAdmin = (id) => {
    if (currentUserLevel.level === 1) {
      message.info('Sorry! You are not authorized to revoke an admin role');
      return;
    }
    const newAdmin = [...memberList].filter(
      (val) => val.id === id,
    );
    const temp = [...memberList].filter(
      (val) => val.id !== id,
    );
    newAdmin[0].level = 1;
    const newList = temp.concat(newAdmin).sort((m1, m2) => (m2.level - m1.level));
    setMemberList(newList);
    setRoleInCorner(id, cornerId, 1);
  };

  return (
    <div className="member-list-outer">
      {memberList && (
        <div className="member-list-wrapper">
          <div className="member-header">
            <span>Members</span>
          </div>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Search member..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div className="list-container">
            {memberList.map((user) => (
              <Member
                currentUser={currentUserLevel}
                user={user}
                deleteUser={deleteUser}
                setAdmin={setAdmin}
                revokeAdmin={revokeAdmin}
                isLoggedIn={isLoggedIn}
                isChat={isChat}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberList;
