import React, { useEffect, useCallback, useState, RefObject } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { moveUp, moveDown, moveLeft, moveRight, startGame, SnakeState, stopGame } from '../modules/snake';
import { RootState } from '../modules/index';
import { store } from '../index';

class Canvas extends React.Component<SnakeState> {
  private canvasRef: RefObject<HTMLCanvasElement>;

  constructor(props: SnakeState) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();

  }

  getCanvasAndContext() {
    const _canvas = this.canvasRef.current;
    const _ctx = _canvas && _canvas.getContext("2d");
    return { _canvas, _ctx };
  }

  componentDidMount() {
    const { _canvas, _ctx } = this.getCanvasAndContext();
    if (_canvas && _ctx !== null) {
      _ctx.fillStyle = "gray";
      _ctx.fillRect(0, 0, _canvas.width, _canvas.height);

      let gradient = _ctx.createLinearGradient(0, 0, _canvas.width, 0);
      gradient.addColorStop(0," magenta");
      gradient.addColorStop(0.5, "blue");
      gradient.addColorStop(1.0, "red");
      _ctx.fillStyle = gradient;
      _ctx.font = "30px Courier";
      _ctx.textAlign = 'center';
      _ctx.fillText("Hello Snake!", _canvas.width / 2, _canvas.height / 2);
    }

      window.addEventListener('keyup', this.keyDownHandler.bind(this));

  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyDownHandler.bind(this));
  }

  updateSnake() {
    
  }

  drawSnake() {

  }



  animate() {
    console.log('update...', this.props.direction);
    setTimeout(() => window.requestAnimationFrame(this.animate.bind(this)), 1000 / this.props.speed);
  }

  startSnake() {
    console.log('Start Snake!!!');
    // create field
    const { _canvas, _ctx } = this.getCanvasAndContext();

    if (_ctx !== null && _canvas !== null) {
      _ctx.fillStyle = "gray";
      _ctx.fillRect(0, 0, _canvas.width, _canvas.height);
    }
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
        store.dispatch(moveUp());
        break;
      case 'ArrowDown':
        store.dispatch(moveDown());
        break;
      case 'ArrowLeft':
        store.dispatch(moveLeft());
        break;
      case 'ArrowRight':
        store.dispatch(moveRight());
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