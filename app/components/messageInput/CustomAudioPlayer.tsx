import { Play, Pause } from "react-feather";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import WaveAnimation from "./WaveAnimation";

interface CustomAudioPlayerProps
{
  src: string;
  manualDuration?: number;
}

function PlayPauseButton( {
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
} )
{
  return (
    <button onClick={ onToggle } className="text-black">
      { isPlaying ? <Pause size={ 18 } /> : <Play size={ 18 } /> }
    </button>
  );
}

export default function CustomAudioPlayer( { src, manualDuration }: CustomAudioPlayerProps )
{
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    handleLoadedMetadata,
  } = useAudioPlayer( src );

  return (
    <div className="flex items-center gap-2 w-full">
      <PlayPauseButton isPlaying={ isPlaying } onToggle={ togglePlay } />
      {/* Animasi wave pengganti progress bar */ }
      <WaveAnimation isPlaying={ isPlaying } />

      {/* Audio element */ }
      <audio
        ref={ audioRef }
        src={ src }
        preload="metadata"
        onLoadedMetadata={ handleLoadedMetadata }
      />
    </div>
  );
}
