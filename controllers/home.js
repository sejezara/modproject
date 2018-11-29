
module.exports = function(async, Grupo, _, Users){
  return {
    SetRouting: function(router){
      router.get('/home', this.homepage);
      router.post('/home', this.postHomePage);
      
      router.get('/logout', this.logout);
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

        function(callback){
          Users.findOne({'username': req.user.username})
          .populate('request.userId')
          .exec((err, result) => {
            callback(err, result);
          })
        }

      ], (err, results) => {
        const res1 = results[0];
        const res2 = results[1];
        const res3 = results[2];
        
        const dataChunk = [];
        const chunkSize = 3;

        for(let i = 0; i < res1.length; i += chunkSize){
          dataChunk.push(res1.slice(i, i+chunkSize));
        }


        const carreraSort = _.sortBy(res2, '_id');

        res.render('home', {title: 'C.CHAT - Home ', user:req.user, chunks: dataChunk, carrera: carreraSort, data: res3});
      })

		},

    postHomePage: function(req, res){
      async.parallel([
          function(callback){
            Grupo.update({
              '_id': req.body.id,
              'members.username': {$ne: req.user.username}
            }, {
              $push: {members: {
                  username: req.user.username,
                  email: req.user.email
              }}
            }, (err, count) => {
              callback(err, count);
            });
          }
        ], (err, results) => {
          res.redirect('/home');
        });
    },

    logout: function(req, res){
      req.logout();
      req.session.destroy((err) =>{
        res.redirect('/');
      }); 
    }



  }
}
