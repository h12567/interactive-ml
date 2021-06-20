import util from 'util'

var pseudo_code = [
    ["Initialize K centroids", 1],
    ["While centroid positions change", 1],
    ["Assign each point to its closest centroid", 2],
    ["Compute new centroid as the average position of each cluster", 2]
]

function euclidean(v1, v2) {
    var total = 0;
    for (var i = 0; i < v1.length; i++) {
        total += Math.pow(v2[i] - v1[i], 2);      
    }
    return Math.sqrt(total);
}

function weighted_random(items, weights) {
    var i;

    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0;
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}

function generateVisualizedData(points, centroids, assignment) {
    // the default colors, now limited to 7 colors of the rainbow
    const colors = ["red", "orange", "yellow", "green", "blue", "indigo"];
    var default_color = "violet";
    
    // generate data array
    var data = [];
    for (var i = 0; i < assignment.length; i++) {
        var color_use = assignment.length > i && assignment[i] != null ? colors[assignment[i]] : default_color;
        data.push({
            "x": points[i][0], "y": points[i][1],
            "color": color_use
        });
    }

    // generate centroid array
    var centroid_data = [];
    for (var i = 0; i < centroids.length; i++) {
        centroid_data.push({
            "x": centroids[i][0], "y": centroids[i][1],
            "color": colors[i]
        });
    }

    return {
        "data": data,
        "centroids": centroid_data
    }
}

// Structure of state_arr
// Array of 3 elements:
// (index in pseudocode, variables to display, updated data for visualization)

// Example:
// [
//     0,
//     {'Hoang name' : '(1, 2)'},
//     {
//         'data':  [{x: 12, y: 2, color: 'red'},
//                     {x: 51, y: 3, color: 'blue'},
//                     {x: 11, y: 19, color: 'red'},
//                     {x: 21, y: 29, color: 'red'},
//                     {x: 31, y: 39, color: 'red'}],
//         'centroids': [
//             {x: 1, y: 1, color: 'red'},
//             {x: 12, y: 21, color: 'blue'}
//         ]
//     }
// ]

function KMeans(inp_points, inp_k) {
    // remove duplicated points
    var points = Array.from(new Set(inp_points.map(JSON.stringify)), JSON.parse);
    // number of cluster cannot be larger than the number of points
    var k = Math.min(points.length, inp_k);
    var state_arr = [];
    function forgyInit(points, k) {
        // randomly choose k points as k centroids
        var centroids = points.slice(0);
        centroids.sort(function() {
            return (Math.round(Math.random()) - 0.5);
         });
        var res = centroids.slice(0, k);
        return res;
    }
    function kMeansPlusPlus(points, k) {
        // initialize centroids according to k-means++ strategy
        var centroids = [];
        for (var i = 0; i < k; i++) {
            if (i == 0) {
                // random initialization for first centroid
                var first_centroid = points[Math.floor(Math.random() * points.length)];
                centroids.push(first_centroid);
            } else {
                // calculate distance from all points to its closest centroid
                var min_dist_arr = [], total = 0;
                for (var j = 0; j < points.length; j++) {
                    var min = Infinity;
                    for (var l = 0; l < centroids.length; l++) {
                        var dist = euclidean(points[j], centroids[l]);
                        if (dist < min) {
                            min = dist;
                        }
                    }
                    min_dist_arr.push(min);
                    total += min;
                }
                // normalize minimum distance array
                for (var j = 0; j < min_dist_arr.length; j++) {
                    min_dist_arr[j] /= total;
                }
                var indices = Array.from({length: points.length}, (item, index) => index);
                var next_index = weighted_random(indices, min_dist_arr);
                var next_centroid = points[next_index];
                centroids.push(next_centroid);
            }
        }
        return centroids;
    }


    function classify(centroids, point) {
        var min = Infinity,
        index = 0;

        for (var i = 0; i < centroids.length; i++) {
            var dist = euclidean(point, centroids[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }

        return index;
    }

    function cluster(points, k) {
        k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

        var assignment = new Array(points.length);
        var clusters = new Array(k);
     
        var centroids = kMeansPlusPlus(points, k);

        state_arr.push(
            [
                0, 
                null,
                generateVisualizedData(points, centroids, assignment)
            ]
        )

        var iterations = 0;
        var movement = true;
        while (movement) {
           state_arr.push(
               [
                   1, 
                   {'movement': movement},
                   generateVisualizedData(points, centroids, assignment)
               ]
           )
           // update point-to-centroid assignments
           for (var i = 0; i < points.length; i++) {
              assignment[i] = classify(centroids, points[i]);
           }
           state_arr.push(
                [
                    2,
                    {'assignment': assignment},
                    generateVisualizedData(points, centroids, assignment)
                ]
            )
     
           // update location of each centroid
           movement = false;
           for (var j = 0; j < k; j++) {
              var assigned = [];
              for (var i = 0; i < assignment.length; i++) {
                 if (assignment[i] == j) {
                    assigned.push(points[i]);
                 }
              }
     
              if (!assigned.length) {
                 continue;
              }
     
              var centroid = centroids[j];
              var newCentroid = new Array(centroid.length);
     
              for (var g = 0; g < centroid.length; g++) {
                 var sum = 0;
                 for (var i = 0; i < assigned.length; i++) {
                    sum += assigned[i][g];
                 }
                 newCentroid[g] = sum / assigned.length;
     
                 if (newCentroid[g] != centroid[g]) {
                    movement = true;
                 }
              }
     
              centroids[j] = newCentroid;
              clusters[j] = assigned;
           }

           state_arr.push(
                [
                    3,
                    null,
                    generateVisualizedData(points, centroids, assignment)
                ]
            )

        }

        state_arr.push(
            [
                1, 
                {'movement': movement},
                generateVisualizedData(points, centroids, assignment)
            ]
        )
     
        return clusters;
     }
     
    cluster(points, k);

    return state_arr;
}

const points = [[1, 2],
               [2, 1],
               [-2, -1],
               [-1, -2]];
const k = 2;

var global_state_arr = KMeans(points, k);

console.log(util.inspect(global_state_arr, true, 70, true));

export { pseudo_code, KMeans};
