const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  verison: '1.0.0',
  register: async (server, { storageService, coverAlbumService, validator }) => {
    const uploadHandler = new UploadsHandler(storageService, coverAlbumService, validator);
    server.route(routes(uploadHandler));
  },
};
