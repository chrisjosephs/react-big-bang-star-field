import * as React from 'react';
import {createRef, PureComponent} from "react";
import * as PropTypes from "prop-types";
const raf = require('raf');
import sizeMe from 'react-sizeme';

export interface Props {
  numStars: number,
  maxStarSpeed: number,
  starOpacity?: number,
  offsetX?: number,
  offsetY?: number,
  scale: number,
  style?: object,
  size: SizeMe,
  canvasSize: SizeMe,
  canvasRef?: object,
  backgroundImage?: string
}

export interface SizeMe {
  width: number,
  height: number
}


class BigBangStarField extends PureComponent <Props> {

  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  private readonly containerSize: SizeMe;
  private canvasSize: SizeMe;


  constructor(props: Props) {
    super(props);
    this.containerRef = createRef();
    this.canvasRef = createRef();
    this.containerSize = props.size;
    this.canvasSize = JSON.parse(JSON.stringify(this.containerSize))
    this.canvasSize.width = (props.size.width / props.scale);
    this.canvasSize.height = (props.size.height / props.scale);
  ;
}
  static propTypes = {
    numStars: PropTypes.number,
    maxStarSpeed: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    scale: PropTypes.number,
    style: PropTypes.object,
    size: PropTypes.number,
    canvasRef: PropTypes.object,
    canvasSize: PropTypes.number
  }

  static defaultProps = {
    numStars: 333,
    maxStarSpeed: 1,
    scale: 4,
    style: {}
  };

  componentDidMount() {
    this._draw()
  }

  render() {
    const {
      numStars,
      maxStarSpeed,
      size,
      canvasSize,
      style,
      scale,
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
          width={this.containerSize.width}
          height={this.containerSize.height}
        />
      </div>
    </>;
    return div
    this._draw()
  }

  _draw() {
    if (!this.canvasRef) return;
    const ctx = this.canvasRef.current!.getContext('2d');
    // const container = this.containerRef.current;

    /**
     *
     * @param x {number} x coordinate of the star
     * @param y {number} y coordinate of the star
     * @param maxSpeed {number} maxSpeed
     * opacity {number} opacity
     * peed {number} actual speed
     * @constructor
     * @this Star
     */
    class Star {
      x: number;
      y: number;
      maxSpeed: number;
      slope: number;
      opacity: number;
      speed:number;
      distanceTo: (originX: number, originY: number) => number;
      resetPosition: (_x: number, _y: number, _maxSpeed: number) => Star;
      constructor(x:number, y:number, maxSpeed:number){
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
    class StarField {
      _updateStarField: () => void;
      _renderStarField: () => void;
      maxStarSpeed: number;
      numStars: number;
      starField: any;
      canvasSize: SizeMe;
      _tick: any;
      render: (numStars: number, maxStarSpeed: number) => void;
      _initScene: (this: any, numStars: number) => void;
      constructor(canvasSize: SizeMe, scale: number) {
        this.canvasSize = canvasSize;
        this.starField = [];
        ctx!.scale(scale, scale);
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


        if ((Math.abs(star.x) > this.canvasSize['width'] / 2) ||
          (Math.abs(star.y) > this.canvasSize['height'] / 2)) {

          randomLoc = StarFactory.getRandomPosition(
            -this.canvasSize['width'] / 10, -this.canvasSize['height'] / 10,
            this.canvasSize['width'] / 5, this.canvasSize['height'] / 5
          );
          star.resetPosition(randomLoc.x, randomLoc.y, this.maxStarSpeed);
        }
      }
    };


    StarField.prototype._renderStarField = function () {
      var i,
        star;
      ctx!.fillStyle = "rgba(255, 0, 0, 0)";
      ctx!.clearRect(0, 0, this.canvasSize['width'], this.canvasSize['height']);
      for (i = 0; i < this.numStars; i++) {
        star = this.starField[i];

        ctx!.fillStyle = "rgba(217, 130, 244, " + star.opacity + ")";
        ctx!.fillRect(
          star.x + this.canvasSize['width'] / 2,
          star.y + this.canvasSize['height'] / 2,
          1, 1);
      }
    };

    StarField.prototype._tick = function () {
      this._updateStarField();
      this._renderStarField();
      raf(this._tick.bind(this));

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
            StarFactory.getRandomStar(-this.canvasSize['width'] / 2, -this.canvasSize['height'] / 2, this.canvasSize['width'], this.canvasSize['height'], this.maxStarSpeed)
          );
        } catch {
        }
      }
      raf(this._tick.bind(this));
    };

    /**
     * Start Everything
     *  {int} numStars Number of stars to render
     * @param {int} maxStarSpeed maximum star speed
     */
    StarField.prototype.render = function (numStars: number, maxStarSpeed: number) {
      this.numStars = numStars;
      this.maxStarSpeed = maxStarSpeed;
      this._initScene(this.numStars);
    };
    let starField = new StarField(this.canvasSize, this.props.scale).render(this.props.numStars, this.props.maxStarSpeed);
    return (starField);
  }
}

// @ts-ignore
export default sizeMe({ monitorHeight: true })(BigBangStarField);
