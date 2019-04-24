![together](together-logo.png)

The together project is an [IndieWeb](http://indieweb.org)
environment for reading, discovering, and interacting with content. You might
call it a [reader](http://indieweb.org/reader).

<div>
<a href="https://indieweb.org/images/7/73/together-classic-view-2018-11-20.png">
  <img width="250" align="left" src="https://indieweb.org/images/thumb/7/73/together-classic-view-2018-11-20.png/1200px-together-classic-view-2018-11-20.png">
</a>
<a href="https://indieweb.org/images/thumb/7/73/together-classic-view-2018-11-20.png/1200px-together-classic-view-2018-11-20.png">
  <img width="250" align="left" src="https://indieweb.org/images/thumb/4/44/together-timeline-view-2018-11-20.png/1200px-together-timeline-view-2018-11-20.png">
</a>
<a href="https://indieweb.org/images/c/c3/together-gallery-view-2018-11-20.png">
  <img width="250" align="left" src="https://indieweb.org/images/thumb/c/c3/together-gallery-view-2018-11-20.png/1200px-together-gallery-view-2018-11-20.png">
</a>
<br>
<a href="https://indieweb.org/images/c/c3/together-gallery-view-2018-11-20.png">
  <img width="250" align="left" src="https://indieweb.org/images/c/c3/together-gallery-view-2018-11-20.png">
</a>
<a href="https://indieweb.org/images/d/dc/together-dark-mode-2018-11-20.png">
  <img width="250" src="https://indieweb.org/images/thumb/d/dc/together-dark-mode-2018-11-20.png/1200px-together-dark-mode-2018-11-20.png">
</a>
</div>

---

Together is a [React](https://facebook.github.io/react/) based application. To
use it, you'll need a website that supports
[Micropub](https://indieweb.org/Micropub),
[IndieAuth](https://indieweb.org/IndieAuth) and
[Microsub](https://indieweb.org/Microsub).

## Running locally in development mode

You'll need `node` and `npm` installed.
Once you have them, you can simply check out the repository and run `npm install`, followed
by `npm run start`. The server part runs on port 3001 by default
and a hot reloading frontend is available on port 3000 (ideal for frontend development)

## Running locally in production mode

First, generate a production package:

- `npm run build`

Then, run the production package at port 8000:

- `/usr/bin/node server --port 8000`

---

Want to join in and get involved? Open some issues or submit PRs!
