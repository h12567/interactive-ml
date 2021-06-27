import './App.css';

import React, { Component, useRef } from 'react';
import Dummy from './components/Dummy'
import SampleVis from './components/SampleVis'
import PseudoCodeBox from './components/PseudoCodeBox'
import DataDisplay from './components/DataDisplay'
import ProgressBar from 'react-bootstrap/ProgressBar'
import AlgoFactory from './AlgoFactory'
import Col from 'react-bootstrap/Col'
import { pseudo_code, KMeans } from './ml/k-means'
import { Progress, Button, Radio } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';


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
        <div classname="App" style={{display:"flex", flexDirection:"column", justifyContent:"space-evenly"}}>

        <div className="row">

          <div className="col-sm-12 col-md-8">
            {AlgoFactory.selectVis("KMeansCluster", state_arr, initial_idx)}
          </div>
          <div className="col-sm-12 col-md-8">
            <PseudoCodeBox id='code_box' i={initial_idx} code_box={pseudo_code} idx={state_arr[initial_idx][0]} />
          </div>
        </div>

        <div>
          <Progress percent={percent} showInfo={false}/>
          <Radio.Group>
            {initial_idx > 0
              ? <Radio.Button type="primary" onClick={decreaseIdx}><StepBackwardOutlined/> Prev</Radio.Button>
              : <Radio.Button type="primary" disabled><StepBackwardOutlined/> Prev</Radio.Button>
            }
            {initial_idx <= state_arr.length - 2
              ? <Radio.Button type="primary" onClick={increaseIdx}><StepForwardOutlined /> Next</Radio.Button>
              : <Radio.Button type="primary" disabled><StepForwardOutlined /> Next</Radio.Button>
            }
            {is_pause
              ? <Radio.Button type="primary" onClick={startRun}><CaretRightOutlined /> Run</Radio.Button>
              : <Radio.Button type="primary" disabled><CaretRightOutlined /> Run</Radio.Button>
            }
            {!is_pause
              ? <Radio.Button type="primary" onClick={pauseRun}><PauseOutlined /> Pause</Radio.Button>
              : <Radio.Button type="primary" disabled><PauseOutlined /> Pause</Radio.Button>
            }


          </Radio.Group>
        </div>

        <div className="col-sm-6 col-md-3" style={{height:"50px"}}>
            <DataDisplay id='data_display' i={initial_idx} data={state_arr[initial_idx][1] != null ? state_arr[initial_idx][1] : {}} />
        </div>

      </div>
    );

}

export default MainComponent;
