import './App.css';

import React, { Component, useRef } from 'react';
import Dummy from './components/Dummy'
import SampleVis from './components/SampleVis'
import ClusterVis from './components/ClusterVis'
import PseudoCodeBox from './components/PseudoCodeBox'
import DataDisplay from './components/DataDisplay'
import MainComponent from './MainComponent'
import AlgoFactory from './AlgoFactory'
import { TextField } from '@material-ui/core'
import { pseudo_code, KMeans } from './ml/k-means'
import { range } from 'd3';
import { Form, Input, Button, Layout, Typography, message, Select } from 'antd';
import { DeploymentUnitOutlined, DownOutlined } from '@ant-design/icons';
const { Header, Footer, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;


var points = [
  [120, 20],
  [510, 30],
  [210, 290],
  [310, 390],
  [110, 190]
];
var k = 2;
var n_input, k_input;
var method;

function App() {

  var [state_arr, setStateArr] = React.useState(0);

  console.log("COMPUTE");
  console.log(k);
  // state_arr = KMeans(points, k);

  const clusterVisRef = React.useRef();
  const [refVisible, setRefVisible] = React.useState(false);

  function generateRandomPoints() {
    if (method == null) {
      message.error("Please select ML Algorithm");
    }

    var output_dict = AlgoFactory.generateDataDict("KMeansCluster", {
      n_input: n_input,
      k_input: k_input,
    });
    if (output_dict["state_arr"]) {
      points = output_dict["points"];
      k = output_dict["k"];
      setStateArr(output_dict["state_arr"]);
    }
  }

  React.useEffect(() => {
    console.log(clusterVisRef.current);
  }, [clusterVisRef]);

  const onFormChange = ({ numPoints, numCentroids }) => {
    if (numPoints) {
      n_input = parseInt(numPoints)
    } else if (numPoints === "") {
      n_input = undefined
    }

    if (numCentroids) {
      k_input = parseInt(numCentroids)
    } else if (numCentroids === "") {
      k_input = undefined
    }
  };

  return (
    <div>
      <Layout style={{height:"120vh"}}>

        <Header style={{display:"flex", flexDirection:"column", justifyContent: "flex-end"}}>
          <Title style={{color:"white"}} level={2}>
            <DeploymentUnitOutlined></DeploymentUnitOutlined> InteractiveML
          </Title>
        </Header>

        <Form.Item label="Category">
          <Select 
            onChange={(value) => {
              method=value;
            }} 
            name="category" 
            placeholder="Please select a category">
              {
                AlgoFactory.methods.map( function(method) {
                  return (
                    <Option value={method}>{method}</Option>
                  );
                })
              }
          </Select>
        </Form.Item>

        <Content style={{display:"flex", flexDirection:"column", justifyContent:"space-evenly", alignItems: "center"}}>
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
          {state_arr ? <MainComponent id='main_component' state_arr={state_arr} /> : null}
        </Content>

        <Footer style={{textAlign:'center'}}>InteractiveML ©2021 Created by InteractiveML Team</Footer>

      </Layout>
    </div>
  );

}

export default App;
