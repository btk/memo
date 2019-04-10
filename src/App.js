import React, { Component } from 'react';
import './App.css';

import Line from './components/Line';
import Toolbar from './components/Toolbar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Note">
          <div className="Identifier">10/04/2019 &middot; Today</div>
          <Line>
          Living things are composed of Cells. Cells are very small (ususally between 1 and 100 μm) and can only be seen by magnification with a microscope. A distinction is made between Magnification and Resolution: Magnification is how large the image is compared to real life, whereas Resolution is the amount of information that can be seen in the image - defined as the smallest distance below which two discrete objects will be seen as one.
          </Line>
          <Line>
          To work out the size of an object viewed with a microscope, a Graticule is used. It is a small transparent ruler that becomes superimposed over the image. As the same sample may look to be different sizes under different magnifications, the Graticule must be calibrated.
          </Line>
          <Line>
          Actual Size, Image Size and Magnification are related by the formula:

          </Line>
          <Line>
          Light Microscopes, or Optical Microscopes, as they are more correctly termed, use light and several lenses in order to magnify a sample. Light from the Condenser Lens, and then through the Specimen where certain wavelengths are filtered to produce an image. The light then passes through the Objective Lens, which focuses it and can be changed in order to alter the magnification. Finally, the light passes through the Eyepiece Lens, which can also be changed to alter the magnification, and into the eye.

          </Line>
          <Line>
          It is advantageous to use an Electron Microscope in many situations because they offer a much higher resolution that Light Microscopes, so they can be used to image very small objects in detail, and also because of the 3D images that SEMs offer. However, samples must be placed in a vacuum as electrons are deflected by particles in the air, they are very expensive to buy and maintain, and preparing the samples requires a lot of skill to do.

          </Line>
          <Line>
          Chemical Fixation: Stabilising an organism/sample’s mobile macrostructure
          Cryofixation: Freezing the sample very rapidly to preserve its state
          Dehydration: Removing the water form a specimen, for example, by replacing it with ethanol
          Embedding: Embedding in resin, ready to be sectioned
          Sectioning: Cutting the sample into thin strips that are semitransparent to electrons, for example with a diamond knife
          Staining: Using heavy metals to scatter electrons and produce contrast
          Freeze Fracturing: Freezing the sample rapidly, and then fracturing it, for example, when viewing cell membranes
          Mounting: Placing the sample on a copper grid
          </Line>
        </div>
        <Toolbar/>
        <div id="trash">
          <textarea id="trashTextarea"></textarea>
        </div>
      </div>
    );
  }
}

export default App;
