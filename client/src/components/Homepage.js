import React, { useEffect, useState } from 'react';
import '../styles/homepage.css';
import Navbar from './Navbar';
import SignInOrRegister from './SignInOrRegister';
import Profile from './Profile';
import CornerList from './CornerList';
import Feeds from './Feeds';

// replace the LeftPart/MiddlePart/RightPart with your real component
function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  // const [isExplored, setIsExplored] = useState(false);

  useEffect(() => {
    console.log('home');
    const u = sessionStorage.getItem('userInfo');
    if (u) {
      setCurrentUser(JSON.parse(sessionStorage.getItem('userInfo')));
      setIsLoggedIn(true);
    }
  }, []);

  console.log(isLoggedIn);

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
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            isExplored={false}
          />
        </div>
        <div className="right">
          <CornerList
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            isExplored={false}
          />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
