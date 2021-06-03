import './App.css';

import React, { Component, useRef } from 'react';
import Dummy from './components/Dummy'
import SampleVis from './components/SampleVis'
import ClusterVis from './components/ClusterVis'
import PseudoCodeBox from './components/PseudoCodeBox'
import DataDisplay from './components/DataDisplay'
import MainComponent from './MainComponent'
import { Button, TextField } from '@material-ui/core'
import { pseudo_code, KMeans } from './ml/k-means'
import { range } from 'd3';

var points = [
  [120, 20],
  [510, 30],
  [210, 290],
  [310, 390],
  [110, 190]
];
var k = 2;

function App() {
  
  var [state_arr, setStateArr] = React.useState(0);
  
  console.log("COMPUTE");
  console.log(k);
  state_arr = KMeans(points, k);
  
  const clusterVisRef = React.useRef();
  const [refVisible, setRefVisible] = React.useState(false);

  var n_input, k_input;

  function generateRandomPoints(evt) {
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
    evt.preventDefault();
  }

  function updateK(evt) {
    k_input = parseInt(evt.target.value);
  }

  function updateN(evt) {
    n_input = parseInt(evt.target.value);
  }

  React.useEffect(() => {
    console.log(clusterVisRef.current);
  }, [clusterVisRef]);

  return (
    <div>
      <form onSubmit={generateRandomPoints}>
        <label>
          Number of Points:
          <TextField onChange={updateN} />
        </label>
        <label>
          Number of Centroids:
          <TextField onChange={updateK} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <MainComponent id='main_component' state_arr={state_arr} />
    </div>
  );

}

export default App;
