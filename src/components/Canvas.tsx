import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { turnUp, turnDown, turnLeft, turnRight, startGame, SnakeState, stopGame, moveSnake } from '../modules/snake';
import { RootState } from '../modules/index';
import { store } from '../index';

class Canvas extends React.Component<SnakeState> {
  private canvasRef: RefObject<HTMLCanvasElement>;
  props: SnakeState;
  timer: any;
  animater: any;

  constructor(props: SnakeState) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.props = props;
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

  updateSnake() {
    if (!this.isSnakeAlive()) {
      !this.timer && clearTimeout(this.timer);
      !this.animater && window.cancelAnimationFrame(this.animater);
      this.timer = undefined;
      this.animater = undefined;
      store.dispatch(stopGame());
      return;
    }
    const { x: xDir, y: yDir } = this.props.direction;
    let { x, y }  = this.props.position;
    const size = this.props.size;

    store.dispatch(moveSnake({
      x: x + xDir * size, 
      y: y + yDir * size
    }));
  }

  drawSnake() {
    let { x, y }  = this.props.position;
    const size = this.props.size;
    let { _canvas, _ctx } = this.getCanvasAndContext();
    if (_canvas !== null && _ctx !== null) {
      _ctx.fillStyle="black";
      _ctx.fillRect(x , y, size, size);
    }
  }

  isSnakeAlive() {
    const { _canvas, _ctx } = this.getCanvasAndContext();
    let { position, size }  = this.props;

    // out of canvas case
    if ( position.x < 0 || position.y < 0 )
      return false;
    
    if (_canvas !== null && _ctx !== null) {
      const { width, height } = _canvas;
      if ( position.x + size > width || position.y + size > height) {
        return false;
      }
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
    console.log('update...', this.props.direction, this.props.position);
    this.clearCanvas();
    if (!this.props.inGame) {
      this.initText();
      return;
    }
    this.updateSnake();
    this.drawSnake();
    this.timer = setTimeout(() => {
        this.animater = window.requestAnimationFrame(this.animate.bind(this))
      }, 
      1000 / this.props.speed
    );
  }

  startSnake() {
    console.log('Start Snake!!!');
    this.clearCanvas();
    // ready animate frame
    store.dispatch(startGame());
    this.animate();
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