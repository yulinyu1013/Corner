import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import '../styles/cornerlist.css';
import { FaSearch, FaSortAmountDown, FaRocketchat } from 'react-icons/fa';
import groupListApis from '../fetchers/groupListApis';
import dummy from '../images/logo.png';

function CornerList({ isExplored, isLoggedIn, currentUser }) {
  const [cornerlist, setCornerlist] = useState([]);
  const [allCorners, setAllCorners] = useState([]);
  const [sortby, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  // const [localLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && !isExplored) {
      groupListApis.fetchUserGroups(currentUser.id).then((res) => {
        console.log('my corner', isLoggedIn);
        console.log(res);
        setCornerlist(res);
        // console.log(cornerlist);
        setAllCorners(res);
        // setTimeout(() => {}, 1000);
      });
    } else {
      groupListApis.fetchAllPublicGroups().then((res) => {
        console.log('popular corner', isLoggedIn);
        console.log(res);
        setCornerlist(res);
        setAllCorners(res);
        // setTimeout(() => {}, 1000);
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (searchTerm !== '') {
      const lowSearchTerm = searchTerm.toLowerCase();
      const filteredData = [];
      allCorners.forEach((corner) => {
        corner.tag = corner.tag.map((a) => a.toLowerCase());
        if (corner.tag.includes(lowSearchTerm)) {
          filteredData.push(corner);
          console.log(corner.name);
        }
      });
      setCornerlist(filteredData);
    } else {
      if (isLoggedIn && !isExplored) {
        groupListApis.fetchUserGroups(currentUser.id).then((res) => {
          console.log('my corner2', isLoggedIn);
          console.log(res);
          setCornerlist(res);
          // console.log(cornerlist);
          // setAllCorners(res);
          // setTimeout(() => {}, 1000);
        });
      } else {
        groupListApis.fetchAllPublicGroups().then((res) => {
          console.log('popular corner2', isLoggedIn);
          console.log(res);
          setCornerlist(res);
          // setAllCorners(res);
          // setTimeout(() => {}, 1000);
        });
      }
      setSortBy('default');
    }
  }, [searchTerm, isLoggedIn]);

  const options = [
    // { value: 'message', label: 'message' },
    { value: 'member', label: 'member' },
    { value: 'post', label: 'posts' },
  ];

  const history = useHistory();

  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'black' : 'grey',
    }),
    control: (base) => ({
      ...base,
      fontFamily: 'Montserrat',
      textAlign: 'start',
      height: 35,
      minHeight: 35,
      width: 170,
      '&:hover': {
        borderColor: 'lightgray',
        boxShadow: '0 0 10px grey',
      }, // border style on hover
      '&:focus': {
        borderColor: 'grey',
      },
      border: '1px solid lightgray', // default border color
    }),
    menu: (base) => ({
      ...base,
      fontFamily: 'Montserrat',
    }),
  };

  /**
   * handle the change on select component
   * @param {} selectedOption
   */
  const handleChange = (selectedOption) => {
    let newCorners = [];
    // if (selectedOption.value === 'message') {
    //   newCorners = [...cornerlist].sort((c1, c2) => {
    //     if (c1.msg === null) {
    //       return 1;
    //     }
    //     if (c2.msg === null) {
    //       return -1;
    //     }
    //     return c2.msg - c1.msg;
    //   });
    //   console.log(newCorners);
    // } else
    if (selectedOption.value === 'member') {
      newCorners = [...cornerlist].sort((c1, c2) => (c2.mems - c1.mems));
    } else {
      newCorners = [...cornerlist].sort((c1, c2) => (c2.posts - c1.posts));
    }
    console.log(selectedOption);
    setCornerlist(newCorners);
    setSortBy(selectedOption.value);
    console.log(newCorners);
    console.log(cornerlist);
  };

  const redirectToCornerPage = (id, name) => {
    history.push(`/corner/${currentUser.name}/${name}/${id}`);
  };

  const redirectToGroupChat = (groupId) => {
    history.push(`/gChat/${groupId}/${currentUser.name}`);
  };

  return (
    <div className="corner-list-wrapper">
      <div className="corner-header">
        <span>{isLoggedIn && !isExplored ? 'My Corner' : 'Popular Corner'}</span>
      </div>
      <div className="sort-search">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            className="input-field"
            type="text"
            placeholder="Search by Tags..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="sort-bar">
          <FaSortAmountDown className="sort-icon" />
          <Select
            value={sortby}
            options={options}
            onChange={handleChange}
            styles={selectStyles}
            placeholder={sortby}
          />
        </div>
      </div>
      <div className="list-container">
        {cornerlist.map(({
          id, name, avatar, posts, mems,
        }) => (
          <div className="singlecorner">
            <div key={id} className="corner" onClick={() => redirectToCornerPage(id, name)} role="presentation">
              <div className="corner-img-container">
                <img className="corner-img" src={avatar || dummy} alt="img" />
              </div>
              <div className="corner-info">
                <div className="corner-name">
                  {name}
                </div>
                <div className="corner-data">
                  {posts}
                  <span>&nbsp;posts|&nbsp;</span>
                  {mems}
                  <span>&nbsp;mems</span>
                </div>
              </div>
            </div>
            <div className="chat-icon" onClick={() => redirectToGroupChat(id, currentUser.name)} role="presentation">
              {(isLoggedIn && !isExplored) && <FaRocketchat className="chat-icon" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CornerList;
