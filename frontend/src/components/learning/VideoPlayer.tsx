import React from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  // Kiểm tra nếu URL là YouTube embed
  const isYouTubeEmbed = url && url.includes('youtube.com/embed');
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
      <div className="aspect-w-16 aspect-h-9">
        {isYouTubeEmbed ? (
          <iframe
            src={url}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <video
            controls
            className="w-full h-full"
            poster="/video-placeholder.jpg"
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
    </div>
  );
};

export default VideoPlayer;