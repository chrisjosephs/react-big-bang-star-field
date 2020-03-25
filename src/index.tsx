import * as React from 'react';
import {createRef, PureComponent} from "react";
import * as PropTypes from "prop-types";
const raf = require('raf');
import sizeMe from 'react-sizeme';

export interface Props {
  numStars: number,
  maxStarSpeed: number,
  offsetX?: number,
  offsetY?: number,
  scale?: number,
  style?: object,
  size: SizeMe,
  canvasRef?: object,
}

export interface SizeMe {
  width: number,
  height: number
}

class BigBangStarField extends PureComponent <Props> {

  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  private size: SizeMe;
  constructor(props: Props) {
    super(props);
    this.containerRef = createRef();
    this.canvasRef = createRef();
    this.size = props.size;
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
  }

  static defaultProps = {
    numStars: 333,
    maxStarSpeed: 1,
    scale: 4,
    size: {
      height: 1000,
      width: 2500
    },
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
      style,
      scale,
      ...rest
    } = this.props
    let div = <>
      <div className={'fullScreen'}
           ref={this.containerRef}
           style={{
             overflow: 'hidden',
             backgroundImage: `url(${'/home/crimzon/Downloadspiqsels.com-id-fvkta.jpg'})`,
             backgroundSize: 'cover',
             ...style
           }}
           {...rest}
      >
        <canvas
          ref={this.canvasRef}
          width={this.size.width}
          height={this.size.height}
        />
      </div>
    </>;
    return div
  }

  _draw() {

    if (!this.canvasRef) return;
    const {
      scale,
      size
    } = this.props
    const ctx = this.canvasRef.current!.getContext('2d');
    ctx!.scale(scale!, scale!);
    const container = this.containerRef.current;

    /**
     *
     * @param x {number} x coordinate of the star
     * @param y {number} y coordinate of the star
     * @param maxSpeed {number} maxSpeed
     * @constructor
     * @this Star
     */
    let Star = function (this: any, x: number, y: number, maxSpeed: number) {
      /**
       * @todo fix initial x burst
       */
      this.x = ((Math.random() * 2) - 1) * 100;
      this.y = y;
      this.slope = y / x;
      this.opacity = 0;
      this.speed = Math.max(Math.random() * maxSpeed, 1);
    };

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
        /// HMMMMMMMMMMMMM

        // @ts-ignore
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
    class StarField{
      _updateStarField: () => void;
      _renderStarField: () => void;
      maxStarSpeed: number;
      numStars: number;
      starField: any;
      _adjustCanvasSize: (width: number, height: number) => void;
      _watchCanvasSize: (elapsedTime: number) => void;
      prevCheckTime: number;
      oldWidth: number;
      oldHeight: number;
      _tick: any;
      render: (numStars: number, maxStarSpeed: number) => void;
      _initScene: (this: any, numStars: number) => void;
      constructor() {
        this.starField = [];
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


        if ((Math.abs(star.x) > size['width'] / 2) ||
          (Math.abs(star.y) > size['height'] / 2)) {

          randomLoc = StarFactory.getRandomPosition(
            -size['width'] / 10, -size['height'] / 10,
            size['width'] / 5, size['height'] / 5
          );
          star.resetPosition(randomLoc.x, randomLoc.y, this.maxStarSpeed);
        }
      }
    };


    StarField.prototype._renderStarField = function () {
      var i,
        star;
      ctx!.fillStyle = "rgba(255, 0, 0, 0)";
      ctx!.clearRect(0, 0, size['width'], size['height']);
      for (i = 0; i < this.numStars; i++) {
        star = this.starField[i];

        ctx!.fillStyle = "rgba(217, 130, 244, " + star.opacity + ")";
        ctx!.fillRect(
          star.x + size['width'] / 2,
          star.y + size['height'] / 2,
          1, 1);
      }
    };

    /**
     * Makes sure that the canvas size fits the size of its container
     */
    StarField.prototype._adjustCanvasSize = function (width: number, height: number) {
      // Set the canvas size to match the container ID (and cache values)
      // @ts-ignore
      size['width'] = ctx!.width = width;
      // @ts-ignore
      size['height'] = ctx!.height = height;
      // ctx!.scale(scale!, scale!);
    };

    /**
     * This listener compares the old container size with the new one, and caches
     * the new values.
     */
    StarField.prototype._watchCanvasSize = function (elapsedTime: number) {
      var timeSinceLastCheck = elapsedTime - (this.prevCheckTime || 0),
        width,
        height;

      raf(this._watchCanvasSize.bind(this));

      // Skip frames unless at least 333ms have passed since the last check
      // (Cap to ~3fps)
      if (timeSinceLastCheck >= 333 || !this.prevCheckTime) {
        this.prevCheckTime = elapsedTime;
        // @ts-ignore
        width = container!.offsetWidth / scale;
        // @ts-ignore
        height = container!.offsetHeight / scale;
        if (this.oldWidth !== width || this.oldHeight !== height) {
          this.oldWidth = width;
          this.oldHeight = height;
          this._adjustCanvasSize(width, height);
        }
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
          console.log(starField);
          this.starField.push(
            StarFactory.getRandomStar(-size['width'] / 2, -size['height'] / 2, size['width'], size['height'], this.maxStarSpeed)
          );
        } catch {
        }
      }
      raf(this._tick.bind(this));
      raf(this._watchCanvasSize.bind(this));
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
    let starField = new StarField().render(this.props.numStars, this.props.maxStarSpeed);
    return (starField);
  }
}

// @ts-ignore
export default sizeMe({ monitorHeight: true })(BigBangStarField);
