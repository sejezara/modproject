
module.exports = function(async, Grupo, _){
  return {
    SetRouting: function(router){
      router.get('/home', this.homepage);
    },

    homepage: function(req, res){
      async.parallel([
        function(callback){
            Grupo.find({}, (err, result) => {
                callback(err, result);
                
            })
        },
        
        function(callback){
            Grupo.aggregate([
                { $group: { _id: "$carrera" } }
            ], (err, newResult) => {
               callback(err, newResult) ;
               
            });
        },

      ], (err, results) => {
        const res1 = results[0];
        const res2 = results[1];
        
        const dataChunk = [];
        const chunkSize = 3;

        for(let i = 0; i < res1.length; i += chunkSize){
          dataChunk.push(res1.slice(i, i+chunkSize));
        }


        const carreraSort = _.sortBy(res2, '_id');





        res.render('home', {title: 'C.E.T.R. - Home ', data: dataChunk, carrera: carreraSort});
      })

		}


  }
}
