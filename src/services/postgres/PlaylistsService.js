const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');
// const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlists gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // async verifyPlaylistOwner(id, owner) {
  //   const query = {
  //     text: 'SELECT * FROM playlists WHERE id = $1',
  //     values: [id],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows.length) {
  //     throw new NotFoundError('Playlist tidak ditemukan');
  //   }

  //   const playlist = result.rows[0];
  //   if (playlist.owner !== owner) {
  //     throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  //   }
  // }
}

module.exports = PlaylistsService;
