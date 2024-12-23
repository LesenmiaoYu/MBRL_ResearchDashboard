import React from 'react';
import styled from 'styled-components';

const Loader = ({ size = '30px', firstColor = '#990000', secondColor = '#FFCC00' }) => {
  return (
    <StyledWrapper size={size} firstColor={firstColor} secondColor={secondColor}>
      <div className="spinner" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .spinner {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    position: relative;
  }

  .spinner::before,
  .spinner::after {
    content: '';
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    border: 6px solid ${({ firstColor }) => firstColor};
    position: absolute;
    top: 50%;
    left: ${({ size }) => `calc(${size})`};
    transform: translate(-50%, -50%);
    animation: kf-spin 1s linear infinite;
    border-radius: 50% 80% 50% 70%;
    box-sizing: border-box;
  }

  .spinner::after {
    top: 50%;
    left: ${({ size }) => `calc(${size} * 2)`};
    border: 6px solid ${({ secondColor }) => secondColor};
    animation: kf-spin 1s linear infinite reverse;
  }

  @keyframes kf-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
