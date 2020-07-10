import * as React from 'react';
import {createRef, PureComponent} from "react";
import {StarField} from './StarField';

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
declare var global: any
class BigBangStarField extends PureComponent <Props> {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  state: { containerWidth: number; containerHeight: number }
  starField: StarField;
  private ctx: any;
  _tickRaf: number;

  constructor(props: Props) {
    super(props);
    this.containerRef = createRef();
    this.canvasRef = createRef();
    if (typeof(window) == 'undefined') global.window = new Object();
    this.state = {containerWidth: 0, containerHeight: 0};
    this.updateContainerDimensions = this.updateContainerDimensions.bind(this);

  }

  static defaultProps = {
    numStars: 333,
    maxStarSpeed: 1,
    scale: 4,
    style: {},
    starColor: "217, 130, 244"
  };

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext('2d');
    this.state = {containerWidth: this.containerRef.current!.offsetWidth, containerHeight: this.containerRef.current!.offsetHeight};
    this.starField = new StarField(this.state, this.props.scale, this.props.starColor);
    this.starField.render(this.props.numStars, this.props.maxStarSpeed);
    this.updateContainerDimensions();
    window.addEventListener('resize', this.updateContainerDimensions);
    this._tick()
  }

  componentWillUnmount() {
    raf.cancel(this._tickRaf)
    window.removeEventListener('resize', this.updateContainerDimensions);
  }

  updateContainerDimensions() {
    this.state = {containerWidth: this.containerRef.current!.offsetWidth, containerHeight: this.containerRef.current!.offsetHeight};
    this.starField.state = this.state;
    this.canvasRef.current!.height = this.state.containerHeight;
    this.canvasRef.current!.width = this.state.containerWidth;
    this.starField.canvasWidth  = this.state.containerWidth / this.props.scale;
    this.starField.canvasHeight = this.state.containerHeight / this.props.scale;
    this.ctx!.scale(this.props.scale, this.props.scale);
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
             width: '100%',
             height: '100%',
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

  _tick = () => {
    this.starField._updateStarField();
    this._draw()
    this._tickRaf = raf(this._tick)
  }

  _draw() {
    let ctx = this.ctx!;
    let starField = this.starField;
    var i,
      star;
    let width = starField.canvasWidth;
    let height = starField.canvasHeight;
    ctx!.clearRect(0, 0, width, height);
    for (i = 0; i < starField.numStars; i++) {
      star = starField.stars[i];
      ctx!.fillStyle = "rgba(" + starField.starColor + ", " + star.opacity + ")";
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
  }
}

export default BigBangStarField;
