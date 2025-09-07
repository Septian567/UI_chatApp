import React, { useEffect, useState } from "react";

interface WaveAnimationProps
{
  isPlaying: boolean;
}

export default function WaveAnimation( { isPlaying }: WaveAnimationProps )
{
  const [barCount, setBarCount] = useState( 12 );

  useEffect( () =>
  {
    const updateBarCount = () =>
    {
      if ( window.innerWidth < 640 )
      {
        setBarCount( 5 ); // layar kecil
      } else
      {
        setBarCount( 12 ); // layar besar
      }
    };

    // Jalankan pertama kali
    updateBarCount();

    // Dengarkan event resize
    window.addEventListener( "resize", updateBarCount );
    return () => window.removeEventListener( "resize", updateBarCount );
  }, [] );

  return (
    <div className="wave-container">
      { [...Array( barCount )].map( ( _, i ) => (
        <div
          key={ i }
          className={ `wave-bar ${ isPlaying ? "wave-bar-animate" : "" }` }
          style={ { animationDelay: `${ i * 0.2 }s` } }
        />
      ) ) }

      <style jsx>{ `
        .wave-container {
          display: flex;
          align-items: center;
          gap: 4px;
          width: 100%;
          max-width: 270px;
          height: 30px;
          background: transparent;
        }

        .wave-bar {
          width: 6px;
          background-color: #000;
          height: 10px;
          border-radius: 2px;
          transform-origin: bottom center;
          animation-fill-mode: forwards;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          animation-duration: 1s;
          animation-play-state: paused;
        }

        .wave-bar-animate {
          animation-play-state: running;
          animation-name: wave-scale;
        }

        @keyframes wave-scale {
          0% {
            transform: scaleY(0.3);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleY(0.3);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
