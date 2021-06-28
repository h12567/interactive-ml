import util from 'util'

var hierarchical_pseudo_code = [
  ["Assign each point into its own cluster", 1],
  ["While number of clusters is greater than K", 1],
  ["Find the closest pair of clusters", 2],
  ["Merge them into a single cluster", 2]
]

const colors = ["darkslategray", "seagreen", "darkred", "olive", "darkblue", "maroon3", "red", "darkorange", "gold",
"lawngreen", "mediumspringgreen", "royalblue", "aqua", "deepskyblue", "blue", "orchid", "fuchsia", "khaki", "lightsalmon"];
const default_color = "silver";

function euclidean(v1, v2) {
  var total = 0;
  for (var i = 0; i < v1.length; i++) {
      total += Math.pow(v2[i] - v1[i], 2);      
  }
  return Math.sqrt(total);
}


// state_arr = {
// 	pseudo_code_index,
// 	variables_to_display,
// 	visualized_data
// }
//
// variables_to_display:
// 1. Assign each point into its own cluster: null
// 2. While centroid positions change: null
// 3. Merge the pair of clusters that take the smallest distance between their centroid:
// {
// 	"merge": [c1, c2]
// }
// 4. Compute new centroid as the average position of each cluster
// {
// 	c12: new_centroid_location
// }
//
// input points for algo:
// [
// 		{x: 12, y: 2, color: 'unprocessed', id: 'p1'},    // point data
// 		{x: 51, y: 3, color: 'blue', id: 'p2'},
// 		{x: 11, y: 19, color: 'unprocessed', id: 'p3'},
// 		{x: 21, y: 29, color: 'red', id: 'p4'}
// ]
//
// visualized_data:
// {
// 	'data':  {
// 			p1: {x: 12, y: 2, color: 'unprocessed'},    // point data
// 			p2: {x: 51, y: 3, color: 'blue'},
// 			p3: {x: 11, y: 19, color: 'unprocessed'},
// 			p4: {x: 21, y: 29, color: 'red'}
//   },
//   'centroids': [
// 						{x: 1, y: 1, color: 'red'},
//             {x: 12, y: 21, color: 'blue'}],
// 	'dendogram':
// 			[
// 				{
// 						"left": {
// 								"left": {...},
// 								"right": "p1",
// 							  "height": 2
// 						},
// 						"right": "p2"
// 						"color": "red", # root of red tree
// 						"height": 4
// 				},
// 				{
// 						"left": {
// 							"left": ...,
// 							"right": ...,
// 							"height": 3,
// 							"color": "blue" # root of blue tree
// 						},
// 						"right": {
// 							"left": ...,
// 							"right: ...,
// 							"height": 3,
// 							"color": "orange" # root of orange tree
// 						},
// 						"height": 5
// 				}
// 	   ]
// }

function generateVisualizedData(points, centroids, assignments, dendogram) {
  var data = [];
  for (var i = 0; i < assignments.length; i++) {
    var color_use = dendogram[assignments[i]]["color"] !== "unprocessed" ? dendogram[assignments[i]]["color"] : default_color;
    data.push({
      "x": points[i][0], "y": points[i][1],
      "color": color_use
    })
  }

  // generate centroid array
  var centroid_data = [];
  for (var i = 0; i < centroids.length; i++) {
      if (dendogram[i]["color"] !== "unprocessed") {
        var color_use = dendogram[i]["color"];
        centroid_data.push({
          "x": centroids[i][0], "y": centroids[i][1],
          "color": color_use
        });
      }
  }

  return {
    "data": data,
    "centroids": centroid_data,
    "dendogram": Object.assign({}, dendogram)
  }
}


function Hierarchical(inp_points, inp_k) {
  // remove duplicated points
  var points = Array.from(new Set(inp_points.map(JSON.stringify)), JSON.parse);
  // number of cluster cannot be larger than the number of points
  var k = Math.min(points.length, inp_k);

  var state_arr = [];

  function cluster(points, k) {

    var num_non_singleton = 0;

    // initialize
    var [dendogram, centroids, assignments] = [[], [], []];
    for (var i = 0; i < points.length; i++) {
      dendogram.push({
        "left": i,
        "right": {},
        "color": "unprocessed",
        "height": 0,
        "size": 1
      });
      centroids.push(points[i]);
      assignments.push(i)
    }

    function get_closest_cluster_pairs(dendogram, centroids) {
      var min = Infinity; var min_i = 0; var min_j = 0;
      for (var i = 0; i < dendogram.length; i++) {
        for (var j = i+1; j < dendogram.length; j++) {
          var dist = euclidean(centroids[i], centroids[j]);
          if (dist < min) {
            [min, min_i, min_j] = [dist, i, j];
          }
        }
      }

      return [min_i, min_j];
    }


    function merge_clusters(dendogram, centroids, assignments, min_i, min_j) {      
      // assign color to new cluster
      var n_centroids = dendogram.length;
      var [cluster_i, cluster_j] = [dendogram[min_i], dendogram[min_j]];
      var color = default_color;
      if (cluster_i["color"] !== "unprocessed") {
        color = cluster_i["color"];
      } else if (cluster_j["color"] !== "unprocessed") {
        color = cluster_j["color"];
      } else {
        color = colors[num_non_singleton];
        num_non_singleton += 1;
      }

      // compute height and size
      var height = Math.max(cluster_i["height"], cluster_j["height"]) + 1;
      var size = cluster_i["size"] + cluster_j["size"];

      delete cluster_i["color"];
      delete cluster_j["color"];

      var merged_cluster = {
        "left": cluster_i,
        "right": cluster_j,
        "color": color,
        "height": height,
        "size": size
      }
      dendogram.splice(min_j, 1); dendogram.splice(min_i, 1);
      dendogram.push(merged_cluster);

      // compute merged centroid as the weighted average of 2 clusters
      var merged_centroid = new Array(centroids[0].length);
      for (var g = 0; g < centroids[0].length; g++) {
        merged_centroid[g] = (centroids[min_i][g] * cluster_i["size"] + centroids[min_j][g] * cluster_j["size"]) / (cluster_i["size"] + cluster_j["size"]);
      }
      centroids.splice(min_j, 1); centroids.splice(min_i, 1);
      centroids.push(merged_centroid);

      var cluster_map_arr = Array.from({length: n_centroids}, (item, index) => index);
      cluster_map_arr.splice(min_j, 1); cluster_map_arr.splice(min_i, 1);

      var cluster_map = {};
      cluster_map[min_i] = cluster_map_arr.length;
      cluster_map[min_j] = cluster_map_arr.length;

      for (var i=0; i<cluster_map_arr.length; i++) {
        cluster_map[cluster_map_arr[i]] = i
      }

      for (var i=0; i < assignments.length; i++) {
        assignments[i] = cluster_map[assignments[i]];
      }

      // return 2 clusters that were merged
      return min_i, min_j;
    }

    state_arr.push(
      [
        0,
        null,
        generateVisualizedData(points, centroids, assignments, dendogram)
      ]
    )

    var num_clusters = points.length;
    while (num_clusters > k) {
      state_arr.push(
        [
          1,
          null,
          generateVisualizedData(points, centroids, assignments, dendogram)
        ]
      )
      var x = get_closest_cluster_pairs(dendogram, centroids);
      var [min_i, min_j] = [x[0], x[1]];

      state_arr.push(
        [
          2, 
          {
            "2 closest clusters": [min_i, min_j]
          },
          generateVisualizedData(points, centroids, assignments, dendogram)
        ]
      )

      // console.log("Merge cluster " + min_i.toString() + " and " + min_j.toString());

      // console.log("Before merging");
      // console.log(util.inspect(dendogram, true, 70, true));
      // console.log(util.inspect(centroids, true, 70, true));
      // console.log(util.inspect(assignments, true, 70, true));
      merge_clusters(dendogram, centroids, assignments, min_i, min_j);
      // console.log("After merging");
      // console.log(util.inspect(dendogram, true, 70, true));
      // console.log(util.inspect(centroids, true, 70, true));
      // console.log(util.inspect(assignments, true, 70, true));
      num_clusters -= 1;

      state_arr.push(
        [
          3,
          {
            "merge clusters": [min_i, min_j]
          },
          generateVisualizedData(points, centroids, assignments, dendogram)
        ]
      )

    }

  }

  cluster(points, k);

  return state_arr;
}

const points = [[1, 2],
               [2, 1],
               [-2, -1],
               [-1, -2]];
const k = 1;

var global_state_arr = Hierarchical(points, k);

console.log(util.inspect(global_state_arr, true, 70, true));

export { hierarchical_pseudo_code, Hierarchical};