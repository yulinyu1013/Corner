import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Pie } from '@ant-design/charts';
import { getEngagment } from '../fetchers/analytics';

const EngagementAnalytics = ({ setEngagements }) => {
  const { cornerId } = useParams();

  const dummy = [
    {
      type: 'Post',
      value: 0,
    },
    {
      type: 'Comment',
      value: 0,
    },
    {
      type: 'Message',
      value: 0,
    },
  ];

  const [data, setData] = useState(dummy);
  useEffect(() => {
    getEngagment(cornerId).then((res) => {
      const d = res.data;
      const sumValues = Object.values(d).reduce((a, b) => Number(a) + Number(b));
      console.log(sumValues);
      setEngagements(sumValues);
      const cleaned = [
        {
          type: 'Post',
          value: Number(d.Post),
        },
        {
          type: 'Comment',
          value: Number(d.Comment),
        },
        {
          type: 'Message',
          value: d.Message,
        },
      ];
      console.log(cleaned);
      setData(cleaned);
      console.log(data);
    });
  }, []);

  const config = {
    appendPadding: 10,
    data: data || dummy,
    angleField: 'value',
    colorField: 'type',
    radius: 0.6,
    label: {
      type: 'outer',
      content: '{name} \n {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  /* eslint-disable react/jsx-props-no-spreading */
  return <Pie {...config} />;
};

export default EngagementAnalytics;
