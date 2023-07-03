import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

const URL = 'http://api.exchangeratesapi.io/latest?base=';
const API_KEY = '&access_key=' + process.env.CURRENCIES_API_KEY;

const BACKUP_CURRENCIES = {
  'success': true,
  'backup': true,
  'timestamp': 1687767063,
  'base': 'EUR',
  'date': '2023-06-26',
  'rates': { 'AED': 3.999119, 'AFN': 93.169011, 'ALL': 107.391529, 'AMD': 419.670437, 'ANG': 1.956142, 'AOA': 865.042839, 'ARS': 275.543207, 'AUD': 1.631575, 'AWG': 1.959824, 'AZN': 1.849472, 'BAM': 1.953264, 'BBD': 2.191574, 'BDT': 117.417523, 'BGN': 1.952437, 'BHD': 0.40918, 'BIF': 3067.373079, 'BMD': 1.088791, 'BND': 1.46832, 'BOB': 7.500535, 'BRL': 5.211937, 'BSD': 1.0854, 'BTC': 3.5839185e-5, 'BTN': 88.978322, 'BWP': 14.579335, 'BYN': 2.739278, 'BYR': 21340.305657, 'BZD': 2.187568, 'CAD': 1.43298, 'CDF': 2591.322688, 'CHF': 0.974871, 'CLF': 0.031648, 'CLP': 873.252043, 'CNY': 7.877945, 'COP': 4450.284392, 'CRC': 587.453324, 'CUC': 1.088791, 'CUP': 28.852964, 'CVE': 110.131031, 'CZK': 23.660531, 'DJF': 193.250821, 'DKK': 7.446668, 'DOP': 59.823413, 'DZD': 147.704301, 'EGP': 33.645057, 'ERN': 16.331867, 'ETB': 59.193089, 'EUR': 1, 'FJD': 2.421743, 'FKP': 0.856463, 'GBP': 0.855005, 'GEL': 2.858071, 'GGP': 0.856463, 'GHS': 12.526194, 'GIP': 0.856463, 'GMD': 64.786242, 'GNF': 9331.7961, 'GTQ': 8.510261, 'GYD': 229.570316, 'HKD': 8.523329, 'HNL': 26.722054, 'HRK': 7.595529, 'HTG': 150.327547, 'HUF': 369.372724, 'IDR': 16377.65024, 'ILS': 3.952361, 'IMP': 0.856463, 'INR': 89.331939, 'IQD': 1421.879677, 'IRR': 46028.643772, 'ISK': 148.892405, 'JEP': 0.856463, 'JMD': 167.502483, 'JOD': 0.772501, 'JPY': 155.840863, 'KES': 151.083804, 'KGS': 95.04972, 'KHR': 4478.266821, 'KMF': 492.378549, 'KPW': 979.91157, 'KRW': 1423.670414, 'KWD': 0.334662, 'KYD': 0.904542, 'KZT': 486.736868, 'LAK': 20664.355232, 'LBP': 16289.577123, 'LKR': 334.321993, 'LRD': 193.750391, 'LSL': 20.415013, 'LTL': 3.214917, 'LVL': 0.658599, 'LYD': 5.198297, 'MAD': 10.811058, 'MDL': 19.498038, 'MGA': 4933.593277, 'MKD': 61.426128, 'MMK': 2279.360976, 'MNT': 3741.285348, 'MOP': 8.753693, 'MRO': 388.698237, 'MUR': 49.488915, 'MVR': 16.723799, 'MWK': 1104.486012, 'MXN': 18.671243, 'MYR': 5.09173, 'MZN': 68.865945, 'NAD': 20.414969, 'NGN': 824.74849, 'NIO': 39.699176, 'NOK': 11.760751, 'NPR': 142.362744, 'NZD': 1.768708, 'OMR': 0.419186, 'PAB': 1.08543, 'PEN': 3.939248, 'PGK': 3.915915, 'PHP': 60.663627, 'PKR': 310.967237, 'PLN': 4.430019, 'PYG': 7904.807485, 'QAR': 3.964275, 'RON': 4.95324, 'RSD': 117.219363, 'RUB': 92.372739, 'RWF': 1251.574716, 'SAR': 4.084145, 'SBD': 9.058789, 'SCR': 14.628932, 'SDG': 654.910528, 'SEK': 11.684133, 'SGD': 1.473728, 'SHP': 1.324787, 'SLE': 19.625369, 'SLL': 21503.624568, 'SOS': 618.97624, 'SRD': 41.407827, 'STD': 22535.777612, 'SVC': 9.496842, 'SYP': 2735.622905, 'SZL': 20.266868, 'THB': 38.352659, 'TJS': 11.852943, 'TMT': 3.810769, 'TND': 3.365491, 'TOP': 2.56968, 'TRY': 27.959921, 'TTD': 7.377555, 'TWD': 33.797601, 'TZS': 2613.098491, 'UAH': 40.085146, 'UGX': 3988.966508, 'USD': 1.088791, 'UYU': 41.009006, 'UZS': 12449.062428, 'VEF': 2991818.292311, 'VES': 29.686842, 'VND': 25616.532722, 'VUV': 127.943177, 'WST': 2.921348, 'XAF': 655.100275, 'XAG': 0.047753, 'XAU': 0.000564, 'XCD': 2.942513, 'XDR': 0.809449, 'XOF': 655.112294, 'XPF': 119.821736, 'YER': 272.578984, 'ZAR': 20.33829, 'ZMK': 9800.424873, 'ZMW': 18.476546, 'ZWL': 350.590292 }
};

async function getCurrencyRates(req: express.Request, res: express.Response): Promise<void> {
  try {
    const base = req.params.base;

    let currencies = await fetch(URL + base + API_KEY)
      .then(res => res.status <= 400 ? res : Promise.reject(res))
      .then(res => res.json());

    // in case API limit reached in production
    if (!isDevelopment && !currencies.success) {
      if (base === 'EUR') currencies = BACKUP_CURRENCIES;
      else throw new Error('Invalid base provided.');
    }

    res.status(200);
    res.send(currencies);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}

export {
  getCurrencyRates
};
