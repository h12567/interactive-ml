import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
    root: {
        background: "#001628"
    },
    input: {
        color: "white"
    }
};

function PseudoCodeBox({classes, code_box, idx}) {

    var itemList = [];
    for(var i = 0; i < code_box.length; i++) {
        var result_str = code_box[i][0];
        var indent = code_box[i][1];
        result_str = " ".repeat(indent* 3) + result_str;
        if (i == idx) {
            itemList.push(
                <tbody>
                    <TextField
                        value={result_str}
                        style={{width: 500}}
                        fullWidth={true}
                        defaultValue="color"
                        className={classes.root}
                        InputProps={{
                            className: classes.input
                        }}
                    />
                </tbody>
            );
        } else {
            itemList.push(
                <tbody>
                    <TextField
                        value={result_str}
                        style={{width: 500}}
                        fullWidth={true}
                        defaultValue="color"
                        color="red"
                        style={{
                            backgroundColor: "#EFF2F5"
                        }}
                        InputProps={{
                            style: {
                                color: "#001628"
                            }
                        }}
                    />
                </tbody>
            );
        }
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

PseudoCodeBox.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PseudoCodeBox);
