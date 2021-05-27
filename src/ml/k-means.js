import util from 'util'

var pseudo_code = [
    ("calculate random centroids", 1),
    ("while movement", 1),
    ("update point to centroid assignment", 2),
    ("update centroid locations", 2)
]

function euclidean(v1, v2) {
    var total = 0;
    for (var i = 0; i < v1.length; i++) {
        total += Math.pow(v2[i] - v1[i], 2);      
    }
    return Math.sqrt(total);
}

function generateVisualizedData(points, centroids, assignment) {
    // the default colors, now limited to 7 colors of the rainbow
    const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    
    // generate data array
    var data = [];
    for (var i = 0; i < assignment.length; i++) {
        data.push({
            "x": points[i][0], "y": points[i][1],
            "color": colors[assignment[i]]
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

function KMeans(points, k) {
    // randomly choose k points as k centroids
    var state_arr = [];
    function randomCentroids(points, k) {
        var centroids = points.slice(0);
        centroids.sort(function() {
            return (Math.round(Math.random()) - 0.5);
         });
        var res = centroids.slice(0, k);
        return res;
    }

    function classify(centroids, point) {
        console.log("Point")
        console.log(point)
        var min = Infinity,
        index = 0;

        for (var i = 0; i < centroids.length; i++) {
            var dist = euclidean(point, centroids[i]);
            console.log("Distance to centroid")
            console.log(centroids[i])
            console.log(dist)
            console.log("-----")
            if (dist < min) {
                min = dist;
                index = i;
            }
        }

        return index;
    }

    function cluster(points, k) {
        k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));
     
        var centroids = randomCentroids(points, k);
        console.log("Initial centroids")
        console.log(util.inspect(centroids))
        state_arr.push(
            [
                0, 
                null,
                null
            ]
        )
     
        var assignment = new Array(points.length);
        var clusters = new Array(k);
     
        var iterations = 0;
        var movement = true;
        while (movement) {
           state_arr.push(
               [
                   1, 
                   {'movement': movement},
                   null
               ]
           )
           // update point-to-centroid assignments
           for (var i = 0; i < points.length; i++) {
              assignment[i] = classify(centroids, points[i]);
           }
           console.log("Assignments")
           console.log(util.inspect(assignment))
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

        }
     
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

console.log(util.inspect(global_state_arr, true, 7, true));
