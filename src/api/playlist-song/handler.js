class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.verifySongId(songId);

    const playlistSongId = await this._playlistSongsService.addPlaylistSong({ playlistId, songId });
    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = PlaylistSongsHandler;
