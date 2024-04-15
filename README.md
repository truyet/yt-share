# Funny Movies

## Introduction

The website helps users who share youtube video to the website following:

* User can register with email and password then login with registered information
* Registered account can share youtube video to web.
* Shared video will notify to other users using websocket with socket.io
* Other user can like / dislike the shared video

This website use Nextjs to optimize and enhance SEO.

## Projects Structure

* `auth-service`: authentication service provide login, register, profile and get profiles
* `post-service`: post service provide create, get, and interaction (like, dislike) a video
* `realtime-server`: websocket server listen event and broadcast to others
* `web`: website ui

## Prerequisites

* [Docker & Docker Compose](https://docs.docker.com/desktop/)
* [Node version 18 or above](https://nodejs.org/en/download/package-manager)
* Primsa with sqlite

## Installation & Configuration

* Run `./setup.sh` to run install node module for all projects.

## Database

Project use sqlite with prisma for development, you need to migrate database with prisma:

* `auth-service`: enter service directory and run `yarn prisma migrate dev --name init`
* `post-service`: enter service directory and run `yarn prisma migrate dev --name init`

## Unit Testing

* `auth-service`: enter service directory and run `yarn test`
* `post-service`: enter service directory and run `yarn test`

## Running the Application in development

* Run command `docker compose up --build`
* After docker composr run successful, you can access [Funny Movie](http://localhost:8000/) to open website.


### Demo

Demo link [Funny Movie](http://68.183.229.85:8000/)

Video

https://github.com/truyet/yt-share/assets/710057/181e1fa5-ab4a-4df2-884a-b15547689530

## Troubleshooting

### Database connection error
Sometimes you will have the database error then you need to check env `DATABASE_URL` that already config in `.env` file

### Service build fail or missing library
You can try to delete `node_modules` and reinstall with `yarn`

### Service return 500
Check service log with message `The table does not exist in the current database.` 
It because prisma still not run migration `yarn prisma migrate dev --name init`


## Project Design

![Untitled Diagram drawio](https://github.com/truyet/yt-share/assets/710057/50eba256-474f-4089-8167-f496617bf9b1)




