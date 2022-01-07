import React, { useEffect, useState } from 'react';
import '../styles/Analytics.css';
import { useParams } from 'react-router';
import jm from '../sample_data/corner_imgs/jm.png';
import Navbar from './Navbar';
import EngagementAnalytics from './engagementAnalytics';
import PostAnalytics from './postAnalytics';
import MemberAnalytics from './memberAnalytics';
import { getGroupInfo } from '../fetchers/groupProfile';

const Analytics = () => {
  const { cornerId } = useParams();

  const dummyCorner = {
    id: cornerId,
    name: 'testName',
    type: 'Public',
    description: 'test description',
    tags: ['test tag1', 'test tag2'],
    avatar: jm,
  };

  const [corner, setCorner] = useState(dummyCorner);
  const [members, setMembers] = useState(0);
  const [posts, setPosts] = useState(0);
  const [engagements, setEngagements] = useState(0);

  // get corner info from backend
  useEffect(() => {
    getGroupInfo(cornerId).then((res) => {
      setCorner(res.data);
    });
  }, []);

  return (
    <div className="analytics-container">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="analytics-main">
        <div className="analytics-group-info">
          <img className="analytics-avatar" src={corner.avatar !== null ? corner.avatar : jm} alt="jm" />
          <div className="analyics-corner-info">
            <div className="analytics-corner-name">{corner.name}</div>
            <div className="analytics-corner-description">{corner.description}</div>
          </div>
        </div>
        <div className="analytics-overview">
          <div className="overview-title">Overview</div>
          <div className="overview-content">
            <div className="overview-member">
              <div className="member-stats">{members}</div>
              <div className="member-title">#Members</div>
            </div>
            <div className="overview-posts">
              <div className="post-stats">{posts}</div>
              <div className="post-title">#Posts</div>
            </div>
            <div className="overview-engagements">
              <div className="engagement-stats">{engagements}</div>
              <div className="engagement-title">#Engagements</div>
            </div>
          </div>
        </div>
        <div className="analytics-details">
          <div className="details-title">Details</div>
          <div className="details-content">
            <div className="details-member">
              <div className="details-member-title">Member Gain By Month</div>
              <div className="details-member-chart">
                <MemberAnalytics setMembers={setMembers} />
              </div>
            </div>
            <div className="details-posts">
              <div className="details-posts-title">Posts By Content Type</div>
              <div className="details-posts-chart">
                <PostAnalytics setPosts={setPosts} />
              </div>
            </div>
            <div className="details-engagements">
              <div className="details-engagements-title">Engagements By Type</div>
              <div className="details-engagements-chart">
                <EngagementAnalytics setEngagements={setEngagements} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
