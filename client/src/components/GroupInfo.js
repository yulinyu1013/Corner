import React, { useEffect, useState } from 'react';
import {
  Upload,
  message,
  Button,
  Modal,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useHistory } from 'react-router';
import jm from '../images/logo.png';
import '../styles/groupInfo.css';
import { sendNotificationsforJoinCorner, sendNotificationsforInviting } from '../fetchers/notificationApis';
import {
  getAdminsOfCorner,
  getUserId,
  checkHaveSentRequestToJoin,
  checkIfUserHasJoinned,
  removeUserFromCorner,
  checkAdmin,
} from '../fetchers/userApis';
import { getGroupInfo, updateGroupInfo } from '../fetchers/groupProfile';
import { usernameValidation, isEmptyOrSpaces } from '../helpers/userInfoValidationHelper';

function GroupInfo({ currentUser }) {
  const { userName, cornerId, cornerName } = useParams();
  console.log(currentUser);
  const dummyCorner = {
    id: 10086,
    name: 'testName',
    type: 'Public',
    description: 'test description',
    tag: ['test tag1', 'test tag2'],
    avatar: jm,
  };
  const [corner, setCorner] = useState(dummyCorner);
  // const isAdmin = true; // get the admins id array
  const [requested, setRequested] = useState(false);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [admins, setAdmins] = useState([]);
  const [joinned, setJoinned] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();
  const userId = currentUser && currentUser.id ? currentUser.id : null;
  // const userName = currentUser.name ? currentUser.name : null;
  // const cornerName = currentCorner.name ? currentCorner.name : null;
  // const cornerId = currentCorner.id ? currentCorner.id : null;

  const sendJoinRequest = () => {
    if (!requested) {
      const receivers = admins.join(',');
      sendNotificationsforJoinCorner(userName, userId, receivers, cornerName, cornerId);
      setRequested(true);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    // search for id given text
    const receiverId = await getUserId(text);
    if (receiverId !== null) {
      sendNotificationsforInviting(userName, userId, receiverId.id, cornerName, cornerId);
      setVisible(false);
    } else {
      message.error('No such user!');
    }
    setText('');
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const updateInputBox = (e) => {
    const inputText = e.target.value;
    setText(inputText);
  };

  const leaveGroup = () => {
    console.log('leave');
    // redirect to homepage **
    removeUserFromCorner(cornerId, userId).then((data) => {
      console.log(data);
      if (data.message === 'success') {
        history.push('/');
      }
    });
    // setJoinned(false);
  };

  const [edit, setEdit] = useState(false);
  const [updatedImage, setUpdatedImage] = useState(corner.avatar);
  const [updatedImageFile, setUpdatedImageFile] = useState('');
  const [updatedName, setUpdatedName] = useState(corner.name);
  const [updatedIsPublic, setUpdatedIsPublic] = useState(corner.isPublic);
  const [updatedDescription, setUpdatedDescription] = useState(corner.description);
  const [updatedTag1, setUpdateTag1] = useState(corner.tag[0]);
  const [updatedTag2, setUpdateTag2] = useState(corner.tag[1]);
  const [updatedTag3, setUpdateTag3] = useState(corner.tag[2]);

  useEffect(() => {
    console.log(userId);
    if (userId) {
      checkIfUserHasJoinned(cornerId, userId).then((data) => {
        console.log('joinned', data);
        if (data) {
          setJoinned(true);
        }
      });
      checkHaveSentRequestToJoin(cornerId, userId).then((data) => {
        if (data) {
          setRequested(true);
        }
      });
      checkAdmin(cornerId, userId).then((data) => {
        setIsAdmin(data);
      });
    }
    getAdminsOfCorner(cornerId).then((data) => {
      setAdmins(data);
    });

    getGroupInfo(cornerId).then((res) => {
      const data = { ...res.data };
      data.tag = data.tag.split('|');
      console.log(data);
      setCorner(data);
      setUpdatedImage(data.avatar);
      setUpdatedName(data.name);
      setUpdatedIsPublic(data.isPublic);
      setUpdatedDescription(data.description);
      setUpdateTag1(data.tag[0]);
      setUpdateTag2(data.tag[1]);
      setUpdateTag3(data.tag[2]);
    });
  }, [currentUser]);

  const [updateGroupNameValidation, setUpdateGroupNameValidation] = useState('');
  const [updateTagsValidation, setUpdateTagsValidation] = useState('');

  const updateNameHandler = (e) => {
    const { value } = e.target;
    setUpdatedName(value);
    setUpdateGroupNameValidation(usernameValidation(value));
  };

  const updateDescriptionHandler = (e) => {
    const { value } = e.target;
    setUpdatedDescription(value);
  };

  useEffect(() => {
    if (isEmptyOrSpaces(updatedTag1)
    && isEmptyOrSpaces(updatedTag2)
    && isEmptyOrSpaces(updatedTag3)) {
      setUpdateTagsValidation('Must add at least 1 tag!');
    } else {
      setUpdateTagsValidation('');
    }
  }, [updatedTag1, updatedTag2, updatedTag3]);

  const updateCornerHandler = () => {
    console.log(corner.id);
    if (updateTagsValidation === '') {
      const updatedCorner = {
        id: corner.id,
        name: updatedName,
        creator: corner.creator,
        description: updatedDescription,
        avatar: updatedImageFile,
        chatId: corner.chatId,
        isPublic: updatedIsPublic ? 1 : 0,
        tag: [updatedTag1, updatedTag2, updatedTag3].join('|'),
      };
      // logic to update corner info in backend
      console.log(updatedCorner);
      updateGroupInfo(updatedCorner).then((res) => {
        console.log(res.data);
        const updatedData = res.data;
        // updatedData.tag = updatedData.tag;
        setCorner(updatedData);
        setEdit(false);
      });
    }
  };

  const cancelEditHandler = () => {
    setEdit(false);
  };

  const analyticsHandler = () => {
    history.push(`/analytics/${cornerId}`);
  };

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
    headers: {
      authorization: 'authorization-text',
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
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        setUpdatedImage(URL.createObjectURL(info.file.originFileObj));
        setUpdatedImageFile(info.file.originFileObj);
      }
    },
  };

  return (
    <>
      {!edit
        ? (
          <div className="corner-info-container" data-testid="group-info">
            <div className="corner-image">
              <img className="image" src={corner.avatar !== null ? corner.avatar : jm} alt="jm" />
              <p className="corner-name-type">
                {corner.name}
                &nbsp;
                <span className="corner-type">{corner.isPublic ? 'Public' : 'Private'}</span>
              </p>
            </div>
            <div className="corner-description">
              {corner.description}
            </div>
            <div className="corner-tags">
              {corner.tag.map((t) => (
                isEmptyOrSpaces(t) ? '' : <div className="corner-tag-item">{t}</div>
              ))}
            </div>
            <div className="corner-setting-options">
              {!joinned && currentUser.id && <div className="item join-request" role="presentation" disabled={requested} onClick={sendJoinRequest}>{requested ? 'Requested!' : 'Join'}</div>}
              {joinned && <div className="item invite" role="presentation" onClick={showModal}>Invite</div>}
              {isAdmin && <button type="button" className="item corner-settings" onClick={() => setEdit(true)}>Corner Settings</button>}
              {joinned && <button className="item Anaytics" type="button" onClick={analyticsHandler}>Analytics</button>}
              {joinned && <div className="item leave-group" role="presentation" onClick={leaveGroup}>Leave Group</div>}
            </div>
            <Modal
              className="modal-invite"
              title="Invite users"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              okButtonProps={{ type: 'primary' }}
              cancelButtonProps={{ type: 'ghost' }}
            >
              <input className="inputbox-invite" placeholder="please type the username" value={text} onChange={updateInputBox} />
            </Modal>
          </div>
        )
        : (
          <div className="update-corner-info-container" data-testid="update-group-info">
            <img className="update-corner-image" src={updatedImage !== null ? updatedImage : jm} alt="jm" />
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Upload {...props}>
              <Button className="uploadCornerAvatar" icon={<UploadOutlined />}>Upload Corner Image</Button>
            </Upload>
            <div className="cornerUpdateInputGroup">
              <div className="updateCornerInputLabel"> Name: </div>
              <div className="update-corner-validation">{updateGroupNameValidation}</div>
              <input data-testid="updateCornerInput" className="updateCornername" type="text" name="name" value={updatedName} onChange={updateNameHandler} />
              <p className="updateCornerInputLabel">Type:</p>
              <div className="cornerUpdateType">
                <input type="radio" id="public" name="public" value="public" checked={updatedIsPublic} onClick={() => setUpdatedIsPublic(true)} />
                { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
                <label htmlFor="public">Public</label>
                <input type="radio" id="private" name="private" value="private" checked={!updatedIsPublic} onClick={() => setUpdatedIsPublic(false)} />
                { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
                <label htmlFor="private">Private</label>
              </div>
              <div className="updateCornerInputLabel"> Description: </div>
              {/* <div className="update-validation">{updateBioValidation}</div> */}
              <textarea data-testid="updateCornerInput" className="updateCornerDescription" name="description" value={updatedDescription} onChange={updateDescriptionHandler} />
              <div className="updateCornerTags">
                <div className="updateCornerInputLabel"> Tags: </div>
                <div className="update-corner-validation">{updateTagsValidation}</div>
                <input data-testid="updateCornerTag" className="updateCornerTag" type="text" name="tag" value={updatedTag1} onChange={(e) => setUpdateTag1(e.target.value)} />
                <input data-testid="updateCornerTag" className="updateCornerTag" type="text" name="tag" value={isEmptyOrSpaces(updatedTag2) ? undefined : updatedTag2} onChange={(e) => setUpdateTag2(e.target.value)} />
                <input data-testid="updateCornerTag" className="updateCornerTag" type="text" name="tag" value={isEmptyOrSpaces(updatedTag3) ? undefined : updatedTag3} onChange={(e) => setUpdateTag3(e.target.value)} />
              </div>
            </div>
            <hr className="updateCornerProfileLineBreak" />
            <div className="submitUpdateCornerButtonGroup">
              <button className="updateCornerSubmit" type="submit" disabled={!updatedName || (!updatedTag1 && !updatedTag2 && !updatedTag3)} onClick={updateCornerHandler}>Update</button>
              <button className="updatCornerCancel" type="button" onClick={cancelEditHandler}>Cancel</button>
            </div>
          </div>
        )}
    </>
  );
}

export default GroupInfo;
