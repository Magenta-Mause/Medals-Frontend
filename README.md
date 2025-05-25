<p align="center">
    <a href="https://stratssync.com">
        <picture>
            <img src="https://raw.githubusercontent.com/Magenta-Mause/Medals-Frontend/refs/heads/main/public/logo.svg" alt="Medals" width="300" />
        </picture>
    </a>
</p>

<p align="center">Train smarter. Track better. Win medals.</p>

<p align="center">
  <a href="https://opensource.org/licenses/BSD-3-Clause">
    <img src="https://img.shields.io/badge/License-BSD_3--Clause-blue.svg" alt="License of medals" />
  </a>
  <img src="https://github.com/Magenta-Mause/Medals-Frontend/actions/workflows/build_frontend.yml/badge.svg">
</p>

<p align="center">
    <b>Medals-Frontend</b> - the frontend of <a href="https://stratssync.com">Medals</a>.
</p>

## Table of contents

- [What is Medals](#Medals)
- [Setup](#Setup)
  - [Requirements](#requirements)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Deployment](#Deployment)
  - [Official Deployment](#official-deployment)
  - [Custom Deployment](#custom-deployment)
- [Published Docker Images](#published-docker-images)

## Medals

Medals is a application to administer athletes for the [Deutsche Sportabzeichen](https://deutsches-sportabzeichen.de/). Trainers can administer their athletes, track the performances for different disciplines, add/remove swimming certificates, see wether the athlete is eligible to receive a [Deutsche Sportabzeichen](https://deutsches-sportabzeichen.de/). Athletes can see their own performances, wether they have a valid swimming certificate and if they are eligible for a [Deutsche Sportabzeichen](https://deutsches-sportabzeichen.de/), if not what they need to do to be eligible.

## Setup

### Requirements

- Node v.22.3.0
- npm v.10.8.1
- JDK21
- git v.2.45.1.windows.1

As of writing this those are the versions used to develop the application. Other software versions might work but are not tested.

### Frontend Setup

1. `git clone https://github.com/Magenta-Mause/Medals-Frontend.git`
2. `npm i`
3. `npm run dev`

The frontend should now be accessible on `http://localhost:5173`.

### Backend Setup

1. `git clone https://github.com/Magenta-Mause/Medals-Backend.git`

Now you need to start the [Medals-Backend](https://github.com/Magenta-Mause/Medals-Backend)

TODO

## Deployment

### Official Deployment

Medals has a official deployment that you can find with the following url: [https://stratssync.com/](https://stratssync.com/)

You can only use Medals if you are invited either by an administrator or a trainer. If that is not the case for you, but you still want to use the application you either need to deploy it [locally](#local-deployment) for you or make a [custom deployment](#custom-deployment). For the local deployment regard the [Medals-Deployment](https://github.com/Magenta-Mause/Medals-Deployment) documentation.

### Custom Deployment

To create your own deployment you need to change the environment variables in the `.env`-file to your respective backend url. After that you have to run `npm run build:image` to create the docker image locally. For further information on how to deploy your own full deployment regard the [Medals-Deployment](https://github.com/Magenta-Mause/Medals-Deployment) documentation.

## Published Docker Images

On every push to main or if the `Build Frontend` workflow is dispatched manually two Docker images are published. The images can be found on [Docker Hub](https://hub.docker.com/repository/docker/ecofreshkaese/medals-frontend/general).

The latest image is used for the official deployment while the image with the local tag can be used for local deployments.
