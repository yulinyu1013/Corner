import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Column } from '@ant-design/charts';
import { getPostStats } from '../fetchers/analytics';

const PostAnalytics = ({ setPosts }) => {
  const { cornerId } = useParams();

  const dummy = [
    {
      type: 'Text',
      count: 0,
    },
    {
      type: 'Audio',
      count: 0,
    },
    {
      type: 'Image',
      count: 0,
    },
    {
      type: 'Video',
      count: 0,
    },
  ];

  const [data, setData] = useState(dummy);
  useEffect(() => {
    getPostStats(cornerId).then((res) => {
      const d = res.data;
      const cleaned = [
        {
          type: 'Text',
          count: Number(d.Text),
        },
        {
          type: 'Audio',
          count: Number(d.Audio),
        },
        {
          type: 'Image',
          count: Number(d.Image),
        },
        {
          type: 'Video',
          count: Number(d.Text),
        },
      ];
      console.log(cleaned);
      const sumValues = Object.values(d).reduce((a, b) => Number(a) + Number(b));
      console.log(sumValues);
      setPosts(sumValues);
      setData(cleaned);
    });
  }, []);

  const config = {
    data: data || dummy,
    xField: 'type',
    yField: 'count',
    autoFit: true,
    color: '#FFC37B',
    label: {
      position: 'middle',
      style: {
        fill: '#505050',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    interactions: [
      { type: 'tooltip', domStyles: { 'g2-tooltip * ': { height: '5px' } } },
    ],
    meta: {
      type: {
        alias: 'type',
      },
      count: {
        alias: 'count',
      },
    },
  };
  /* eslint-disable react/jsx-props-no-spreading */
  return <Column {...config} />;
};

export default PostAnalytics;
