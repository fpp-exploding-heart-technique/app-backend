module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    const userSchema  = new Schema({
      email: String,
      fbuserid: String,

    }, {collection: 'users'});

    const User = mongoose.model('User', eventSchema);

    const searchUsers = (query, callback) => {
      console.log("Searching users:", query);
      User.find(query, callback);
    };
    const createUser = (email, fbuserid, callback) => {
      console.log("Creating new user:", email, fbuserid);
      const usr = new User({
        'fbuserid' : fbuserid,
        'email'    : email
      });
      usr.save(callback);
    };


    return {

    }
}
