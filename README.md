# IRONCHAT - Express app

It allows ironhack students to publish and discuss tech related topics. Users can follow each other and stay up to date on their interests.

## Pages

Home - List latest publications. For authenticated users, display form that allows for creation of new publication. For visitors, we display sign in and sign up links.
Publication edit - Allows user to edit/delete one of their publications.
Profile - Displays information about user, as well as their latest publications, and option to follow (if user is authenticated).
Profile Edit - Allows authenticated user to edit/delete their existing profile.

Log In - Allows user to log in.
Sign Up - Allows new user to sign up.

## Route Handlers

GET - '/' - Load list of latest publications, pass them through data object when rendering home page.

POST - '/publication/create' - Handles publication creation form submission.
GET - '/publication/:id/edit' - Load existing publication, render edit form.
POST - '/publication/:id/edit' - Handle publication edit form submission.
POST - '/publication/:id/delete' - Handle publication delete form submission.

GET - '/profile/edit' - Load authenticated user, render edit profile form.
POST - '/profile/edit' - Handle edit profile form submission.
POST - '/profile/delete' - Handle profile deletion form submission.
GET - '/profile/:id' - Load existing user, render profile page.
POST - '/profile/:id/follow' - Handle follow form submission.
POST - '/profile/:id/unfollow' - Handle unfollow form submission.

GET - '/authentication/log-in' - Render log in page.
POST - '/authentication/log-in' - Handle log in form submission.
GET - '/authentication/sign-up' - Render sign up page.
POST - '/authentication/sign-up' - Handle sign up form submission.

## Models

### Publication

message: String, required, maxlength: 300
author: ObjectId, ref: 'User', required
picture: String

timestamps: true

### Follow

follower: ObjectId, ref: 'User', required
followee: ObjectId, ref: 'User', required

timestamps: true

### User

name: String, required
email: String, required
username: String, required
passwordHashAndSalt: String, required
picture: String

## Other considerations

- Add partials.
- Add hbs date helper.
- Style with bootstrap.
- Add cloudinary, multer, multer-storage-cloudinary

## Wishlist

### Pages

Profile list of followers - Lists followers for a single profile.
Profile list of follows - Lists follows for a single profile.
