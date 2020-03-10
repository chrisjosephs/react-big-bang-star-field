# react-big-bang-star-field

> ✨ Canvas-based Big Bang Star Field animation for React.

[![NPM](https://img.shields.io/npm/v/react-starfield-animation.svg)](https://www.npmjs.com/package/react-big-bang-star-field) [![Build Status](https://travis-ci.org/chrisjosephs/react-big-bang-starfield-animation.svg?branch=master)](https://travis-ci.org/chrisjosephs/react-sbig-bang-starfield) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Demo](https://raw.githubusercontent.com/chrisjosephs/react-big-bang-star-field/master/example/example.gif)](https://chrisjosephs.github.io/react-big-bang-star-field-/)

## Install

```bash
npm install --save react-big-bang-star-field
```

## Usage

Check out the [demo](https://chrisjosephs.github.io/react-big-bang-starfield/).

```tsx
import React, { Component } from 'react'

import BigBangStarField from 'react-big-bang-star-field'

class Example extends Component {
  render () {
    return (
      <BigBangStarField
          numStars={666}
          maxStarSpeed={1}
          scale={4}
        style={{
          position: 'absolute',
          numStars: 666,
          maxStarSpeed: 1,
          scale: 4,
          width: '100%',
          height: '100%'
        }}
      />
    )
  }
}
```

## Props

| Property      | Type               | Default                              | Description                                                                                                                                  |
|:----------------|------------------|:-------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| `numStars`      | number           | 333                                  | Number of stars to use. |
| `maxStarSpeed`  | number           | 1                                    | Maximum star speed. |
| `scale`         | number           | 4.0                                  | Scaling factor for canvas  |
| `size`          | number           | height:500, width: 500               | Size (will be determined by sizeMe when this is fixed in tsx version) |
| `...`           | ...              | undefined                            | Any other props are applied to the root canvas element. |

Note that the canvas size will automatically be inferred based on available space via [react-sizeme](https://github.com/ctrlplusb/react-sizeme), so it should be really easy to use this component as a fullscreen background as in the [demo](https://chrisjosephs.github.io/react-big-bang-starfield/)).

## Related
- [zembrzuski js starfield](https://codepen.io/zembrzuski/pen/zRzMab) - Canvas based js starfield codepen
- [react-particle-animation](https://github.com/transitive-bullshit/react-particle-animation) - Canvas-based particle animation for React, that also uses sizeMe
- [react-starfield-animation](https://github.com/transitive-bullshit/react-starfield-animation) - Canvas-based starfield particle animation for React.
## License

MIT © [chrisjosephs](https://github.com/chrisjosephs)

This module was bootstrapped with [create-react-library](https://github.com/transitive-bullshit/create-react-library).
