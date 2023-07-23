const autoBind = require('auto-bind');

class PlaylistSongsActivitesHandler {
  constructor(playlistActivitesService, playlistsService) {
    this._playlistActivitiesService = playlistActivitesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activity = await this._playlistActivitiesService.getActivitesPlaylists(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities: activity.map((activities) => ({
          username: activities.username,
          title: activities.title,
          action: activities.action,
          time: activities.time,
        })),
      },
    };
  }
}

module.exports = PlaylistSongsActivitesHandler;
