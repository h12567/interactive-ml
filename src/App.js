import './App.css';

import React, { Component, useRef } from 'react';
import Dummy from './components/Dummy'
import SampleVis from './components/SampleVis'
import ClusterVis from './components/ClusterVis'
import PseudoCodeBox from './components/PseudoCodeBox'
import DataDisplay from './components/DataDisplay'
import MainComponent from './MainComponent'
import { TextField } from '@material-ui/core'
import { pseudo_code, KMeans } from './ml/k-means'
import { range } from 'd3';
import { Form, Input, Button } from 'antd';

var points = [
  [120, 20],
  [510, 30],
  [210, 290],
  [310, 390],
  [110, 190]
];
var k = 2;
var n_input, k_input;

function App() {

  var [state_arr, setStateArr] = React.useState(0);

  console.log("COMPUTE");
  console.log(k);
  state_arr = KMeans(points, k);

  const clusterVisRef = React.useRef();
  const [refVisible, setRefVisible] = React.useState(false);

  function generateRandomPoints() {
    console.log("DATA HERE");
    console.log(n_input);
    points = [];
    for (var i = 0; i < n_input; i ++) {
      points.push([
        Math.random() * 1000, Math.random() * 1000
      ]);
    }
    console.log(points);
    points = points;
    k = k_input;
    setStateArr(KMeans(points, k_input));
  }

  React.useEffect(() => {
    console.log(clusterVisRef.current);
  }, [clusterVisRef]);

  const onFormChange = ({ numPoints, numCentroids }) => {
    if (numPoints) {
      n_input = parseInt(numPoints)
    }
    if (numCentroids) {
      k_input = parseInt(numCentroids)
    }
  };

  return (
    <div>
      <Form
        layout="inline"
        onFinish={generateRandomPoints}
        onValuesChange={onFormChange}
      >
        <Form.Item name="numPoints" label="Number of points">
          <Input placeholder="Input a number" />
        </Form.Item>
        <Form.Item name="numCentroids" label="Number of centroids">
          <Input placeholder="Input a number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={generateRandomPoints}>Submit</Button>
        </Form.Item>
      </Form>

      <MainComponent id='main_component' state_arr={state_arr} />
    </div>
  );

}

export default App;
