# react-big-bang-star-field

> ✨ Canvas-based Big Bang Star Field animation for React.

[![NPM](https://img.shields.io/npm/v/react-big-bang-star-field.svg)](https://www.npmjs.com/package/react-big-bang-star-field)  [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Demo](https://raw.githubusercontent.com/chrisjosephs/react-big-bang-star-field/master/example/example.gif)](https://chrisjosephs.github.io/react-big-bang-star-field/)

## Install

```bash
npm install --save react-big-bang-star-field
```

## Usage

Check out the [demo](https://chrisjosephs.github.io/react-big-bang-star-field/).

Demo includes background image div

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
            width: '100%',
            height: '100%'
          }}
        starColor={"217, 160, 244"}
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
| `size`          | number           | width: x, height: y                  | Size (determined by sizeMe) |
| `starColor`     | number           | 217, 160, 244                        | Color of stars produced |
| `...`           | ...              | undefined                            | Any other props are applied to the root canvas element. |

Note that the canvas size will automatically be inferred based on available space via [react-sizeme](https://github.com/ctrlplusb/react-sizeme), so it should be really easy to use this component as a fullscreen background as in the [demo](https://chrisjosephs.github.io/react-big-bang-star-field/)).

## Related
- [zembrzuski js starfield](https://codepen.io/zembrzuski/pen/zRzMab) - Canvas based js starfield codepen
- [react-particle-animation](https://github.com/transitive-bullshit/react-particle-animation) - Canvas-based particle animation for React, that also uses sizeMe
- [react-starfield-animation](https://github.com/transitive-bullshit/react-starfield-animation) - Canvas-based starfield particle animation for React.
## License

MIT © [chrisjosephs](https://github.com/chrisjosephs)

Background stars image in example from [piqsels](https://www.piqsels.com/) released under public domain license

This module was bootstrapped with [create-react-library](https://github.com/transitive-bullshit/create-react-library).

