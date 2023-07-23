const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikeHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
