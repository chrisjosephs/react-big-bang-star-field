import React, { Component } from 'react'

import BigBangStarField from 'react-big-bang-star-field'

import background from './piqsels.com-id-fvkta.jpg'

export default class App extends Component {
  render () {
    return (
      <div
        style={{
          background: `url(${background})`,
          backgroundSize: 'cover',
          display: 'flex',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <a href='https://github.com/chrisjosephs/react-big-bang-star-field'>
          <img
            src={""}
            alt='Fork me on GitHub'
            style={{
              position: 'absolute',
              zIndex: 100,
              top: 0,
              right: 0
            }}
          />
        </a>

        <h1
          style={{
            color: '#fff',
            fontSize: '2.5em',
            fontFamily: 'Quicksand, "Helvetica Neue", sans-serif',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)'
          }}
        >
          React Big Bang Star Field Animation
        </h1>

        <BigBangStarField
          numStars={666}
          maxStarSpeed={1}
          scale={4}
          starColor={"217, 160, 244"}
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      </div>
    )
  }
}
