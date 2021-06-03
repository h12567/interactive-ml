import './App.css';

import React, { Component, useRef } from 'react';
import Dummy from './components/Dummy'
import SampleVis from './components/SampleVis'
import ClusterVis from './components/ClusterVis'
import PseudoCodeBox from './components/PseudoCodeBox'
import DataDisplay from './components/DataDisplay'
import { Button } from '@material-ui/core'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Col from 'react-bootstrap/Col'
import { pseudo_code, KMeans } from './ml/k-means'
import { Line, Circle } from 'rc-progress';

function MainComponent({state_arr}) {
    const [initial_idx, setIntialIdx] = React.useState(0);
    const [is_pause, setPause] = React.useState(true);
    var percent = (initial_idx + 1) / state_arr.length * 100

    if (!is_pause && initial_idx <= state_arr.length - 2) {
        setTimeout(function(){setIntialIdx(initial_idx + 1);}, 10000 / state_arr.length);
    }

    function decreaseIdx() {
      // initial_idx -= 1;
      setIntialIdx(initial_idx - 1);
    }
    
    function increaseIdx() {
      // initial_idx += 1;
      setIntialIdx(initial_idx + 1);
      // clusterVisRef.current.forceUpdate();
    }

    function startRun() {
        setPause(false);
    }

    function pauseRun() {
        setPause(true);
    }

    return (
        <div classname="App">
        {/* <Dummy /> */}
        {/* <SampleVis data={data} /> */}
  
        {/* <div>
          {itemList}
        </div>  */}
        
        <div className="row">
              {/* ref={r => { clusterVisRef.current = r; setRefVisible(!!r); }}> */}
          <div className="col-sm-12 col-md-8">
            <ClusterVis id='cluster_vis' i={initial_idx} data={state_arr[initial_idx][2]['data']} centroids={state_arr[initial_idx][2]['centroids']}
            />
          </div>
          <div className="col-sm-12 col-md-8">
            <PseudoCodeBox id='code_box' i={initial_idx} code_box={pseudo_code} idx={state_arr[initial_idx][0]} />
          </div>
        </div> 
        {/* <div>
        <Col>
       <ProgressBar />  
        </Col>
            <ProgressBar variant="success" now={40} />
            <ProgressBar variant="info" now={20} />
            <ProgressBar variant="warning" now={60} />
            <ProgressBar variant="danger" now={80} />
        </div> */}
        <div>
          <Line percent={percent} strokeWidth="3" strokeColor="#2db7f5" />
          {initial_idx > 0 ? <Button onClick={decreaseIdx} color="primary"> PREV </Button> : null}
          {initial_idx <= state_arr.length - 2 ? <Button onClick={increaseIdx} color="primary"> NEXT </Button> : null}
          <Button onClick={startRun} color="primary"> RUN </Button>
          <Button onClick={pauseRun} color="primary"> PAUSE </Button>
        </div>
        <div className="col-sm-6 col-md-3">
            <DataDisplay id='data_display' i={initial_idx} data={state_arr[initial_idx][1] != null ? state_arr[initial_idx][1] : {}} />
        </div>
      </div>
    );
  
}

export default MainComponent;
