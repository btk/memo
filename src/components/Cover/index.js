import React, { Component } from 'react';
import './style.css';
import makeid from '../../js/makeid';
import progen from '../../js/progen';

class App extends Component {

  getSquare(x, y){
    return (
      <g transform={`translate(${x*this.squareSize},${y*this.squareSize})`}>
          <rect fill={`hsl(${progen(this.key, x * 7 + y)}, 54%, 60%)`} id="bg" x="0" y="0" width={this.squareSize} height={this.squareSize}></rect>
      </g>
    )
  }

  renderSquares(numOfColumns, numOfRows){
    let squareArray = [];
    let i = 0;
    while(i < numOfRows){
      let j = 0;
      while(j < numOfColumns){
        squareArray.push(this.getSquare(i, j));
        j++;
      }
      i++;
    }
    return squareArray;
  }

  render() {
    this.squareOffset = 30;
    this.squareSize = 60;
    this.key = "thisismykey";

    const types = [
      "sqType1",
      "sqType2",
      "sqType3",
      "sqType4",
      "sqType5",
      "sqType6",
      "sqType7"
    ];

    const colors = [
      "#fe4947",
      "#fec958",
      "#18333b",
      "#fdebc3",
      "#89d8d0"
    ];

    return (
      <>
        <svg width={180} height={300} viewBox="0 0 180 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <title>Memo Cover</title>
          <desc>Created by Memo smart note taking app.</desc>
          <defs>
              <rect id="path-1" x="30" y="0" width="180" height="300"></rect>
          </defs>
          <g id="Notebook" transform={`translate(${-this.squareOffset}, 0.000000)`}>
              <mask id="mask-2" fill="white">
                  <use xlinkHref="#path-1"></use>
              </mask>
              <use id="Mask" fill="#D8D8D8" xlinkHref="#path-1"></use>
              <g id="Carrier" mask="url(#mask-2)">
                {this.renderSquares(300 / this.squareSize, 180 / this.squareSize + 1)}
              </g>
          </g>
        </svg>
      </>
    );
  }
}

export default App;
