module.exports = {
  mongoURI:
    process.env.MONGODB_URI ||
    'mongodb://Andrew:phantom13@ds153556.mlab.com:53556/nerdysoft',
  jwt: 'secret-key'
};
