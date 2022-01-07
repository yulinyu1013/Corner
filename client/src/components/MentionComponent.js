export const regxHelper = (text) => {
  if (text === undefined) {
    return null;
  }
  let newMentionName = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '[' || text[i] === ']') {
      newMentionName += '';
    } else {
      newMentionName += text[i];
    }
  }
  return newMentionName;
};

export const textOperation = (text) => {
  const textArr = text.split(' ');
  const nameArr = [];
  let mentionList = '';
  textArr.forEach((item) => {
    if (item.startsWith('@')) {
      const idwithName = item.split('*');
      const n = regxHelper(idwithName[0]);
      const id = regxHelper(idwithName[1]);
      nameArr.push({ name: n, id });
      mentionList += `${n}  `;
    } else {
      mentionList += ` ${item} `;
    }
  });
  //  nameList : includes id
  return { nameList: nameArr, mentionList };
};

export const style = {
  control: {
    border: 'none',
    fontSize: 12,
  },

  '&singleLine': {
    control: {
      display: 'inline-block',
      // width: 160,
      fontSize: 10,
    },
    input: {
      padding: 10,
      border: '1px solid #dfdfdf',
      borderRadius: 20,
      outline: 'none',
    },
  },

  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      border: 'none',
    },
    highlighter: {
      padding: 9,
    },
    input: {
      padding: 9,
      minHeight: 63,
      outline: 0,
      border: 0,
      maxHeight: 100,
      overflow: 'auto',
      position: 'absolute',
      bottom: 14,
    },
  },

  suggestions: {
    // top: -65,
    // left: 50,
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 10,
      // zIndex: 999999,
      overflowY: 'auto',
      maxHeight: 180,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};

export default { textOperation, style };
