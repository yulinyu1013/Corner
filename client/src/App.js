import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import CornerPage from './components/CornerPage';
import ChatPagePrivate from './components/ChatPagePrivate';
import ChatPageGroup from './components/ChatPageGroup';
import NotificationPage from './components/NotificationPage';
import PostDetial from './components/PostDetial';
import Analytics from './components/Analytics';
import ExplorePage from './components/ExplorePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Homepage} />
        {/* <Route exact path="/pChat" component={ChatPage} /> */}
        <Route path="/corner/:userName/:cornerName/:cornerId" exact component={CornerPage} />
        <Route exact path="/pChat/:userName/:chatUser" component={ChatPagePrivate} />
        <Route exact path="/gChat/:cornerId/:userName" component={ChatPageGroup} />
        <Route path="/analytics/:cornerId" exact component={Analytics} />
        <Route path="/notification/:userId" exact component={NotificationPage} />
        <Route path="/postdetail/:cornerid/:postid/:userid" exact component={PostDetial} />
        <Route path="/explore" exact component={ExplorePage} />
      </div>
    </Router>
  );
}

export default App;
