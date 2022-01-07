import React, { useState } from 'react';
import {
  Modal,
  Button,
  Upload,
  message,
  Space,
} from 'antd';
import { MentionsInput, Mention } from 'react-mentions';
import { UploadOutlined } from '@ant-design/icons';
import { textOperation, style } from './MentionComponent';
import { createPost } from '../fetchers/feedsApi';
import { sendNotificationsForMention } from '../fetchers/notificationApis';

function InputBox({
  setAllPosts,
  setNewPost,
  newPost,
  allPosts,
  allUsers,
  cornerName,
  cornerId,
  userName,
  avatar,
  userId,
}) {
  // const userName = 'testUser';
  // const userId = 1;
  // const cornerId = 1;
  // const cornerName = 'testCorner';

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('You can upload multiple images, or one Video/Audio ');
  const [updatefileList, setUpdatfileList] = useState([]);
  const [hasVideoAudio, setHasVideoAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const users = allUsers;
  // const avatar = 'http://localhost:5000/Users/lxy/Desktop/sites/fall-2021-project-group-centric-social-network-team-13/server/uploads/2021-12-08T21:45:42.712ZLee_Pace.jpg';

  // const users = [
  //   {
  //     id: '32c8413f-a0fb-49cc-8d76-f080f438bb72',
  //     display: 'Walter',
  //   },
  //   {
  //     id: '86f8fd2f-57f2-4961-9028-735afecc5cd1',
  //     display: 'Xinyi',
  //   },
  //   {
  //     id: '3',
  //     display: 'Yulin',
  //   },
  //   {
  //     id: '4',
  //     display: 'Yiheng',
  //   },
  //   {
  //     id: '5',
  //     display: 'Walter',
  //   },
  //   {
  //     id: '6',
  //     display: 'Xinyi',
  //   },
  //   {
  //     id: '7',
  //     display: 'Yulin',
  //   },
  //   {
  //     id: '8',
  //     display: 'Yiheng',
  //   },
  //   {
  //     id: '9',
  //     display: 'Walter',
  //   },
  //   {
  //     id: '10',
  //     display: 'Xinyi',
  //   },
  //   {
  //     id: '11',
  //     display: 'Yulin',
  //   },
  //   {
  //     id: '12',
  //     display: 'Yiheng',
  //   },
  //   {
  //     id: '13',
  //     display: 'Walter',
  //   },
  //   {
  //     id: '14',
  //     display: 'Xinyi',
  //   },
  //   {
  //     id: '15',
  //     display: 'Yulin',
  //   },
  //   {
  //     id: '16',
  //     display: 'Yiheng',
  //   },
  // ];

  const submitNewPostHandler = async () => {
    if (newPost.length === 0) {
      message.error('Input box cannot be empty!');
      return;
    }
    // loading
    setLoading(true);
    // logic to create new post and send data to the backend
    const imageurls = [];
    let videourls = null;
    let audiourls = null;
    if (updatefileList.length >= 1 && (updatefileList[0].type === 'image/jpeg' || updatefileList[0].type === 'image/png' || updatefileList[0].type === 'image/jpg')) {
      updatefileList.filter((item) => (imageurls.push(item.originFileObj)));
    } else if (updatefileList && updatefileList.length === 1) {
      if (updatefileList[0].type === 'audio/mpeg' || updatefileList[0].type === 'audio/wav') {
        audiourls = updatefileList[0].originFileObj;
      } else {
        videourls = updatefileList[0].originFileObj;
      }
    }

    let res = {};
    let submitText = newPost;
    if (newPost.includes('@')) {
      res = textOperation(newPost);
      submitText = res.mentionList;
      console.log(res);
    }

    console.log('sending');
    console.log(imageurls);
    createPost(
      userId,
      userName,
      cornerId,
      cornerName,
      submitText,
      imageurls,
      videourls,
      audiourls,
      avatar,
    ).then((p) => {
      console.log(p.status);
      if (p.status === 404) {
        setLoading(false);
        message.error('fail to upload');
      }
      const data = p.data.createdpost;
      const relatedPost = data.id;

      setAllPosts([data, ...allPosts]);
      setUpdatfileList([]);
      setLoading(false);
      // call api to add mentions
      if (newPost.includes('@') && res.nameList.length > 0) {
        let receivers = '';
        res.nameList.forEach((e) => {
          receivers += `${e.id},`;
        });
        receivers = receivers.slice(0, receivers.length - 1);
        sendNotificationsForMention(userName, userId, receivers, relatedPost, cornerId, 'post');
      }
    });

    setNewPost('');
    setHasVideoAudio(false);
  };

  const newPostOnChangeHandler = (e) => {
    const inputText = e.target.value;
    setNewPost(inputText);
  };

  const showModal = () => {
    setVisible(true);
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const beforeUpload = () => false;

  const handleOk = () => {
    setModalText('Uploading');
    setConfirmLoading(true);

    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
      setModalText('Upload');
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
    setUpdatfileList([]);
    setHasVideoAudio(true);
  };

  const onChange = ({ file, fileList }) => {
    if (updatefileList.length > fileList.length && (file.type === 'audio/mpeg' || file.type === 'video/avi')) {
      setHasVideoAudio(false);
    }

    if (file.status !== 'uploading') {
      if (file.type === 'audio/mpeg' && !hasVideoAudio) {
        setHasVideoAudio(true);
        setUpdatfileList(fileList);
      } else if (file.status === 'video/avi' && !hasVideoAudio) {
        setHasVideoAudio(true);
        setUpdatfileList(fileList);
      } else if (hasVideoAudio && updatefileList.length <= fileList.length) {
        const newList = fileList.filter((item) => item.uid !== file.uid);
        setUpdatfileList(newList);
        // pop up message
        message.error('You can only upload one video/audio file or multiple images!');
      } else {
        setUpdatfileList(fileList);
      }
    }
  };

  const searchTermCallBack = (search) => {
    const arr = users.filter((u) => u.display.toLowerCase().startsWith(search.toLowerCase()));
    return arr;
  };

  const displayTransForm = (id, display) => `@${display}`;

  return (
    <div className="create-post-box">
      <div className="create">
        <MentionsInput
          className="create-input-box"
          value={newPost}
          placeholder="Create your post here..."
          onChange={newPostOnChangeHandler}
          style={style}
          singleLine={false}
          allowSuggestionsAboveCursor
        >
          <Mention
            trigger="@"
            data={(search) => searchTermCallBack(search)}
            appendSpaceOnAdd
            markup="@[__display__]*[__id__]"
            displayTransform={(id, display) => displayTransForm(id, display)}
          />
        </MentionsInput>
      </div>
      <div className="post-options-icon">
        <div className="upload-file" role="presentation" onClick={showModal}>Upload Files</div>
        <button className="create-post-button" type="submit" disabled={loading} onClick={submitNewPostHandler}>
          { loading ? 'Posting' : 'Post' }
        </button>
      </div>
      <Modal
        title="Upload Files"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{ type: 'primary' }}
        cancelButtonProps={{ type: 'ghost' }}
      >
        <p>{modalText}</p>
        <Upload
          beforeUpload={beforeUpload}
          customRequest={dummyRequest}
          onChange={onChange}
          multiple
          fileList={updatefileList}
        >
          <Button icon={<UploadOutlined style={{ color: 'orange', borderBlockColor: 'orange' }} />}>Upload</Button>
        </Upload>
      </Modal>
      <Space />
    </div>
  );
}

export default InputBox;
