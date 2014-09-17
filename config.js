module.exports = {

  // enter your configuration here...

  twitter: {
    consumer_key: '',       // API Key
    consumer_secret: '',    // API Secret
    access_token: '',
    access_token_secret: ''
  },

  // these values are Redis defaults for a local install
  redis: {
    host: '127.0.0.1',
    port: 6379,
    options: {
//    auth_pass: 'password' // enable only if needed
    }
  }
};
