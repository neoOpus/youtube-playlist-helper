const playlists = [
  {
    id: 'pl-1',
    title: 'Seed Playlist 1',
    videos: ['v1', 'v2', 'v3'],
    loadedVideos: [
      { videoId: 'v1', title: 'Video 1 tutorial', channel: 'C1', rating: 5, aiTags: ['AI-Enhanced'] },
      { videoId: 'v2', title: 'Video 2 review', channel: 'C2', rating: 4, aiTags: ['Analysis'] },
      { videoId: 'v3', title: 'Video 3 rick', channel: 'C3', rating: 1, aiTags: ['Meme'] }
    ],
    timestamp: Date.now(),
    saved: true
  },
  {
    id: 'pl-2',
    title: 'Seed Playlist 2',
    videos: ['v4', 'v5'],
    loadedVideos: [
      { videoId: 'v4', title: 'Video 4 coding', channel: 'C4', rating: 5, aiTags: ['Educational'] },
      { videoId: 'v5', title: 'Video 5 music', channel: 'C5', rating: 3, aiTags: ['Music'] }
    ],
    timestamp: Date.now(),
    saved: true
  }
];

localStorage.setItem('playlist_pl-1', JSON.stringify(playlists[0]));
localStorage.setItem('playlist_pl-2', JSON.stringify(playlists[1]));
localStorage.setItem('PlaylistIdCounter', '2');
