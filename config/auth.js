// config/auth.js

module.exports = {

    // TODO in a real application, these would be managed as ENV variables
    //      and kept outside of version control
    facebookAuth: {
        clientID    : '248804871953675',
        clientSecret: '1015c32e6c5c25d56c21e54f2a8cf1cc',
        callbackURL : 'http://localhost:3000/auth/facebook/callback'
    },
    
    twitterAuth: {
        consumerKey   : '8XHQ5KgqgkA99Gk8shBLYg',
        consumerSecret: 'ZOszrwx3OE6Fblx2g754mcMd7XOiVQDAaMcfOpW28',
        callbackURL   : 'http://localhost:3000/auth/twitter/callback'
    },
    
    googleAuth: {
        clientID    : '37165347347-32vffctd65ojkedchv5uq0pnufbftm38.apps.googleusercontent.com',
        clientSecret: 'd0YckpQu70BvzmRKt5HGaCEG',
        callbackURL : 'http://localhost:3000/auth/google/callback'
    }

};
