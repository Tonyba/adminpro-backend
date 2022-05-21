const { Schema, model } = require('mongoose');

const MedicSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
});

MedicSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('Medic', MedicSchema);
