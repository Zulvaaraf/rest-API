require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

const albums = require('./api/albums');
const AlbumHandler = require('./api/albums/handler');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsHandler = require('./api/songs/handler');
const SongValidator = require('./validator/songs');

const init = async () => {
  const albumsHandler = new AlbumHandler();
  const songsHandler = new SongsHandler();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsHandler,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsHandler,
        validator: SongValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(500);
      console.log(response.message);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
