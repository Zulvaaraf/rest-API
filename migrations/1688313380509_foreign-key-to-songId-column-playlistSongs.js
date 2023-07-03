/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id.playlists.id', 'FOREIGN KEY(song_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id.playlists.id');
};
