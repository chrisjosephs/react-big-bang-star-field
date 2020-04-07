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
  private scale: number;

  constructor(props: Props) {
    super(props);
    this.containerRef = createRef();
    this.canvasRef = createRef();
    this.containerSize = props.size;
  }

  static propTypes = {
    numStars: PropTypes.number,
    maxStarSpeed: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    scale: PropTypes.number,
    style: PropTypes.object,
    size: PropTypes.object,
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
    const container = this.containerRef.current;
    ctx!.scale(this.scale, this.scale);

    /**
     *
     * @param x {number} x coordinate of the star
     * @param y {number} y coordinate of the star
     * @param z {number} z tracer length of star
     * @param maxSpeed {number} maxSpeed
     * opacity {number} opacity
     * speed {number} actual speed
     * growth {number} how much the star grows as it gets closer to the camera
     * @constructor
     * @this Star
     */
    class Star {
      x: number;
      y: number;
      z:  number;
      maxSpeed: number;
      slope: number;
      opacity: number;
      speed: number;
      grows: number;
      size: number;
      distanceTo: (originX: number, originY: number) => number;
      resetPosition: (_x: number, _y: number, _maxSpeed: number) => Star;

      constructor(x: number, y: number, maxSpeed: number) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.size = 1;
        // @ts-ignore
        function randomWeight(){
          let r = 1;
          let n: number=Math.floor(Math.random()*100)
          if (n<80) {
            r = 1
          }
          else if (n<90) {
            r = 1.5
          }
          else if (n<97) {
            r = 3;
          }
          return r;
        }
        // we only want ones to grow that are going to hit the camera
        this.grows = randomWeight();
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
      canvasSize: SizeMe;
      containerSize: SizeMe;
      _tick: any;
      render: (numStars: number, maxStarSpeed: number) => void;
      _initScene: (this: any, numStars: number) => void;
      _adjustCanvasSize: (width: number, height: number) => void;
      _watchCanvasSize: (elapsedTime: number) => void;
      prevCheckTime: number;
      oldWidth: number;
      oldHeight: number;
      scale: number;
      size: number;

      constructor(containerSize: SizeMe, scale: number) {
        this.containerSize = containerSize;
        this.canvasSize = JSON.parse(JSON.stringify(containerSize));
        this.canvasSize.width = containerSize.width / scale;
        this.canvasSize.height = containerSize.height / scale;
        this.starField = [];
        this.scale = scale;

      }
    }

    StarField.prototype._updateStarField = function () {
      var i,
        star,
        randomLoc,
        increment;
      var width = this.canvasSize.width;
      for (i = 0; i < this.numStars; i++) {
        star = this.starField[i];
        increment = Math.min(star.speed, Math.abs(star.speed / star.slope));
        star.origX = star.x;
        star.origY = star.y;
        star.x += (star.x > 0) ? increment : -increment;
        star.y = star.slope * star.x;
        let closenessx = Math.abs(((1 / width) * star.x));
        star.size = 1+ closenessx * star.grows;
        star.opacity += star.speed / 150;


        if ((Math.abs(star.x) > this.canvasSize.width / 2) ||
          (Math.abs(star.y) > this.canvasSize.height / 2)) {

          randomLoc = StarFactory.getRandomPosition(
            -this.canvasSize.width / 10, -this.canvasSize.height / 10,
            this.canvasSize.width / 5, this.canvasSize.height / 5
          );
          star.resetPosition(randomLoc.x, randomLoc.y, this.maxStarSpeed);
        }
      }
    };


    StarField.prototype._renderStarField = function () {
      var i,
        star;
      var width = this.canvasSize.width;
      var height = this.canvasSize.height;
      ctx!.clearRect(0, 0, width, height);
      for (i = 0; i < this.numStars; i++) {
        star = this.starField[i];
        /**
         * todo: ctx!.fillStyle = star.color
         * ctx.size - random (for radius)
         */
        ctx!.fillStyle = "rgba(217, 150, 244, " + star.opacity + ")";
        ctx!.beginPath();
        ctx!.moveTo(star.x  + width / 2, star.y + height / 2);
        ctx!.lineTo(star.origX + width / 2, star.origY + height / 2 );
        ctx!.strokeStyle = "rgba(255, 255, 255, " + star.opacity + ")";
        ctx!.stroke()
        ctx!.closePath();
      }
    };
    /**
     * Makes sure that the canvas size fits the size of its container
     */
    StarField.prototype._adjustCanvasSize = function (width: number, height: number) {
      // Set the canvas size to match the container ID (and cache values)
      this.containerSize.width = width;
      this.containerSize.height = height;
      this.canvasSize.width = width / this.scale;
      this.canvasSize.height = height / this.scale;
      ctx!.scale(this.scale, this.scale);

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
        if (container != null) {
          width = container.offsetWidth;
          height = container.offsetHeight;
          if (this.oldWidth !== width || this.oldHeight !== height) {
            this.oldWidth = width;
            this.oldHeight = height;
            this._adjustCanvasSize(width, height);
            this._updateStarField();
          }
        }
      }
    };
    StarField.prototype._tick = function () {
      this._updateStarField(); -1
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
            StarFactory.getRandomStar(-this.canvasSize.width / 2, -this.canvasSize.height / 2, this.canvasSize.width, this.canvasSize.height, this.maxStarSpeed)
          );
        } catch {
        }
      }
      raf(this._tick.bind(this));
      raf(this._watchCanvasSize.bind(this));
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
    let starField = new StarField(this.containerSize, this.props.scale).render(this.props.numStars, this.props.maxStarSpeed);
    return (starField);
  }
}

// @ts-ignore
export default sizeMe({monitorHeight: true})(BigBangStarField);
