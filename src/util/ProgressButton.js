//const  { useState, useEffect, useCallback } = React;
import * as React from 'react';
import styled from 'styled-components';

const Button = styled.div`
  user-select: none;
  cursor: pointer;
  font-size:1em;
  background-color: #666;
  color: white;
  padding: 10px 20px;
  position: relative;
  max-width: 360px;
  margin-top: 20px;
`;

const Progress = styled.div`
  margin: -10px -20px;;
  background-color: #C66;
  height: 100%;
  position: absolute;
  width: 0;
  transition: width 0s;

  &.start,
  &.done {
    width: 100%;
    transition: width 3s;
  }
`;

const Container = styled.div`
  text-align: center;
`;

function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = React.useState(false);

  React.useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, callback, ms]);

  const start = React.useCallback(() => {
    setStartLongPress(true);
  }, []);
  const stop = React.useCallback(() => {
    setStartLongPress(false);
  }, []);

  return [
    startLongPress,
    {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
    }
  ];
}

export default function ProgressButton(props) {
  const [startLongPress, backspaceLongPress] = useLongPress(props.longPressBackspaceCallback, 3000);
  let className = 'progress'
  if (startLongPress) {
    className += ' start';
  }

  return (
    <Button {...backspaceLongPress} >
      <Progress className={className}></Progress>
      <Container>
        {props.text}
      </Container>
    </Button>
  );
};

//ReactDOM.render(
//  <ProgressButton longPressBackspaceCallback={() => alert('Long Press!')} />,
//  document.getElementById('root')
//);