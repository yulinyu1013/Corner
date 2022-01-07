export const getnotificationArray = async () => {
  const mockData = [
    {
      id: 1,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user flagged the post)',
      type: 'flag',
      relatedPost: 1,
      isRead: false,
    },
    {
      id: 2,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user(userId) request to join the XXX Corner(cornerId)',
      type: 'request',
      isRead: true,
    },
    {
      id: 3,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user invied you to XXX Corner (cornerId)!',
      type: 'invitation',
      isRead: false,
    },
    {
      id: 4,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user accepted your invitaion!',
      type: 'other',
      isRead: false,
    },
    {
      id: 5,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user flagged the post',
      type: 'flag',
      relatedPost: 1,
      isRead: false,
    },
    {
      id: 6,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user(userId) request to join the XXX Corner(cornerId)',
      type: 'request',
      isRead: false,
    },
    {
      id: 7,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user invied you to XXX Corner (cornerId)!',
      type: 'invitation',
      isRead: false,
    },
    {
      id: 8,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user accepted your invitaion!',
      type: 'other',
      isRead: false,
    },
    {
      id: 9,
      sender: 1,
      relatedCorner: 1,
      content: 'XXX user mentioned you in his/her Post!',
      type: 'mention',
      relatedPost: 1,
      isRead: false,
    },
  ];

  return mockData;
};

export default { getnotificationArray };
