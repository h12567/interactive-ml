import React, { Component } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';

function ClusterVis({data}) {

    const ref = useD3(
        (svg) => {
            var margin = {top: 10, right: 30, bottom: 40, left: 50},
                width = 520 - margin.left - margin.right,
                height = 520 - margin.top - margin.bottom;

            
            while (d3.select("#k-means").firstChild) {
                d3.select('#k-means').removeChild(svg.lastChild);
            }

            // var svg = d3.select("#k-means")
            // .append("svg")
            //     .attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom)
            // .append("g")
            //     .attr("transform",
            //         "translate(" + margin.left + "," + margin.top + ")")
                    
            svg
            .append("rect")
                .attr("x",0)
                .attr("y",0)
                .attr("height", height)
                .attr("width", height)
                .style("fill", "EBEBEB")
            
            var x = d3.scaleLinear()
                .domain([0*0.95, 100*1.001])
                .range([ 0, width ])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
                .select(".domain").remove()

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([-0.001, 100*1.01])
                .range([ height, 0])
                .nice()
            svg.append("g")
                .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
                .select(".domain").remove()

            // Customization
            svg.selectAll(".tick line").attr("stroke", "white")

            // Add X axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width/2 + margin.left)
                .attr("y", height + margin.top + 20)
                .text("Sepal Length");

            // Y axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -margin.top - height/2 + 20)
                .text("Petal Length")

            // Color scale: give me a specie name, I return a color
            var color = d3.scaleOrdinal()
                .domain(["blue", "red", "virginica" ])
                .range([ "#F8766D", "#00BA38", "#619CFF"])

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.x); } )
                .attr("cy", function (d) { return y(d.y); } )
                .attr("r", 5)
                .style("fill", function (d) { return color(d.color) } )

        },
        [data]
    );

    return (
        // <div
        //     id="k-means"
        // >
        <svg 
            ref={ref}
            id="k-means"
            width="520"
            height="520"
        >

        </svg>
        // </div>
    );
}

export default ClusterVis;
