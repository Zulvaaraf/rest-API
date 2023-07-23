const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(albumlikesService, albumsService) {
    this._albumlikesService = albumlikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._albumlikesService.checkLike(albumId, userId);
    await this._albumlikesService.addAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkankan album yang disukai',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumLikesHandler;
