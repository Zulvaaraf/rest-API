const PlaylistSongsActivitesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivity',
  version: '1.0.0',
  register: async (server, { playlistActivitesService, playlistsService }) => {
    const playlistActivityHandler = new PlaylistSongsActivitesHandler(playlistActivitesService, playlistsService);
    server.route(routes(playlistActivityHandler));
  },
};
