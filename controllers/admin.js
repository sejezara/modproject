
const path = require('path');
const fs = require('fs');

module.exports = function (formidable, Grupo) {
	return {
		SetRouting: function(router) {
			router.get('/dashboard', this.adminPage);

			router.post('/uploadFile', this.uploadFile);
			router.post('/dashboard', this.adminPostPage);
		},

		adminPage: function(req, res) {
			res.render('admin/dashboard');
		},

		adminPostPage: function(req, res){
			const newGroup = new Grupo();
			newGroup.name = req.body.grupo;
			newGroup.image = req.body.upload;
			newGroup.carrera = req.body.carrera;
			newGroup.save((err) => {
				res.render('admin/dashboard');
			})
		},

		uploadFile: function(req, res) {
			const form = new formidable.IncomingForm();
			form.uploadDir = path.join(__dirname, '../public/uploads');

			form.on('file', (field, file) => {
				fs.rename(file.path, path.join(form.uploadDir, file.name), (err) =>{
					if(err) throw err;
					console.log('Archivo renombrado satisfactoriamente');
				})
			});

			form.on('error', (err) => {
				console.log(err);
			});

			form.on('end', () => {
				console.log('Archivo cargado correctamente')
			});

			form.parse(req);
		}

	}
}
