/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const fetch = require('node-fetch');
const maxmind = require('maxmind');
const fs = require('fs-extra');
const tar = require('tar');
const path = require('path');
const schedule = require('node-schedule');
const { exit } = require('process');

const currencies = {
  BD: 'BDT',  
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BA: 'BAM',
  BB: 'BBD',
  WF: 'XPF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BT: 'BTN',
  JM: 'JMD',
  BV: 'NOK',
  BW: 'BWP',
  WS: 'WST',
  BQ: 'USD',
  BR: 'BRL',
  BS: 'BSD',
  JE: 'GBP',
  BY: 'BYR',
  BZ: 'BZD',
  RU: 'RUB',
  RW: 'RWF',
  RS: 'RSD',
  TL: 'USD',
  RE: 'EUR',
  TM: 'TMT',
  TJ: 'TJS',
  RO: 'RON',
  TK: 'NZD',
  GW: 'XOF',
  GU: 'USD',
  GT: 'GTQ',
  GS: 'GBP',
  GR: 'EUR',
  GQ: 'XAF',
  GP: 'EUR',
  JP: 'JPY',
  GY: 'GYD',
  GG: 'GBP',
  GF: 'EUR',
  GE: 'GEL',
  GD: 'XCD',
  GB: 'GBP',
  GA: 'XAF',
  SV: 'USD',
  GN: 'GNF',
  GM: 'GMD',
  GL: 'DKK',
  GI: 'GIP',
  GH: 'GHS',
  OM: 'OMR',
  TN: 'TND',
  JO: 'JOD',
  HR: 'HRK',
  HT: 'HTG',
  HU: 'HUF',
  HK: 'HKD',
  HN: 'HNL',
  HM: 'AUD',
  VE: 'VEF',
  PR: 'USD',
  PS: 'ILS',
  PW: 'USD',
  PT: 'EUR',
  SJ: 'NOK',
  PY: 'PYG',
  IQ: 'IQD',
  PA: 'PAB',
  PF: 'XPF',
  PG: 'PGK',
  PE: 'PEN',
  PK: 'PKR',
  PH: 'PHP',
  PN: 'NZD',
  PL: 'PLN',
  PM: 'EUR',
  ZM: 'ZMK',
  EH: 'MAD',
  EE: 'EUR',
  EG: 'EGP',
  ZA: 'ZAR',
  EC: 'USD',
  IT: 'EUR',
  VN: 'VND',
  SB: 'SBD',
  ET: 'ETB',
  SO: 'SOS',
  ZW: 'ZWL',
  SA: 'SAR',
  ES: 'EUR',
  ER: 'ERN',
  ME: 'EUR',
  MD: 'MDL',
  MG: 'MGA',
  MF: 'EUR',
  MA: 'MAD',
  MC: 'EUR',
  UZ: 'UZS',
  MM: 'MMK',
  ML: 'XOF',
  MO: 'MOP',
  MN: 'MNT',
  MH: 'USD',
  MK: 'MKD',
  MU: 'MUR',
  MT: 'EUR',
  MW: 'MWK',
  MV: 'MVR',
  MQ: 'EUR',
  MP: 'USD',
  MS: 'XCD',
  MR: 'MRO',
  IM: 'GBP',
  UG: 'UGX',
  TZ: 'TZS',
  MY: 'MYR',
  MX: 'MXN',
  IL: 'ILS',
  FR: 'EUR',
  IO: 'USD',
  SH: 'SHP',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NA: 'NAD',
  VU: 'VUV',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NZ: 'NZD',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  CK: 'NZD',
  XK: 'EUR',
  CI: 'XOF',
  CH: 'CHF',
  CO: 'COP',
  CN: 'CNY',
  CM: 'XAF',
  CL: 'CLP',
  CC: 'AUD',
  CA: 'CAD',
  CG: 'XAF',
  CF: 'XAF',
  CD: 'CDF',
  CZ: 'CZK',
  CY: 'EUR',
  CX: 'AUD',
  CR: 'CRC',
  CW: 'ANG',
  CV: 'CVE',
  CU: 'CUP',
  SZ: 'SZL',
  SY: 'SYP',
  SX: 'ANG',
  KG: 'KGS',
  KE: 'KES',
  SS: 'SSP',
  SR: 'SRD',
  KI: 'AUD',
  KH: 'KHR',
  KN: 'XCD',
  KM: 'KMF',
  ST: 'STD',
  SK: 'EUR',
  KR: 'KRW',
  SI: 'EUR',
  KP: 'KPW',
  KW: 'KWD',
  SN: 'XOF',
  SM: 'EUR',
  SL: 'SLL',
  SC: 'SCR',
  KZ: 'KZT',
  KY: 'KYD',
  SG: 'SGD',
  SE: 'SEK',
  SD: 'SDG',
  DO: 'DOP',
  DM: 'XCD',
  DJ: 'DJF',
  DK: 'DKK',
  VG: 'USD',
  DE: 'EUR',
  YE: 'YER',
  DZ: 'DZD',
  US: 'USD',
  UY: 'UYU',
  YT: 'EUR',
  UM: 'USD',
  LB: 'LBP',
  LC: 'XCD',
  LA: 'LAK',
  TV: 'AUD',
  TW: 'TWD',
  TT: 'TTD',
  TR: 'TRY',
  LK: 'LKR',
  LI: 'CHF',
  LV: 'EUR',
  TO: 'TOP',
  LT: 'LTL',
  LU: 'EUR',
  LR: 'LRD',
  LS: 'LSL',
  TH: 'THB',
  TF: 'EUR',
  TG: 'XOF',
  TD: 'XAF',
  TC: 'USD',
  LY: 'LYD',
  VA: 'EUR',
  VC: 'XCD',
  AE: 'AED',
  AD: 'EUR',
  AG: 'XCD',
  AF: 'AFN',
  AI: 'XCD',
  VI: 'USD',
  IS: 'ISK',
  IR: 'IRR',
  AM: 'AMD',
  AL: 'ALL',
  AO: 'AOA',
  AQ: '',
  AS: 'USD',
  AR: 'ARS',
  AU: 'AUD',
  AT: 'EUR',
  AW: 'AWG',
  IN: 'INR',
  AX: 'EUR',
  AZ: 'AZN',
  IE: 'EUR',
  ID: 'IDR',
  UA: 'UAH',
  QA: 'QAR',
  MZ: 'MZN',
};
const euPlacesList = [
  'AD',
  'AI',
  'AT',
  'AW',
  'AX',
  'BE',
  'BG',
  'BL',
  'BM',
  'CH',
  'CW',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FK',
  'FR',
  'GB',
  'GF',
  'GG',
  'GI',
  'GI',
  'GL',
  'GP',
  'GR',
  'GS',
  'HR',
  'HU',
  'IE',
  'IM',
  'IO',
  'IT',
  'JE',
  'KY',
  'LI',
  'LT',
  'LU',
  'LV',
  'MC',
  'ME',
  'MF',
  'MQ',
  'MS',
  'MT',
  'NC',
  'NL',
  'PF',
  'PL',
  'PM',
  'PN',
  'PT',
  'RE',
  'RO',
  'SE',
  'SH',
  'SI',
  'SK',
  'SM',
  'SX',
  'TC',
  'TF',
  'VA',
  'VG',
  'WF',
  'YT',
];
const originWhitelist = process.env.ORIGIN_WHITELIST.split(' ');

const resolve = file => path.resolve(__dirname, file);
const app = express();
const exchangeRatesUrl = process.env.EXCHANGE_RATES_URL;
const downloadUrl = process.env.MAXMIND_DB_URL;

if (!exchangeRatesUrl || !downloadUrl) {
  console.error('Forgot to pass in the env your EXCHANGE_RATES_URL or MAXMIND_DB_URL');
  exit(1);
}

let ipLookup;

const euPlacesMap = {};
euPlacesList.forEach((code) => { euPlacesMap[code] = true; });

function createDbInstance() {
  ipLookup = maxmind.openSync(resolve('./ipDataBase.mmdb'), {
    cache: {
      max: 50000, // Max items in cache, by default it's 6000
    },
    watchForUpdates: true,
  });
}

async function updateExchangeRates() {
  try {
    const fileName = 'exchangeRates.json';
    const responseFile = await fetch(exchangeRatesUrl);
    const tmpFileStream = fs.createWriteStream(`${fileName}.tmp`);
    responseFile.body.pipe(tmpFileStream).on('finish', () => {
      fs.move(resolve(`./${fileName}.tmp`), resolve(`./${fileName}`), {
        overwrite: true,
      });
      console.log(' [x] Exchange rates file downloaded and saved');
    });
  } catch (e) {
    console.error(
      ' [x] Updating exchange rates failed with error: ',
      e.message,
    );
  }
}

async function fetchAndProcessFile() {
  const fileName = downloadUrl.split('/').pop();

  try {
    const responseFile = await fetch(downloadUrl);
    const tmpFileStream = fs.createWriteStream(fileName);
    responseFile.body.pipe(tmpFileStream).on('finish', () => {
      console.log(' [x] Compressed DB file downloaded and saved');
      const filePath = resolve(`./${fileName}`);
      tar
      .extract({
        file: filePath,
        newer: true,
      })
      .then(() => {
        fs.readdir(resolve('./'), (err, fileNames) => {
          const extractedFolder = fileNames.find(file =>
            !path.extname(file) && file.toLowerCase().includes('geolite'));
          const extractedFolderPath = resolve(`./${extractedFolder}`);
          fs.readdir(extractedFolderPath, async (_err, subFolderFiles) => {
            const ipDatabaseFile = subFolderFiles.find(file => path.extname(file).toLowerCase() === '.mmdb');
            try {
              await fs.move(
                resolve(`./${extractedFolder}/${ipDatabaseFile}`),
                resolve('./ipDataBase.mmdb'),
                {
                  overwrite: true,
                },
              );
              createDbInstance();
              fs.remove(filePath);
              fs.remove(extractedFolderPath);
              console.log(' [x] DB file processed and ready');
            } catch (e) {
              console.error(
                ' [x] Move of processed file failed with error: ',
                e.message,
              );
              console.info(' [x] Using older file');
            }
          });
        });
      });
    });
  } catch (e) {
    console.error(
      ' [x] Processing of older file failed with error: ',
      e.message,
    );
  }
}

if (fs.existsSync(resolve('./ipDataBase.mmdb'))) {
  createDbInstance();
}

console.log(' [x] Scheduling the task to fetch the database at 00:00 hrs on every Sunday');
schedule.scheduleJob(
  {
    hour: 0,
    minute: 0,
    dayOfWeek: 0,
  },
  () => {
    console.log('Scheduled task to be executed now');
    fetchAndProcessFile();
  },
);

console.log(' [x] Scheduling the task to fetch the exchange rates every hour on the :03');
schedule.scheduleJob('3 * * * *', () => {
  console.log('Scheduled task to be executed now');
  updateExchangeRates();
});

updateExchangeRates();
fetchAndProcessFile();

/*
  Setup the actual server code
 */
app.set('trust proxy', true);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    if (!origin) return callback(null, true);
    if (originWhitelist.indexOf(origin) === -1) {
      const message = 'Cannot allow access from this origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
}));

app.get('/exchange', (req, res) => {
  res.status(200);
  res.type('json');
  res.sendFile(resolve('./exchangeRates.json'));
});

app.all('/', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const ip = req.query.ip || req.ip;

    if (!ip) {
      return res.status(422).json({
        message: 'IP is required',
        status: 'failed',
      });
    }

    const lookupObj = ipLookup.get(ip);
    const responseObj = {
      status: 'ok',
      ip,
    };

    try {
      if (lookupObj === null) {
        res.header('retry-after', '10');
        /* "Temporarily" unavailable because the implication is that this condition will
          be resolved by you moving to an IP that isn't so weird. In testing this pretty much can only happen
          when you are coming from the localhost. */
        res.status(503).json({
          status: 'error',
          message: 'No data found for this IP',
          ip,
        });
        return null;
      }
      // console.log(lookupObj);
      responseObj.country_code = lookupObj.country ? lookupObj.country.iso_code : null;
      responseObj.country_name = lookupObj.country ? lookupObj.country.names.en : null;
      responseObj.is_eu = euPlacesMap[responseObj.country_code] || false;
      responseObj.currency = currencies[responseObj.country_code] || 'USD';
      if (lookupObj.postal && lookupObj.postal.code) {
        responseObj.zip = lookupObj.postal.code.toString();
      } else {
        responseObj.zip = null;
      }
      if (lookupObj.location) {
        responseObj.time_zone = lookupObj.location.time_zone;
        responseObj.latitude = lookupObj.location.latitude;
        responseObj.longitude = lookupObj.location.longitude;
        responseObj.accuracy_radius = lookupObj.location.accuracy_radius;
        responseObj.metro_code = lookupObj.location.metro_code;
      } else {
        responseObj.time_zone = null;
        responseObj.latitude = null;
        responseObj.longitude = null;
        responseObj.accuracy_radius = null;
        responseObj.metro_code = null;
      }
      responseObj.continent = lookupObj.continent
        ? lookupObj.continent.names.en
        : null;
      responseObj.city = lookupObj.city ? lookupObj.city.names.en : null;
      responseObj.region_name = (lookupObj.subdivisions && lookupObj.subdivisions[0])
        ? lookupObj.subdivisions[0].names.en
        : null;
    } catch (err) {
      console.error(err);
    }
    res.header('cache-control', 'max-age=43200,private,immutable');

    res.json(responseObj);
  } catch (err) {
    if (ipLookup === undefined) {
      res.header('retry-after', '10');
      res.status(503).json({
        status: 'error',
        message: 'Try again in a few seconds!',
      });
    } else {
      console.error('Oh boy, something really bad happened: ', err.message, err.stack);
      res.status(500).json({
        message: 'unable to process request',
        error: err.toString(),
      });
    }
  }
});

// trying to make it die gracefully
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
function shutDown() {
  console.log('Exiting...\n');
  process.exit(0);
}
// / end this shutdown stuff

console.log(' [x] Starting first time fetch of the IP Database');
const portNo = parseInt(process.env.PORT, 10);
app.listen(portNo, () =>
  console.log(` [x] IP Resolver app listening on port ${portNo}`));
