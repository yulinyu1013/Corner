import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Line, G2 } from '@ant-design/charts';
import { each, findIndex } from '@antv/util';
import { getMemberGrowth } from '../fetchers/analytics';

const MemberAnalytics = ({ setMembers }) => {
  const { InteractionAction, registerInteraction, registerAction } = G2;
  const { cornerId } = useParams();
  const dummy = [
    {
      date: '2021/3',
      count: 10,
    },
    {
      date: '2021/4',
      count: 20,
    },
    {
      date: '2021/5',
      count: 30,
    },
    {
      date: '2021/6',
      count: 35,
    },
    {
      date: '2021/7',
      count: 75,
    },
    {
      date: '2021/8',
      count: 77,
    },
    {
      date: '2021/9',
      count: 40,
    },
    {
      date: '2021/10',
      count: 33,
    },
    {
      date: '2021/11',
      count: 67,
    },
  ];
  const [data, setData] = useState(dummy);
  useEffect(() => {
    getMemberGrowth(cornerId).then((res) => {
      let d = res.data;
      console.log(d);
      d = d.reverse();
      const sumValues = d.map((i) => i.count).reduce((a, b) => a + b);
      setMembers(sumValues);
      setData(d);
      console.log(sumValues);
    });
  }, []);

  G2.registerShape('point', 'custom-point', {
    draw(cfg, container) {
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      group.addShape('circle', {
        name: 'outer-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || 'red',
          opacity: 0.5,
          r: 6,
        },
      });
      group.addShape('circle', {
        name: 'inner-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || 'red',
          opacity: 1,
          r: 2,
        },
      });
      return group;
    },
  });

  class CustomMarkerAction extends InteractionAction {
    active() {
      // eslint-disable-next-line react/no-this-in-sfc
      const view = this.getView();
      // eslint-disable-next-line react/no-this-in-sfc
      const { event } = this.context;
      const evt = event;

      if (evt.data) {
        const { items } = evt.data;
        const pointGeometries = view.geometries.filter((geom) => geom.type === 'point');
        each(pointGeometries, (pointGeometry) => {
          each(pointGeometry.elements, (pointElement) => {
            const active = findIndex(items, (item) => item.data === pointElement.data) !== -1;
            const [point0, point1] = pointElement.shape.getChildren();

            if (active) {
              // outer-circle
              point0.animate(
                {
                  r: 10,
                  opacity: 0.2,
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              ); // inner-circle

              point1.animate(
                {
                  r: 6,
                  opacity: 0.4,
                },
                {
                  duration: 800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              );
            } else {
              // eslint-disable-next-line react/no-this-in-sfc
              this.resetElementState(pointElement);
            }
          });
        });
      }
    }

    reset() {
      // eslint-disable-next-line react/no-this-in-sfc
      const view = this.getView();
      const points = view.geometries.filter((geom) => geom.type === 'point');
      each(points, (point) => {
        each(point.elements, (pointElement) => {
          // eslint-disable-next-line react/no-this-in-sfc
          this.resetElementState(pointElement);
        });
      });
    }

    // eslint-disable-next-line class-methods-use-this
    resetElementState(element) {
      const [point0, point1] = element.shape.getChildren();
      point0.stopAnimate();
      point1.stopAnimate();
      const { r, opacity } = point0.get('attrs');
      point0.attr({
        r,
        opacity,
      });
      const { r: r1, opacity: opacity1 } = point1.get('attrs');
      point1.attr({
        r: r1,
        opacity: opacity1,
      });
    }

    getView() {
      // eslint-disable-next-line react/no-this-in-sfc
      const { view } = this.context;
      return view;
    }
  }

  registerAction('custom-marker-action', CustomMarkerAction);
  registerInteraction('custom-marker-interaction', {
    start: [
      {
        trigger: 'tooltip:show',
        action: 'custom-marker-action:active',
      },
    ],
    end: [
      {
        trigger: 'tooltip:hide',
        action: 'custom-marker-action:reset',
      },
    ],
  });
  const config = {
    data,
    xField: 'date',
    yField: 'count',
    label: {},
    point: {
      size: 5,
      shape: 'custom-point',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'custom-marker-interaction',
      },
    ],
  };
  /* eslint-disable react/jsx-props-no-spreading */
  return <Line {...config} />;
};

export default MemberAnalytics;
