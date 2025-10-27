import React from 'react';

const Loader = ({ size = 60, color = '#FC3A51', className = '', isLoading=false }) => {
  const loaderStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'flex',
    color: color,
    '--c': `#0000 calc(100% - 20px), currentColor calc(100% - 19px) 98%, #0000`,
    background: `
      radial-gradient(farthest-side at left, var(--c)) right / 50% 100%,
      radial-gradient(farthest-side at top, var(--c)) bottom / 100% 50%
    `,
    backgroundRepeat: 'no-repeat',
    animation: 'loader-rotate 2s infinite linear 0.25s',
  };

  // const beforeStyle = {
  //   content: '""',
  //   width: '50%',
  //   height: '50%',
  //   background: 'radial-gradient(farthest-side at bottom right, var(--c))',
  //   animation: 'loader-flip 0.5s infinite linear',
  // };

  if(isLoading) {
    return (
      <>
        <style jsx>{`
          @keyframes loader-rotate {
            0%, 12.49% { transform: rotate(0deg); }
            12.5%, 37.49% { transform: rotate(90deg); }
            37.5%, 62.49% { transform: rotate(180deg); }
            62.5%, 87.49% { transform: rotate(270deg); }
            87.5%, 100% { transform: rotate(360deg); }
          }
          
          @keyframes loader-flip {
            0% { transform: perspective(150px) rotateY(0) rotate(0); }
            50% { transform: perspective(150px) rotateY(180deg) rotate(0); }
            80%, 100% { transform: perspective(150px) rotateY(180deg) rotate(90deg); }
          }
          
          .loader-element::before {
            content: "";
            width: 50%;
            height: 50%;
            background: radial-gradient(farthest-side at bottom right, var(--c));
            animation: loader-flip 0.5s infinite linear;
          }
        `}</style>
        <div 
          className={`loader-element ${className}`}
          style={loaderStyle}
        />
      </>
    );
  }

};

export default Loader