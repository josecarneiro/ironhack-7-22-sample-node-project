// Hola mundo

'use strict';

const express = require('express');
const routeGuardMiddleware = require('./../middleware/route-guard');
const User = require('./../models/user');
const Publication = require('./../models/publication');
const Follow = require('./../models/follow');
const upload = require('./../upload');

const profileRouter = express.Router();

profileRouter.get('/edit', routeGuardMiddleware, (req, res, next) => {
  res.render('profile/edit', { profile: req.user });
});

profileRouter.post(
  '/edit',
  routeGuardMiddleware,
  upload.single('picture'),
  (req, res, next) => {
    const { name, email, username } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    // Allow updating profile picture,
    // check for duplicate email or username
    User.findByIdAndUpdate(req.user._id, { name, email, username, picture })
      .then(() => {
        res.redirect(`/profile/${req.user._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

profileRouter.post('/delete', routeGuardMiddleware, (req, res, next) => {
  User.findByIdAndDelete(req.user._id)
    .then(() => {
      // Consider whether to delete publications made by user
      // as well as follow
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

profileRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  let user, publications;
  User.findById(id)
    .then((userDocument) => {
      user = userDocument;
      return Publication.find({
        author: id
      })
        .sort({ createdAt: -1 })
        .populate('author');
    })
    .then((publicationDocuments) => {
      publications = publicationDocuments;
      if (req.user) {
        return Follow.findOne({
          follower: req.user._id,
          followee: id
        });
      } else {
        return null;
      }
    })
    .then((follow) => {
      // We're only evaluating the expression String(req.user._id) === id
      // if we know we have an authenticated user
      const isOwnProfile = req.user ? String(req.user._id) === id : false;
      const publicationsWithAdditionalInformation = publications.map(
        (publication) =>
          publication.getAddedInformation(req.user ? req.user._id : null)
      );
      res.render('profile/detail', {
        profile: user,
        publications: publicationsWithAdditionalInformation,
        follow,
        isOwnProfile
      });
    })
    .catch((error) => {
      next(error);
    });
});

profileRouter.post('/:id/follow', routeGuardMiddleware, (req, res, next) => {
  const { id } = req.params;
  Follow.create({
    follower: req.user._id,
    followee: id
  })
    .then(() => {
      res.redirect(`/profile/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

profileRouter.post('/:id/unfollow', routeGuardMiddleware, (req, res, next) => {
  const { id } = req.params;
  Follow.findOneAndDelete({
    follower: req.user._id,
    followee: id
  })
    .then(() => {
      res.redirect(`/profile/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = profileRouter;
