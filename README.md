# Monads

Ongoing ui/ux sketches for design protocols and automation tools.

The [define-define protocol](https://github.com/cdriesler/define-define) was fun to make and interesting to get working. But it was boring. Taking time to react and build up some fundamental skills before the next one.

Frontend is "mobile-first" and also "in heavy development" which simplifies to "probably-mobile-only" and "I'm sorry".

## Project Structure

* **/api**: express.js websocket server

* **/app**: vue gallery of interactive [svgar](https://github.com/WeWorkSandbox/svgar) drawings

## How to Run

Docker is the easiest:

* Run `docker-compose up` from the root directory
* Visit `http://localhost:9010` to see the gallery

If you'd like to just view the drawings without the "multiplayer" interactivity:

* Open a command prompt in the /app directory
* Run `npm install`
* Run `npm run serve`
* Visit `http://localhost:8080` to see the gallery
