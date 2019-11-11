import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { turnUp, turnDown, turnLeft, turnRight, startGame, SnakeState, stopGame, moveSnake, createFood, increaseBody } from '../modules/snake';
import { RootState } from '../modules/index';
import { store } from '../index';

class Canvas extends React.Component<SnakeState> {
  private canvasRef: RefObject<HTMLCanvasElement>;
  props: SnakeState;
  prevProps: SnakeState;
  timer: any;
  animater: any;

  constructor(props: SnakeState) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.props = props;
    this.prevProps = props;
    this.timer = undefined;
    this.animater = undefined;
  }

  getCanvasAndContext() {
    const _canvas = this.canvasRef.current;
    const _ctx = _canvas && _canvas.getContext("2d");
    return { _canvas, _ctx };
  }

  componentDidMount() {
      this.clearCanvas();
      this.initText();
      window.addEventListener('keyup', this.keyDownHandler.bind(this));

  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyDownHandler.bind(this));
  }

  componentWillReceiveProps() {
    this.prevProps = this.props;
  }

  updateSnake(): boolean {

    const { x: xDir, y: yDir } = this.props.direction;
    let { x, y }  = this.props.body[0];
    const { size, food } = this.props;
    if ( JSON.stringify(this.props) === JSON.stringify(this.prevProps) ) {
      return true;
    }
    let newXPos = x + xDir * size;
    let newYPos = y + yDir * size;

    if (!this.isSnakeAlive(newXPos, newYPos)) {
      !this.timer && clearTimeout(this.timer);
      !this.animater && window.cancelAnimationFrame(this.animater);
      this.timer = undefined;
      this.animater = undefined;
      store.dispatch(stopGame());
      return false;
    }

    if (food !== undefined) {
      if (newXPos === food.x && newYPos === food.y)  {
        // TODO: append body
        let tail = this.props.body[this.props.body.length -1];
        let newTailX, newTailY;

        newTailX = tail.x - xDir * size;
        newTailY = tail.y + yDir * size

        store.dispatch(increaseBody({x: newTailX, y: newTailY}));
        this.createFood();
      }
    }

    store.dispatch(moveSnake({
      x: xDir * size, 
      y: yDir * size
    }));
    return true;
  }

  drawSnake() { 
    // head
    const size = this.props.size;
    let { _canvas, _ctx } = this.getCanvasAndContext();

    this.props.body.forEach((pos, i) => {
      let { x, y }  = pos;

      if (_canvas !== null && _ctx !== null) {
        _ctx.fillStyle= i !== 0 ? "black" : "blue";
        _ctx.fillRect(x , y, size, size);
      }
    })
  }

  drawFood() {
    let { x, y }  = this.props.food || { x: 0, y: 0 };
    const size = this.props.size;
    let { _canvas, _ctx } = this.getCanvasAndContext();
    if (_canvas !== null && _ctx !== null) {
      _ctx.fillStyle="red";
      _ctx.fillRect(x , y, size, size);
    }
  }

  isSnakeAlive(x: number, y: number) {
    const { _canvas, _ctx } = this.getCanvasAndContext();
    let { size }  = this.props;

    // not in a game
    if (!this.props.inGame)
      return false;

    // out of canvas case
    if ( x < 0 || y < 0 )
      return false;
    
    if (_canvas !== null && _ctx !== null) {
      const { width, height } = _canvas;
      if ( x + size > width || y + size > height) {
        return false;
      }
    }

    // hit by body
    let hitted = this.props.body.findIndex((body) => body.x === x && body.y === y);
    if (hitted > 0 && hitted < this.props.body.length -1) {
      return false;
    }
    return true;
  }

  clearCanvas() {
    const { _canvas, _ctx } = this.getCanvasAndContext();
    if (_ctx !== null && _canvas !== null) {
      _ctx.fillStyle = "gray";
      _ctx.fillRect(0, 0, _canvas.width, _canvas.height);
    }
  }

  initText() {
    const { _canvas, _ctx } = this.getCanvasAndContext();
    if (_ctx !== null && _canvas !== null) {
      let gradient = _ctx.createLinearGradient(0, 0, _canvas.width, 0);
      gradient.addColorStop(0," magenta");
      gradient.addColorStop(0.5, "blue");
      gradient.addColorStop(1.0, "red");
      _ctx.fillStyle = gradient;
      _ctx.font = "30px Courier";
      _ctx.textAlign = 'center';
      _ctx.fillText("Hello Snake!", _canvas.width / 2, _canvas.height / 2);
      _ctx.font = "15px Courier";
      _ctx.textAlign = 'center';
      _ctx.fillText("Press Enter to Start!", _canvas.width / 2, _canvas.height / 2 + 20);
    }
  }

  animate() {
    console.log('update...', this.props.direction, this.props.body[0], this.props.inGame);
    this.clearCanvas();
    if (this.updateSnake()) {
      this.drawFood();
      this.drawSnake();
      this.timer = setTimeout(() => {
          this.animater = window.requestAnimationFrame(this.animate.bind(this))
        }, 
        1000 / this.props.speed
      );
    } else {
      // have to game out display, but not yet impl
      // TODO: impl 
      this.initText();
    }
  }

  startSnake() {
    console.log('Start Snake!!!');
    this.clearCanvas();
    // ready animate frame
    store.dispatch(startGame());
    this.createFood();
    this.animate();
  }

  createFood() {
    let xMin = 0;
    let xMax = ((this.canvasRef.current && this.canvasRef.current.width) || 400) / this.props.size;
    let yMin = 0;
    let yMax = ((this.canvasRef.current && this.canvasRef.current.height) || 400) / this.props.size;

    let getRand = (min: number, max: number) => {
      return (Math.floor(Math.random() * (max-min)) + min) * this.props.size;
    }
    let x = getRand(xMin, xMax);
    let y = getRand(yMin, yMax);
    store.dispatch(createFood({x, y}));
  }

  keyDownHandler(evt: KeyboardEvent) {
    const { inGame } = this.props;
    switch(evt.key) {
      case 'Enter':
        !inGame && this.startSnake();
        break;
      case 'ArrowUp':
        store.dispatch(turnUp());
        break;
      case 'ArrowDown':
        store.dispatch(turnDown());
        break;
      case 'ArrowLeft':
        store.dispatch(turnLeft());
        break;
      case 'ArrowRight':
        store.dispatch(turnRight());
        break;
      case 'Escape':
        store.dispatch(stopGame());
        break;
    }
  }

  render() {
    return (
      <div>
        <canvas ref={ this.canvasRef } width={400} height={400} ></canvas>
      </div>
    );
  }

};

let mapStateToProps = (state: RootState) => {
  return state.snake;
}

export default connect(mapStateToProps)(Canvas);