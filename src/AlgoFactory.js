import { message } from 'antd';

import ClusterVis from './components/ClusterVis'
import { pointers } from 'd3';
import { kmeans_pseudo_code, KMeans } from './ml/k-means';
import { hierarchical_pseudo_code, Hierarchical } from './ml/hierarchical';

let HierarchicalCluster = "HierarchicalCluster";
let KMeansCluster = "KMeansCluster"

class AlgoFactory {
    static selectVis(method, state_arr, initial_idx) {
        if (method == KMeansCluster) {
            return (
                <ClusterVis id='cluster_vis' i={initial_idx} data={state_arr[initial_idx][2]['data']} centroids={state_arr[initial_idx][2]['centroids']}
                />
            );
        } else if (method == HierarchicalCluster) {
            return (
                <ClusterVis id='cluster_vis' i={initial_idx} data={state_arr[initial_idx][2]['data']} centroids={state_arr[initial_idx][2]['centroids']}
                />
            );
        }
    }

    static _randomGenerateHelper(n_input, k_input) {
        var points = [];
        for (var i = 0; i < n_input; i ++) {
          points.push([
            Math.random() * 1000 % 900 + 50, Math.random() * 1000 % 900 + 50 // [50, 950]
          ]);
        }
        return points;
    }

    static generateDataDict(method, input_dict) {
        var n_input = input_dict["n_input"];
        var k_input = input_dict["k_input"];
        if (n_input == null || k_input == null) {
            message.error("please input number of points & centroids");
            return {};
        }
        var points = this._randomGenerateHelper(n_input, k_input);

        if (method == KMeansCluster) {
            return {
                k: k_input,
                points: points,
                state_arr: KMeans(points, k_input)
            };
        } else if (method == HierarchicalCluster) {
            return {
                k: k_input,
                points: points,
                state_arr: Hierarchical(points, k_input)
            }
        }
    }

    static getPseudoCode(method) {
        if (method == KMeansCluster) {
            return kmeans_pseudo_code;
        } else if (method == HierarchicalCluster) {
            return hierarchical_pseudo_code;
        }
    }
}

AlgoFactory.methods = [KMeansCluster, HierarchicalCluster];

export default AlgoFactory;

