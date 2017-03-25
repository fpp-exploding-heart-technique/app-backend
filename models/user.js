module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    const userSchema  = new Schema({
      email: String,
      facebook: String,

    }, {collection: 'users'});

    const User = mongoose.model('User', userSchema);

    const find = (query, callback) => {
      console.log("Searching user:", query);
      User.find(query, callback);
    };

    const findByFBId = (facebook, callback) => {
      console.log("Searching user:", facebook);
      User.findOne({'facebook': facebook}, callback);
    };

    const createUser = (email, facebook, callback) => {
      console.log("Creating new user:", email, facebook);
      const usr = new User({
        'facebook' : facebook,
        'email'    : email
      });
      usr.save(callback);
    };


    return {
      find     : find,
      //findOne  : findOne,
      findByFBId : findByFBId,

      createUser: createUser
    }
}
