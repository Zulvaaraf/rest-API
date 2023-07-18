const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class CoverAlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal mengunggah cover. Id tidak ditemukan');
    }
  }
}

module.exports = CoverAlbumService;
