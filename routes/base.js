'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const Publication = require('./../models/publication');
const Follow = require('./../models/follow');

router.get('/', (req, res, next) => {
  let publications;
  Publication.find()
    .sort({ createdAt: -1 })
    .populate('author')
    .then((publicationDocuments) => {
      publications = publicationDocuments;
      return Follow.find({
        follower: req.user._id
      });
    })
    .then((follows) => {
      const idsOfPeopleFollowed = follows.map((follow) => follow.followee);
      return Publication.find({ author: idsOfPeopleFollowed })
        .sort({ createdAt: -1 })
        .populate('author');
    })
    .then((publicationsFromFollowed) => {
      const publicationsWithAdditionalInformation = publications.map(
        (publication) =>
          publication.getAddedInformation(req.user ? req.user._id : null)
      );
      const publicationsFromFollowedWithAdditionalInformation =
        publicationsFromFollowed.map((publication) =>
          publication.getAddedInformation(req.user ? req.user._id : null)
        );
      res.render('home', {
        publications: publicationsWithAdditionalInformation,
        publicationsFromFollowed:
          publicationsFromFollowedWithAdditionalInformation
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
