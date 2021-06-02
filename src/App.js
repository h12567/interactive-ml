import './App.css';

import React, { Component, useRef } from 'react';
import Dummy from './components/Dummy'
import SampleVis from './components/SampleVis'
import ClusterVis from './components/ClusterVis'
import PseudoCodeBox from './components/PseudoCodeBox'
import DataDisplay from './components/DataDisplay'
import { Button } from '@material-ui/core'
import { pseudo_code, KMeans } from './ml/k-means'

// const data = [
//   {year: 1980, efficiency: 24.3, sales: 8949000},
//   {year: 1985, efficiency: 27.6, sales: 10979000},
//   {year: 1990, efficiency: 28, sales: 9303000},
//   {year: 1991, efficiency: 28.4, sales: 8185000},
//   {year: 1992, efficiency: 27.9, sales: 8213000},
//   {year: 1993, efficiency: 28.4, sales: 8518000},
//   {year: 1994, efficiency: 28.3, sales: 8991000},
//   {year: 1995, efficiency: 28.6, sales: 8620000},
//   {year: 1996, efficiency: 28.5, sales: 8479000},
//   {year: 1997, efficiency: 28.7, sales: 8217000},
//   {year: 1998, efficiency: 28.8, sales: 8085000},
//   {year: 1999, efficiency: 28.3, sales: 8638000},
//   {year: 2000, efficiency: 28.5, sales: 8778000},
//   {year: 2001, efficiency: 28.8, sales: 8352000},
//   {year: 2002, efficiency: 29, sales: 8042000},
//   {year: 2003, efficiency: 29.5, sales: 7556000},
//   {year: 2004, efficiency: 29.5, sales: 7483000},
//   {year: 2005, efficiency: 30.3, sales: 7660000},
//   {year: 2006, efficiency: 30.1, sales: 7762000},
//   {year: 2007, efficiency: 31.2, sales: 7562000},
//   {year: 2008, efficiency: 31.5, sales: 6769000},
//   {year: 2009, efficiency: 32.9, sales: 5402000},
//   {year: 2010, efficiency: 33.9, sales: 5636000},
//   {year: 2011, efficiency: 33.1, sales: 6093000},
//   {year: 2012, efficiency: 35.3, sales: 7245000},
//   {year: 2013, efficiency: 36.4, sales: 7586000},
//   {year: 2014, efficiency: 36.5, sales: 7708000},
//   {year: 2015, efficiency: 37.2, sales: 7517000},
//   {year: 2016, efficiency: 37.7, sales: 6873000},
//   {year: 2017, efficiency: 39.4, sales: 6081000},
// ]


// const state_arr = [
//   [
//       0,
//       {'Variable Y' : '1'},
//       {
//           'data':  [{x: 12, y: 2, color: 'red'},
//                       {x: 51, y: 3, color: 'blue'},
//                       {x: 11, y: 19, color: 'red'},
//                       {x: 21, y: 29, color: 'red'},
//                       {x: 31, y: 39, color: 'red'}],
//           'centroids': [
//               {x: 1, y: 1, color: 'red'},
//               {x: 12, y: 21, color: 'blue'}
//           ]
//       }
//   ],
//   [
//     1,
//     {'Variable X' : '1'},
//     {
//         'data':  [{x: 12, y: 2, color: 'blue'},
//                     {x: 51, y: 3, color: 'blue'},
//                     {x: 11, y: 19, color: 'blue'},
//                     {x: 21, y: 29, color: 'blue'},
//                     {x: 31, y: 39, color: 'red'}],
//         'centroids': [
//           {x: 1, y: 1, color: 'red'},
//           {x: 12, y: 21, color: 'blue'}
//       ]
//     }
//   ],
//   [
//     2,
//     {'Variable Z' : '113431'},
//     {
//         'data':  [{x: 12, y: 2, color: 'red'},
//                     {x: 51, y: 3, color: 'red'},
//                     {x: 11, y: 19, color: 'red'},
//                     {x: 21, y: 29, color: 'red'},
//                     {x: 31, y: 39, color: 'red'}],
//                     'centroids': [
//                       {x: 1, y: 1, color: 'red'},
//                       {x: 12, y: 21, color: 'blue'}
//                   ]
//     }
//   ],
//   [
//     3,
//     {'Variable X' : '1'},
//     {
//         'data':  [{x: 12, y: 2, color: 'blue'},
//                     {x: 51, y: 3, color: 'blue'},
//                     {x: 11, y: 19, color: 'blue'},
//                     {x: 21, y: 29, color: 'blue'},
//                     {x: 31, y: 39, color: 'red'}],
//         'centroids': [
//           {x: 12, y: 11, color: 'red'},
//           {x: 32, y: 51, color: 'blue'}
//       ]
//     }
//   ],
//   [
//     1,
//     {'Variable Z' : '113431'},
//     {
//         'data':  [{x: 12, y: 2, color: 'red'},
//                     {x: 51, y: 3, color: 'red'},
//                     {x: 11, y: 19, color: 'red'},
//                     {x: 21, y: 29, color: 'red'},
//                     {x: 31, y: 39, color: 'red'}],
//         'centroids': [
//             {x: 12, y: 11, color: 'red'},
//             {x: 32, y: 51, color: 'blue'}
//         ]
//     }
//   ],
//   [
//     2,
//     {'Variable X' : '1'},
//     {
//         'data':  [{x: 12, y: 2, color: 'blue'},
//                     {x: 51, y: 3, color: 'blue'},
//                     {x: 11, y: 19, color: 'blue'},
//                     {x: 21, y: 29, color: 'blue'},
//                     {x: 31, y: 39, color: 'red'}],
//           'centroids': [
//             {x: 12, y: 11, color: 'red'},
//             {x: 32, y: 51, color: 'blue'}
//         ]
//     }
//   ],
//   [
//     3,
//     {'Variable Z' : '113431'},
//     {
//         'data':  [{x: 12, y: 2, color: 'red'},
//                     {x: 51, y: 3, color: 'red'},
//                     {x: 11, y: 19, color: 'red'},
//                     {x: 21, y: 29, color: 'red'},
//                     {x: 31, y: 39, color: 'red'}],
//           'centroids': [
//             {x: 42, y: 11, color: 'red'},
//             {x: 12, y: 51, color: 'blue'}
//         ]
//     }
//   ],
// ];

const points = [
  [12, 2],
  [51, 3],
  [21, 29],
  [31, 39],
  [11, 19]
];
const k = 2;

console.log("COMPUTE");
const state_arr = KMeans(points, k);

function App() {
  // var initial_idx = 0;
  const [initial_idx, setIntialIdx] = React.useState(0);
  var itemList = [];
  // const clusterVisRef = React.useRef();
  const clusterVisRef = React.useRef();
  const [refVisible, setRefVisible] = React.useState(false);
  for (var i = 0; i < state_arr.length; i ++) {
    itemList.push(
      <div class="row">
        <div class="column" width="30%" float="left">
          <ClusterVis data={state_arr[i][2] != null ? state_arr[i][2]['data'] : null} centroids={state_arr[i][2] != null ? state_arr[i][2]['centroids'] : null} />
        </div>
        <div class="column" width="30%" float="right">
          <PseudoCodeBox code_box={pseudo_code} idx={state_arr[i][0]} />
        </div>
        <div class="column" width="30%" float="right">
          <DataDisplay data={state_arr[i][1] != null ? state_arr[i][1] : {}} />
        </div>
      </div>
    );

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

  React.useEffect(() => {
    console.log(clusterVisRef.current);
  }, [clusterVisRef]);

  return (
    <div classname="App">
      {/* <Dummy /> */}
      {/* <SampleVis data={data} /> */}

      {/* <div>
        {itemList}
      </div>  */}
      
      <div class="row"  ref={r => { clusterVisRef.current = r; setRefVisible(!!r); }}>
        <div class="column" width="30%" float="left">
          <ClusterVis id='cluster_vis' i={initial_idx} data={state_arr[initial_idx][2]['data']} centroids={state_arr[initial_idx][2]['centroids']}
          />
        </div>
        <div class="column" width="30%" float="right">
          <PseudoCodeBox id='code_box' i={initial_idx} code_box={pseudo_code} idx={state_arr[initial_idx][0]} />
        </div>
        <div class="column" width="30%" float="right">
          <DataDisplay id='data_display' i={initial_idx} data={state_arr[initial_idx][1] != null ? state_arr[initial_idx][1] : {}} />
        </div>
      </div>
      <div>
        <Button onClick={decreaseIdx} color="primary"> PREV </Button>
        <Button onClick={increaseIdx} color="primary"> NEXT </Button>
      </div>

    </div>
  );

}

export default App;
