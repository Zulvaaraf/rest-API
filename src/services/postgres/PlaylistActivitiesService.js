const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async postActivity(playlistId, songId, userId, action) {
    const id = `playlistSongsActivitiy-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist activitiy gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivitesPlaylists(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_songs_activities.action, playlist_songs_activities.time
        FROM playlist_songs_activities
        RIGHT JOIN users ON users.id = playlist_songs_activities.user_id
        RIGHT JOIN songs ON songs.id = playlist_songs_activities.song_id
        WHERE playlist_songs_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = PlaylistSongsActivitiesService;
