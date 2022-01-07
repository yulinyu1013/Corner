import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Navbar from './Navbar';
import SignInOrRegister from './SignInOrRegister';
import Profile from './Profile';
// import GroupInfo from './GroupInfo';
import Feeds from './Feeds';
import CornerList from './CornerList';

// replace the LeftPart/MiddlePart/RightPart with your real component
function ExplorePage() {
  console.log('explore page');
  const { userName } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    console.log(userName);
    // if (userName) {
    //   setIsLoggedIn(true);
    //   setCurrentUser(JSON.parse(sessionStorage.getItem('userInfo')));
    //   console.log(currentUser);
    // } else {
    //   setIsLoggedIn(false);
    //   console.log(isLoggedIn);
    // }
    const u = JSON.parse(sessionStorage.getItem('userInfo'));
    if (u) {
      setCurrentUser(u);
      setIsLoggedIn(true);
    }
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
          {!isLoggedIn
            ? (
              <SignInOrRegister
                setIsLoggedIn={() => setIsLoggedIn(true)}
                setCurrentUser={setCurrentUser}
              />
            )
            : (
              <Profile
                setIsLoggedIn={setIsLoggedIn}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            )}
        </div>
        <div className="middle">
          <Feeds
            isExplored
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
          />
        </div>
        <div className="right">
          <CornerList
            isExplored
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
