import * as React from 'react';
import {createRef, PureComponent} from "react";

const raf = require('raf');


export interface Props {
  numStars: number,
  maxStarSpeed: number,
  starOpacity?: number,
  offsetX?: number,
  offsetY?: number,
  scale: number,
  style?: object,
  size: SizeMe,
  canvasRef?: object,
  backgroundImage?: string,
  starColor: string
}

export interface SizeMe {
  width: number,
  height: number
}


class BigBangStarField extends PureComponent <Props> {

  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  state: { containerWidth: number; containerHeight: number }
  starField: object;
  constructor(props: Props) {
    super(props);
    this.containerRef = createRef();
    this.canvasRef = createRef();
    this.state = { containerWidth: window.innerWidth, containerHeight: window.innerHeight };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  static defaultProps = {
    numStars: 333,
    maxStarSpeed: 1,
    scale: 4,
    style: {},
    starColor: "217, 130, 244"
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  render() {
    const {
      numStars,
      maxStarSpeed,
      size,
      scale,
      style,
      starColor,
      ...rest
    } = this.props
    let div = <>
      <div className={'BigBangStarFieldContainer'}
           ref={this.containerRef}
           style={{
             overflow: 'hidden',
             ...style
           }}
           {...rest}
      >
        <canvas
          ref={this.canvasRef}
          width={this.state.containerWidth}
          height={this.state.containerHeight}
        />
      </div>
    </>;
    return div
  }

  _draw() {
    if (!this.canvasRef) return;
    const ctx = this.canvasRef.current!.getContext('2d');

    /**
     *
     * @param x {number} x coordinate of the star
     * @param y {number} y coordinate of the star
     * @param maxSpeed {number} maxSpeed
     * opacity {number} opacity
     * speed {number} actual speed
     * @constructor
     * @this Star
     */
    class Star {
      x: number;
      y: number;
      maxSpeed: number;
      slope: number;
      opacity: number;
      speed: number;
      width: number;
      distanceTo: (originX: number, originY: number) => number;
      resetPosition: (_x: number, _y: number, _maxSpeed: number) => Star;

      constructor(x: number, y: number, maxSpeed: number) {
        this.width = 0.5;
        this.x = x;
        this.y = y;
        this.slope = y / x;
        this.opacity = 0;
        this.speed = Math.max(Math.random() * maxSpeed, 1);
      }
    }

    Star.prototype.distanceTo = function (originX: number, originY: number) {
      return Math.sqrt(Math.pow(originX - this.x, 2) + Math.pow(originY - this.y, 2));
    };

    Star.prototype.resetPosition = function (_x: number, _y: number, _maxSpeed: number) {
      Star.apply(this, arguments);
      return this;
    };

    /**
     * Star Factory
     * @type {Object}
     */
    var StarFactory = {
      /**
       * Returns a random star within a region of the space.
       *
       * @param  {number} minX coordinate of the region
       * @param  {number} minY coordinate of the region
       * @param  {number} maxX coordinate of the region
       * @param  {number} maxY coordinate of the region
       *
       * @return {Star} The random star
       */
      getRandomStar: function (minX: number, minY: number, maxX: number, maxY: number, maxSpeed: number) {
        let coords = StarFactory.getRandomPosition(minX, minY, maxX, maxY);
        return new Star(coords.x, coords.y, maxSpeed);
      },

      /**
       * Gets a random (x,y) position within a bounding box
       *
       *
       * @param  {number} minX coordinate of the region
       * @param  {number} minY coordinate of the region
       * @param  {number} maxX coordinate of the region
       * @param  {number} maxY coordinate of the region
       *
       * @return {Object} An object with random {x, y} positions
       */
      getRandomPosition: function (minX: number, minY: number, maxX: number, maxY: number) {
        return {
          x: Math.floor((Math.random() * maxX) + minX),
          y: Math.floor((Math.random() * maxY) + minY)
        };
      }
    };

    /**
     * StarField
     * @param {sizeMe} containerSize size of the container
     * @param {scale} number upscale canvas drawing
     */
    class StarField {
      _updateStarField: () => void;
      _renderStarField: () => void;
      maxStarSpeed: number;
      numStars: number;
      starField: any;
      _tick: any;
      render: (numStars: number, maxStarSpeed: number) => void;
      _initScene: (this: any, numStars: number) => void;
      _adjustCanvasSize: (width: number, height: number) => void;
      _watchCanvasSize: (elapsedTime: number) => void;
      prevCheckTime: number;
      oldWidth: number;
      oldHeight: number;
      scale: number;
      starColor: string;
      rafId: any;
      canvasWidth: number;
      canvasHeight: number;
      state: any;
      called: boolean;
      constructor(state: any, scale: number, starColor: string) {
        this.canvasWidth = state.containerWidth / scale;
        this.canvasHeight = state.containerHeight / scale;
        this.starField = [];
        this.scale = scale;
        this.starColor = starColor;
        ctx!.scale(this.scale, this.scale);
      }
    }

    StarField.prototype._updateStarField = function () {
      var i,
        star,
        randomLoc,
        increment;

      for (i = 0; i < this.numStars; i++) {
        star = this.starField[i];
        increment = Math.min(star.speed, Math.abs(star.speed / star.slope));
        star.x += (star.x > 0) ? increment : -increment;
        star.y = star.slope * star.x;

        star.opacity += star.speed / 150;
        star.opacity += star.speed / 150;

        star.width = 0.5 + ((star.distanceTo(0, 0)) * 0.002);

        if ((Math.abs(star.x) > this.canvasWidth / 2) ||
          (Math.abs(star.y) > this.canvasHeight / 2)) {

          randomLoc = StarFactory.getRandomPosition(
            -this.canvasWidth / 10, -this.canvasHeight / 10,
            this.canvasWidth / 5, this.canvasHeight / 5
          );
          star.resetPosition(randomLoc.x, randomLoc.y, this.maxStarSpeed);
        }
      }
    };


    StarField.prototype._renderStarField = function () {
      var i,
        star;
      ctx!.fillStyle = "rgba(255, 0, 0, 0)";
      let width = this.canvasWidth;
      let height = this.canvasHeight;
      ctx!.clearRect(0, 0, width, height);
      for (i = 0; i < this.numStars; i++) {
        star = this.starField[i];
        ctx!.fillStyle = "rgba(" + this.starColor + ", " + star.opacity + ")";
        ctx!.beginPath();
        ctx!.arc(star.x + width / 2, star.y + height / 2, star.width, 0, 2 * Math.PI, true);
        /** this is might expensive
         ctx!.shadowColor = '#00ff00';
         ctx!.shadowBlur = 20;
         ctx!.shadowOffsetX = 0;
         ctx!.shadowOffsetY = 0;
         **/
        ctx!.fill();
        ctx!.closePath();
      }
    };
    StarField.prototype._tick = function () {
      this._updateStarField();
      this._renderStarField();
      this.rafId = raf(this._tick.bind(this));
    }

    /**
     * Init scene by resizing the canvas to the appropriate value, and
     * set up main loop
     * @param {int} numStars Number of stars in our starfield
     */
    StarField.prototype._initScene = function (this: any, numStars: number) {
      var i;
      for (i = 0; i < numStars; i++) {
        try {
          this.starField.push(
            StarFactory.getRandomStar(-this.canvasWidth / 2, -this.canvasHeight / 2, this.canvasWidth, this.canvasHeight, this.maxStarSpeed)
          );
        } catch {
        }
      }
      raf(this._tick.bind(this));
    };

    /**
     * Start Everything
     * @param {int} numStars Number of stars to render
     * @param {int} maxStarSpeed maximum star speed
     */
    StarField.prototype.render = function (numStars: number, maxStarSpeed: number) {
      this.numStars = numStars;
      this.maxStarSpeed = maxStarSpeed;
      this._initScene(this.numStars);
    };

    let starField = new StarField(this.state, this.props.scale, this.props.starColor).render(this.props.numStars, this.props.maxStarSpeed);
    return (starField);
  }

    updateWindowDimensions() {
    this.setState({ containerWidth: window.innerWidth, containerHeight: window.innerHeight });
    this._draw();
  }

}

// @ts-ignore
export default BigBangStarField;
