import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
    root: {
        background: "black"
    },
    input: {
        color: "white"
    }
};

function DataDisplay({classes, data}) {

    var itemList = [];

    for (const [key, value] of Object.entries(data)) {
        var result_str = key + " : " + value;
        itemList.push(
            <tbody>
                <TextField 
                    value={result_str}
                />
            </tbody>
        )
    }

    return (
        // <svg
        //     ref={ref}
        //     id="pseudo-code"
        //     width="520"
        //     height="520"
        // >
        // </svg>
        <div>
            {itemList}
        </div>
    );
}   

DataDisplay.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataDisplay);
