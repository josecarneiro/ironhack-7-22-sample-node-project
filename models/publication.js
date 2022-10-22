'use strict';

const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 300
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    picture: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

publicationSchema.methods.getAddedInformation = function (userId) {
  const publication = this;
  const hasBeenUpdated =
    String(publication.createdAt) !== String(publication.updatedAt);
  const isOwn = userId
    ? String(userId) === String(publication.author._id)
    : false;
  return {
    // Get a JSON compatible version of the publication document
    ...publication.toJSON(),
    hasBeenUpdated,
    isOwn
  };
};

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;
