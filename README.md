# Maxmind GeoipLite 2 Database API App and Docker container
Express app utilising Maxmind GeoLite2 database. The app updates the database file at 00:00 hrs on every Sunday.

### How to run?

```bash
$ npm install
$ node index.js
```

### How to resolve an IP address [API Endpoint]?

Send a query param of `?ip=A.B.C.D` at the end of the hosted URL
`
http://localhost:3000/?ip=A.B.C.D
`

### What is the response that we get?

```
{
    "ip": "A.B.C.D",
    "continent": "Asia",
    "country_code": "IN",
    "country_name": "India",
    "time_zone": "Asia/Kolkata",
    "latitude": 17.3753,
    "longitude": 78.4744,
    "accuracy_radius": 10,
    "city": "Hyderabad",
    "region_name": "Telangana"
}
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
