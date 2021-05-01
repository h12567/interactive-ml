import { euclidean } from './distance';

var pseudo_code = [
    ("calculate random centroids", 1),
    ("while movement", 1),
    ("update point to centroid assignment", 2),
    ("update centroid locations", 2)
]


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
    var state_arr = [];
    function randomCentroids(points, k) {
        var centroids = points.slice(0);
        centroids.sort(function() {
            return (Math.round(Math.random()) - 0.5);
         });
        res = centroids.slice(0, k);
        return res;
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
     
        var centroids = randomCentroids(points, k);
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
              assignment[i] = classify(points[i], centroids);
           }

           state_arr.push(
                [
                    2,
                    {'assignment': assignment},
                    null
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

global_state_arr = KMeans();

print(global_state_arr);


