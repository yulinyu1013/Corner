import React, { useEffect, useState } from 'react';
import { Upload, message, Button } from 'antd';
import { useHistory } from 'react-router';
import { UploadOutlined } from '@ant-design/icons';
import '../styles/getProfile.css';
import '../styles/updateProfile.css';
import settingIcon from '../images/setting.svg';
import logout from '../images/logout.svg';
import homefeed from '../images/homefeed.svg';
import explore from '../images/explore.svg';
import userAvatar from '../images/logo.png';
import createGroup from '../images/create_group.svg';
import CreateGroup from './createGroup';
import { updateProfile, deleteUser } from '../fetchers/profile';
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
  passwordConfirmValidation,
  bioValidation,
} from '../helpers/userInfoValidationHelper';

function Profile({
  setIsLoggedIn,
  currentUser,
  setCurrentUser,
  isInChat,
}) {
  const [user, setUser] = useState({});
  const [updateAvatarUrl, setUpdateAvatarUrl] = useState();
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setUpdateAvatarUrl(currentUser.avatar);
    }
  }, [currentUser, edit]);

  // createGroupHandler
  const [isOpen, setIsOpen] = useState(false);

  // logoutHandler
  // const history = useHistory();
  const logoutHandler = () => {
    sessionStorage.clear();
    setCurrentUser({});
    setIsLoggedIn(false);
  };

  // updateUserHandler

  const [updateUsernameValidation, setUpdateUsernameValidation] = useState('');
  const [updateBioValidation, setUpdateBioValidation] = useState('');
  const [updateEmailValidation, setUpdateEmailValidation] = useState('');
  const [updatePasswordValidation, setUpdatePasswordValidation] = useState('');
  const [updatePasswordConfirmValidation, setUpdatePasswordConfirmValidation] = useState('');
  const [updatePasswordConfirm, setUpdatePasswordConfirm] = useState('');

  const updateNameHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setUpdateUsernameValidation(usernameValidation(e.target.value));
  };

  const updateBioHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setUpdateBioValidation(bioValidation(e.target.value));
  };

  const updateEmailHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setUpdateEmailValidation(emailValidation(e.target.value));
  };

  const updatePasswordHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setUpdatePasswordValidation(passwordValidation(e.target.value));
  };

  const updatePasswordConfirmHandler = (e) => {
    const { value } = e.target;
    setUpdatePasswordConfirm(value);
    setUpdatePasswordConfirmValidation(passwordConfirmValidation(user.password, value));
  };

  const updateUserHandler = async () => {
    console.log('updating user profile...');
    console.log(user);
    if (updateUsernameValidation === ''
      && updateBioValidation === ''
      && updateEmailValidation === ''
      && updatePasswordValidation === ''
      && updatePasswordConfirmValidation === '') {
      updateProfile(user).then((res) => {
        console.log(res.data);
        sessionStorage.setItem('userInfo', JSON.stringify(res.data));
        setCurrentUser(res.data);
        setEdit(false);
        console.log('update successfully');
      }).catch((err) => {
        console.log('got err!');
        console.log(err);
      });
    }
  };

  const cancelEditHandler = () => {
    setEdit(false);
    setUser(currentUser);
  };

  const deleteUserHandler = () => {
    deleteUser(user.name).then(() => {
      sessionStorage.removeItem('userInfo');
      setIsLoggedIn(false);
    });
  };

  const history = useHistory();
  const exploreHandler = () => {
    console.log('explore mode');
    history.push('/explore');
  };

  const homeFeedHandler = () => {
    console.log('home mode');
    history.push('/');
  };

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
    headers: {
      authorization: 'authorization-text',
      'Access-Control-Allow-Origin': '*',
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file);
        message.success(`${info.file.name} file uploaded successfully`);
        setUser({ ...user, avatar: info.file.originFileObj });
        setUpdateAvatarUrl(URL.createObjectURL(info.file.originFileObj));
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        setUser({ ...user, avatar: info.file.originFileObj });
        setUpdateAvatarUrl(URL.createObjectURL(info.file.originFileObj));
      }
    },
  };

  return (
    <>
      <div className="userProfileContainer" data-testid="userProfile">
        {!edit
          ? (
            <div className="getUserProfile">
              <img className="getUserAvatar" src={updateAvatarUrl || userAvatar} alt="" />
              <div className="getUserName">{user.name}</div>
              <div className="getUserBios">{user.bio}</div>
              <div className="userProfileButtonGroup">
                { !isInChat
                  ? (
                    <button className="createGroup" type="submit" onClick={() => setIsOpen(true)}>
                      <img className="userProfileButtonIcon" src={createGroup} alt="" />
                      &nbsp;&nbsp;Create Group
                    </button>
                  )
                  : '' }
                <button className="homeFeed" type="submit" onClick={homeFeedHandler}>
                  <img className="userProfileButtonIcon" src={homefeed} alt="" />
                  &nbsp;&nbsp;Home Feed
                </button>
                <button className="explore" type="submit" onClick={exploreHandler}>
                  <img className="userProfileButtonIcon" src={explore} alt="" />
                  &nbsp;&nbsp;Explore
                </button>
                { !isInChat
                  ? (
                    <button className="settings" data-testid="userSetting" type="button" onClick={() => setEdit(true)}>
                      <img className="userProfileButtonIcon" src={settingIcon} alt="" />
                      &nbsp;&nbsp;Setting
                    </button>
                  )
                  : '' }
              </div>
              <hr className="getUserProfileLineBreak" />
              { !isInChat
                ? (
                  <button className="userLogout" type="submit" onClick={logoutHandler}>
                    <img className="userProfileButtonIcon" src={logout} alt="" />
                    &nbsp;&nbsp;Log out
                  </button>
                )
                : '' }
            </div>
          )
          : (
            <div className="updateUserProfile" data-testid="updateUserProfile">
              <img className="editUserAvatar" src={updateAvatarUrl || userAvatar} alt="" />
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Upload {...props}>
                <Button className="uploadUserAvatar" icon={<UploadOutlined />}>Upload Your Profile</Button>
              </Upload>
              <div className="userUpdateInputGroup">
                <div className="updateProfileInputLabel"> Name: </div>
                <div className="update-validation">{updateUsernameValidation}</div>
                <input data-testid="updateUserInput" className="updateUsername" type="text" name="name" value={user.name} onChange={updateNameHandler} />
                <div className="updateProfileInputLabel"> Bios: </div>
                <div className="update-validation">{updateBioValidation}</div>
                <input data-testid="updateUserInput" className="updateUserBio" type="text" name="bio" value={user.bio} onChange={updateBioHandler} />
                <div className="updateProfileInputLabel"> Email: </div>
                <div className="update-validation">{updateEmailValidation}</div>
                <input data-testid="updateUserInput" className="updateUserEmail" type="email" name="email" value={user.email} onChange={updateEmailHandler} />
                <div className="updateProfileInputLabel"> Password: </div>
                <div className="update-validation">{updatePasswordValidation}</div>
                <input data-testid="updateUserInput" className="updateUserPassword" type="password" name="password" value={user.password} onChange={updatePasswordHandler} />
                <div className="updateProfileInputLabel"> Confirm Password: </div>
                <div className="update-validation">{updatePasswordConfirmValidation}</div>
                <input data-testid="updateUserInput" className="confirmUpdateUserPassword" type="password" name="update-confirm-pw" value={updatePasswordConfirm} onChange={updatePasswordConfirmHandler} />
                <button className="deleteUser" type="submit" onClick={deleteUserHandler}>Delete Account</button>
              </div>
              <hr className="updateUserProfileLineBreak" />
              <div className="submitUpdateButtonGroup">
                <button className="updateUserSubmit" type="submit" disabled={!user.name || !user.email || !user.password || !updatePasswordConfirm} onClick={updateUserHandler}>Update</button>
                <button className="updateUserCancel" type="button" onClick={cancelEditHandler}>Cancel</button>
              </div>
            </div>
          )}
      </div>
      <CreateGroup open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default Profile;
