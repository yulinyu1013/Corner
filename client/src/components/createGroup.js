import React from 'react';
import ReactDom from 'react-dom';
import { useHistory } from 'react-router';
import '../styles/createGroup.css';
import {
  Form,
  Input,
  Button,
  Radio,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import AddHashTag from './addHashTag';
import { createGroup } from '../fetchers/createGroup';
import { createPost } from '../fetchers/feedsApi';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
/* eslint-disable no-template-curly-in-string */

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 30 },
    sm: { span: 50 },
  },
};

const validateMessages = {
  required: '${label} is required!',
};

const CreateGroup = ({ open, onClose }) => {
  if (!open) return null;

  const history = useHistory();

  const onSubmit = async (data) => {
    console.log(data);
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    const newGroup = {
      creator: user.id,
      description: data.description,
      chatId: null,
      isPublic: data.isPublic === 'public',
      name: data.name,
      tag: data.tags.join('|'),
    };
    console.log(newGroup);
    createGroup(newGroup).then((res) => {
      console.log('group created in backend...');
      console.log(res.data);
      createPost(
        user.id,
        user.name,
        res.data.id,
        res.data.name,
        'Welcome!',
        null,
        null,
        null,
        user.avatar,
      );
      onClose();
      history.push(`/corner/${user.name}/${newGroup.name}/${res.data.id}`);
    });
  };

  return ReactDom.createPortal(
    <>
      <div className="create-group-modal-overlay" data-testid="createGroup">
        <div className="create-group-modal-container">
          {/* eslint-disable react/jsx-props-no-spreading */}
          <h1 className="create-corner-title">Create Corner</h1>
          <hr className="create-group-title-break" />
          <Form {...layout} name="nest-messages" onFinish={(e) => onSubmit(e)} validateMessages={validateMessages}>
            <Form.Item
              style={{ fontSize: '16px' }}
              name={['name']}
              label={<span style={{ fontSize: '18px', marginRight: '5px' }}>Group Name</span>}
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[a-zA-Z\d:]+$/),
                  message: 'No empty name or special characters.',
                },
              ]}
            >
              <Input style={{ borderRadius: '10px' }} data-testid="group-name-input" />
            </Form.Item>
            <Form.Item
              name="isPublic"
              label={<span style={{ fontSize: '18px', marginRight: '5px' }}>Group Type</span>}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Radio name="private" value="private" style={{ fontSize: '16px', marginRight: '20px' }} data-testid="test-private">Private</Radio>
                <Radio name="public" value="public" style={{ fontSize: '16px' }} data-testid="test-public">Public</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={['description']}
              label={<span style={{ fontSize: '18px', marginRight: '5px' }}>Description</span>}
            >
              <Input.TextArea style={{ height: '80px', borderRadius: '10px' }} />
            </Form.Item>
            <Form.Item
              // name={['tag']}
              label={<span style={{ fontSize: '18px', marginRight: '5px' }}>Tags</span>}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Form.List
                {...layout}
                name="tags"
                label={<span style={{ fontSize: '18px', marginRight: '5px' }}>Tags</span>}
                rules={[
                  {
                    validator: async (_, names) => {
                      if (!names || names.length < 1) {
                        return Promise.reject(new Error('At least 1 tags'));
                      }
                      if (names.length > 3) {
                        return Promise.reject(new Error('At most 3 tags'));
                      }
                      return null;
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field) => (
                      <Form.Item
                        {...formItemLayout}
                        // {...layout}
                        // label={index === 0 ? 'Passengers' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: 'Please enter a tag that describes your corner or delete this field.',
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="add your tag" style={{ width: '60%' }} />
                        </Form.Item>
                        {fields.length >= 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '100%', height: '120%' }}
                        icon={<PlusOutlined />}
                      >
                        <span style={{ fontSize: '16px', borderRadius: '10px' }}>Add Tag</span>
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 14 }}>
              <Button
                htmlType="submit"
                style={
                  {
                    background: '#FFC37B',
                    borderColor: '#FFC37B',
                    borderRadius: '10px',
                    padding: '0 30px',
                  }
                }
              >
                Submit
              </Button>
              <Button
                htmlType="button"
                onClick={onClose}
                style={
                  {
                    background: '#C4C4C4',
                    borderColor: '#C4C4C4',
                    marginLeft: 30,
                    borderRadius: '10px',
                    padding: '0 30px',
                  }
                }
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>,
    document.getElementById('portal'),
  );
};
export default CreateGroup;
