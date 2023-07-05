const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelPlaylistSongs } = require('../../utils/indexPlaylistSongs');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Songs gagal ditambahkan ke playlists');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      JOIN playlist_songs ON songs.id = playlist_songs.song_id
      JOIN playlists ON playlist_songs.playlist_id = playlists.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBToModelPlaylistSongs);
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu di dalam playlists gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongId(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengkases resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }

    if (!rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsSongService;
