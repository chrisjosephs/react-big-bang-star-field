export class Star {
  x: number
  y: number
  maxSpeed: number
  slope: number
  opacity: number
  speed: number
  width: number
  starColor: string
  createStar: (this: Star, x: number, y: number, maxSpeed: number) => Star;
  distanceTo: (this: Star, originX: number, originY: number) => number;
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
Star.prototype.createStar = function(x: number, y: number, maxSpeed: number){
  this.width = 0.5;
  this.x = x;
  this.y = y;
  this.slope = y / x;
  this.opacity = 0;
  this.speed = Math.max(Math.random() * maxSpeed, 1);
  return this;
}
Star.prototype.distanceTo = function(originX: number, originY: number){
  return Math.sqrt(Math.pow(originX - this.x, 2) + Math.pow(originY - this.y, 2));
}
Star.prototype.resetPosition = function(_x: number,_y: number, _maxSpeed: number){
  this.x = _x;
  this.y = _y;
  this.opacity = 0;
  this.maxSpeed = _maxSpeed;
  return this;
};

