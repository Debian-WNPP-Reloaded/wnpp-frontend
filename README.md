# Front End Web Application for Debian WNPP Reloaded

Inspired by the original [wnpp.debian.net](https://github.com/hartwork/wnpp.debian.net/)
 page, this project provides a front end app written in ReactJS for interacting with Debian's Ultimate Debian Database (UDD).

---

## Setup dev enviroment

### Start back end service container
```bash
docker network create wnpp-net
docker run -d \
  --name wnpp-backend \
  --network wnpp-net \
  -p 8080:8080 \
  -e PRODUCTION_DOMAIN=http://localhost:5173 \
  gbarrantes/wnpp-reloaded-backend-service
```

### Install dependencies
```bash
npm install
```

### Run development server

```bash
npm run dev
```

Server is available at [http://localhost:5173/](http://localhost:5173/)

Thanks to Sebastian Pipping for enabling the development of this project.

> [!IMPORTANT]
> Currently is still a WIP.
