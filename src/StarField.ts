import {Star} from "./Star";

/**
 * StarField
 * @param {sizeMe} containerSize size of the container
 * @param {scale} number upscale canvas drawing
 */
export class StarField {
  _updateStarField: () => void;
  _renderStarField: () => void;
  maxStarSpeed: number;
  numStars: number;
  stars: any;
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
  canvasWidth: number;
  canvasHeight: number;
  state: any;
  called: boolean;

  constructor(state: any, scale: number, starColor: string) {
    this.canvasWidth = state.containerWidth / scale;
    this.canvasHeight = state.containerHeight / scale;
    this.stars = [];
    this.scale = scale;
    this.starColor = starColor;
    return this;
  }
}

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

StarField.prototype._updateStarField = function () {
  var i,
    star,
    randomLoc,
    increment;

  for (i = 0; i < this.numStars; i++) {
    star = this.stars[i];
    increment = Math.min(star.speed, Math.abs(star.speed / star.slope));
    star.x += (star.x > 0) ? increment : -increment;
    star.y = star.slope * star.x;

    star.opacity += star.speed / 150;
    star.opacity += star.speed / 150;


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
/**
 * Init scene by resizing the canvas to the appropriate value, and
 * set up main loop
 * @param {int} numStars Number of stars in our starfield
 */
StarField.prototype._initScene = function (this: any, numStars: number) {
  var i;
  for (i = 0; i < numStars; i++) {
    try {
      this.stars.push(
        StarFactory.getRandomStar(-this.canvasWidth / 2, -this.canvasHeight / 2, this.canvasWidth, this.canvasHeight, this.maxStarSpeed)
      );
    } catch {
    }
  }
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
