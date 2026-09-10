import React from 'react';
import styled from 'styled-components';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number;
  size?: number;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = '', 
  scale = 0.5,
  size,
  message,
  ...props 
}) => {
  // Strip out 2D rotation classes so they don't deform the 3D perspective
  const safeClassName = className.replace(/\banimate-spin\b/g, '').trim();

  // If a pixel size is provided, calculate scale proportionally
  const finalScale = size ? size / 120 : scale;
  const dimension = 300 * finalScale;

  return (
    <div 
      className={`inline-flex flex-col items-center justify-center ${safeClassName}`} 
      style={{ width: dimension, height: dimension }}
      {...props}
    >
      <ScaledContainer style={{ transform: `scale(${finalScale})` }}>
        <div className="pyramid-loader">
          <div className="wrapper">
            <span className="side side1" />
            <span className="side side2" />
            <span className="side side3" />
            <span className="side side4" />
            <span className="shadow" />
          </div>
        </div>
      </ScaledContainer>
      {message && (
        <p className="text-xs text-gray-400 mt-2 text-center">{message}</p>
      )}
    </div>
  );
};

export const Loader = LoadingSpinner;
export default LoadingSpinner;

const ScaledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  transform-origin: center center;
  pointer-events: none;

  .pyramid-loader {
    position: relative;
    width: 300px;
    height: 300px;
    display: block;
    transform-style: preserve-3d;
    transform: rotateX(-20deg);
  }

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: spinPyramid 4s linear infinite;
  }

  @keyframes spinPyramid {
    100% {
      transform: rotateY(360deg);
    }
  }

  .pyramid-loader .wrapper .side {
    width: 70px;
    height: 70px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform-origin: center top;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  .pyramid-loader .wrapper .side1 {
    transform: rotateZ(-30deg) rotateY(90deg);
    background: conic-gradient(#2BDEAC, #F028FD, #D8CCE6, #2F2585);
  }

  .pyramid-loader .wrapper .side2 {
    transform: rotateZ(30deg) rotateY(90deg);
    background: conic-gradient(#2F2585, #D8CCE6, #F028FD, #2BDEAC);
  }

  .pyramid-loader .wrapper .side3 {
    transform: rotateX(30deg);
    background: conic-gradient(#2F2585, #D8CCE6, #F028FD, #2BDEAC);
  }

  .pyramid-loader .wrapper .side4 {
    transform: rotateX(-30deg);
    background: conic-gradient(#2BDEAC, #F028FD, #D8CCE6, #2F2585);
  }

  .pyramid-loader .wrapper .shadow {
    width: 60px;
    height: 60px;
    background: #8B5AD5;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform: rotateX(90deg) translateZ(-40px);
    filter: blur(12px);
  }
`;