# Maxmind GeoipLite 2 Database API App and Docker container
Express app utilising Maxmind GeoLite2 database. The app updates the database file at 00:00 hrs on every Sunday.

### How to run?
# HOW TO RUN

1. replace the ________________ parts in deployment/crons.yml with your:
  * FCSAPI key 
  * MAXMIND key

Ours are in secrets.md (THAT FILE MUST NOT BE COMMITTED, THIS IS A PUBLIC REPO!)
https://bellacanvas.sharepoint.com/:t:/r/sites/Web/Shared%20Documents/Alo%20Software%20Development/Geolocation%20and%20Currency%20service%20api%20keys/secrets.md?csf=1&web=1&e=e4vfyG

2. replace the ---YOUR SPACES BUCKET HERE--- in the service.yml with your digital ocean bucket and check the region in that same url too
3. apply the service.yml, ingress.yml, and crons.yml in your kubernetes cluster

# ORIGIN_WHITELIST

Any number of hosts with protocol, delimited with ONE SPACE
Example value:
```
https://www.example.com https://example.com https://devsite.com https://anothersite.com
```

# commands

Assuming you have the environment variables correctly set (ORIGIN_WHITELIST is space-delimited, just a list of domains allowed to use this)

docker build . -t ip-express-test
docker run --rm --name expressipthing -p 4040:80 -e MAXMIND_DB_URL -e EXCHANGE_RATES_URL -e ORIGIN_WHITELIST  ip-express-test


### How to use the user's apparent IP?

Just hit the root of the service: e.g. http://localhost:3000/ - it'll look at the request headers to figure out the IP to use.

### How to fake a hardcoded IP address [API Endpoint]?

Send a query param of `?ip=A.B.C.D` at the end of the hosted URL
`
http://localhost:3000/?ip=A.B.C.D
`

### What is the response that we get?

```
{"status":"ok","ip":"131.111.150.25","country_code":"GB","country_name":"United Kingdom","is_eu":true,"currency":"GBP","zip":"CB25","time_zone":"Europe/London","latitude":52.2599,"longitude":0.2288,"accuracy_radius":20,"continent":"Europe","city":"Cambridge","region_name":"England"}
```

## Is there a docker image for this?
You bet! You can use the image by executing (parameters of `-p 3000:3000` will enable you to access the API from the URL http://localhost:3000/?ip=A.B.C.D).
Read more at official [Docker Repository](https://hub.docker.com/r/mib200/geoiplite2-maxmind/)
```bash
$ docker container run -d --name geoip-server -p 3000:3000 mib200/geoiplite2-maxmind
```


## Features

* Downloads the latest DB file automatically from Maxmind website.
* Auto updates the database file every week.
* Returns an absolute clean JSON response depending on how many fields are found in Maxmind DB response.

## References
 * Based on offical Maxmind package https://www.npmjs.com/package/maxmind
 * GeoLite2 Free Downloadable Databases http://dev.maxmind.com/geoip/geoip2/geolite2/


## License

MIT
