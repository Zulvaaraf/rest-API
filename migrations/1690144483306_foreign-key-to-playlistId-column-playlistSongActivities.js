exports.up = (pgm) => {
  pgm.addConstraint('playlist_songs_activities', 'fk_playlist_songs_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs_activities', 'fk_playlist_songs_activities.playlist_id_playlists.id');
};
