const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, coverAlbumService, validator) {
    this._storageService = storageService;
    this._coverAlbumService = coverAlbumService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._coverAlbumService.addAlbumCover(id, coverUrl);
    const response = h.response({
      status: 'success',
      message: 'Cover album berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
