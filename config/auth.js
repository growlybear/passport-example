// config/auth.js

module.exports = {
    
    facebookAuth: {
        clientID    : 'my-secret-clientID-here',    // app id
        clientSecret: 'my-client-secret-here',      // app secret
        callbackURL : 'http://localhost:3000/auth/facebook/callback'
    },
    
    twitterAuth: {
        consumerKey   : 'my-consumer-key-here',       // consumer id
        consumerSecret: 'my-client-secret-here',      // consumer secret
        callbackURL   : 'http://localhost:3000/auth/twitter/callback'
    },
    
    googleAuth: {
        clientID    : 'my-secret-clientID-here',    // app id
        clientSecret: 'my-client-secret-here',      // app secret
        callbackURL : 'http://localhost:3000/auth/google/callback'
    }

};
