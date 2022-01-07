import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Navbar from './Navbar';
// import Registration from './Registration';
import GroupInfo from './GroupInfo';
import Feeds from './Feeds';
import MemberList from './MemberList';

// replace the LeftPart/MiddlePart/RightPart with your real component
function CornerPage() {
  console.log('here');
  const { userName, cornerId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  // const [currentCorner, setCurrentCorner] = useState({});

  useEffect(() => {
    console.log(userName);
    if (userName !== 'undefined') {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(sessionStorage.getItem('userInfo')));
      console.log(currentUser);
    } else {
      setIsLoggedIn(false);
      console.log(isLoggedIn);
    }
    // console.log(cornerId);
    // if (cornerId) {
    //   // get corner from backend
    //   getGroupInfo(cornerId).then((res) => {
    //     console.log(res.data);
    //     setCurrentCorner(res.data);
    //   });
    // }
  }, []);

  return (
    <div className="homepage-container">
      <div className="navbar">
        <Navbar
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
        />
      </div>
      <div className="main-page">
        <div className="left">
          <GroupInfo
            currentUser={currentUser}
          />
        </div>
        <div className="middle">
          <Feeds
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
          />
        </div>
        <div className="right">
          <MemberList
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            cornerId={cornerId}
          />
        </div>
      </div>
    </div>
  );
}

export default CornerPage;
