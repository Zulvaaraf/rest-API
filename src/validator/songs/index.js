const { SongValidatorSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validateResult = SongValidatorSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = SongValidator;
