const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { playlistSongsActivityService, playlistSongsService, playlistsService, songsService, validator }) => {
    const playlistSongHandler = new PlaylistSongsHandler(playlistSongsActivityService, playlistSongsService, playlistsService, songsService, validator);
    server.route(routes(playlistSongHandler));
  },
};
