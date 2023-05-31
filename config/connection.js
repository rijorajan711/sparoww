var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://rijo1:rijo123@cluster0.6fha0yb.mongodb.net/sparow');
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

