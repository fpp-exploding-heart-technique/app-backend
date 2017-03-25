module.exports = (mongoose) => {
    var Schema = mongoose.Schema;

    const userSchema  = new Schema({
      location: {
        type: {type:String},
        //'index' : '2dsphere',
        coordinates: {
          'type' : [Number],
          'required' : true
        }
      },
      name: String,
      description: String
    }, {collection: 'pois'});

    const POI = mongoose.model('Poi', userSchema);

    // valid reading
    const description_limit = 1500;
    const name_limit = 30;
    const readLocation = (loc) => {
      if(loc){
        loc = loc.split(',');
        if( loc.length != 2) return false;
        try{
          loc = loc.map(Number);

          return {type:"Point", coordinates:loc};
        } catch(err) { // type error
          console.error(err.message);
          return null;
        }
      } else
        return null;
    };

    const readArr = (reader) => {
      return (arrStr) => {
        var arr;
        try {
          arr = JSON.parse(arrStr);
        } catch(err) {
          console.error(err, arr);
          return null;
        }
        arr = arr.map(reader);
        if(null in arr) return null;
        return arr;
      };
    };

    const findById = (poiId, callback) => {
      POI.findById(poiId).lean().exec(callback);
    };
    const find = (query,callback) => {
      console.log(query);
      POI.find(query).lean().exec(callback);
    };
    const create = (param, callback) => {
      var e = new POI(param);
      e.save(callback);
    };



    return {
      // Haskell'ciye node.js yazdiran getir mutlu mu simdi :(
      readName       : str => str && str.length < name_limit ? str : null,
      readLocation    : readLocation,
      readDescription : str => str && str.length < description_limit ? str : null,
      readId          : str => str ? str : null,

      findById : findById,
      find     : find,
      create   : create

    }


}
