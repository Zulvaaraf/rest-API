/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_user.id');
};
