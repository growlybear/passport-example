// config/auth.js

module.exports = {

    // TODO in a real application, these would be managed as ENV variables
    //      and kept outside of version control
    facebookAuth: {
        clientID    : '248804871953675',                    // app id
        clientSecret: '1015c32e6c5c25d56c21e54f2a8cf1cc',   // app secret
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
