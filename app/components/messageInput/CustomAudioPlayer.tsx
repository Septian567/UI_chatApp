import { Play, Pause } from "react-feather";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import WaveAnimation from "./WaveAnimation";

interface CustomAudioPlayerProps
{
  src: string;
  manualDuration?: number;
  sentAt?: string; // waktu pengiriman
}

interface PlayPauseButtonProps
{
  isPlaying: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function PlayPauseButton( {
  isPlaying,
  onToggle,
  disabled = false,
}: PlayPauseButtonProps )
{
  return (
    <button
      onClick={ onToggle }
      disabled={ disabled }
      className="text-black disabled:cursor-not-allowed" // ✅ tetap hitam saat disable
      aria-label={ isPlaying ? "Pause audio" : "Play audio" }
    >
      { isPlaying ? <Pause size={ 18 } /> : <Play size={ 18 } /> }
    </button>
  );
}

export default function CustomAudioPlayer( {
  src,
  manualDuration,
  sentAt,
}: CustomAudioPlayerProps )
{
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    togglePlay,
    handleLoadedMetadata,
    formatTime,
  } = useAudioPlayer( src );

  const isDisabled: boolean = !!( isLoading || error );
  const displayDuration = duration > 0 ? duration : manualDuration || 0;

  return (
    <div className="flex items-start gap-3 w-full">
      {/* Tombol Play sejajar dengan wave */ }
      <div className="flex items-center h-[30px]">
        <PlayPauseButton
          isPlaying={ isPlaying }
          onToggle={ togglePlay }
          disabled={ isDisabled }
        />
      </div>

      {/* Wave + sentAt sejajar (horizontal), durasi tetap di bawah */ }
      <div className="flex flex-col flex-1 items-start">
        <div className="flex items-center gap-2 w-full">
          <WaveAnimation isPlaying={ isPlaying } />
          { sentAt && (
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              { sentAt }
            </span>
          ) }
        </div>

        {/* Durasi tetap di bawah wave */ }
        <span className="text-[12px] text-gray-500 -mt-1">
          { formatTime( currentTime ) } / { formatTime( displayDuration ) }
        </span>
      </div>

      {/* Audio element */ }
      <audio
        ref={ audioRef }
        src={ src }
        preload="metadata"
        onLoadedMetadata={ handleLoadedMetadata }
        onError={ ( e ) => console.error( "Audio loading error:", e ) }
      />
    </div>
  );
}
