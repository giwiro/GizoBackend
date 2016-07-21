/**
 * PictogramaController
 *
 * @description :: Server-side logic for managing Pictogramas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var multiparty = require('multiparty');
var util = require('util');
var path = require('path');
var async = require('async');

module.exports = {

	add: function (req, res) {
		var nombre = req.query.nombre;
		var idColeccion = req.query.idColeccion;

		if (!nombre || !idColeccion) {
			return res
					.status(401)
					.send("No hay nombre del pictograma o idColeccion")
		}

		Coleccion
			.findById(idColeccion)
			.exec(function (err, coleccion) {
				if (err) {
					console.log("error", err);
					return res
						.status(401)
						.send("No hay coleccion")
				}

				//console.log("found coleccion", coleccion);

				//console.log("path", path.join(sails.config.appPath, '/.tmp/uploads/' + idColeccion));
				var tasks = [];

				tasks.push(function (callback) {
					req.file('foto').upload({
						dirname: path.join(sails.config.appPath, '/.tmp/uploads/' + idColeccion),
						saveAs: function (file, cb) {
							console.log("save as ", file.filename);
							cb(null, file.filename);
						}
					}, callback);
				});

				tasks.push(function (callback) {
					req.file('audio').upload({
						dirname: path.join(sails.config.appPath, '/.tmp/uploads/' + idColeccion),
						saveAs: function (file, cb) {
							console.log("save as ", file.filename);
							cb(null, file.filename);
						}
					}, callback);
				});

				async.parallel(tasks, function (err, results) {
					console.log("err", err);
					if (err) {
						return res
								.status(500)
								.send("No se pudo subir el archivo")
					}

					var imagenFiles = results[0];
					var audioFiles = results[1];


					coleccion.pictogramas.push({
						nombre: nombre,
						fileName: imagenFiles[0].filename,
						cloudPath: idColeccion + '/' + imagenFiles[0].filename,

						soundFileName: audioFiles[0].filename,
						soundCloudPath: idColeccion + '/' + audioFiles[0].filename,
					});

					var pictograma = coleccion.pictogramas[coleccion.pictogramas.length - 1];

					coleccion.save(function (err) {
						if (err) {
							console.log("err", err);
							return res
									.status(500)
									.send("No se pudo guardar el pictograma")
						}

						return res
								.json(pictograma)
					});


					
				})


				/*req.file('foto').upload({
					dirname: path.join(sails.config.appPath, '/.tmp/uploads/' + idColeccion),
					saveAs: function (file, cb) {
						//console.log("save as ", file.filename);
						cb(null, file.filename);
					}
				}, function (err, files) {

					console.log("err", err);
					if (err && !files) {
						return res
								.status(500)
								.send("No se puso subir el archivo")
					}

					

					coleccion.pictogramas.push({
						nombre: nombre,
						fileName: files[0].filename,
						cloudPath: idColeccion + '/' + files[0].filename
					});

					var pictograma = coleccion.pictogramas[coleccion.pictogramas.length - 1];

					coleccion.save(function (err) {
						if (err) {
							console.log("err", err);
							return res
									.status(500)
									.send("No se pudo guardar el pictograma")
						}

						return res
								.json(pictograma)
					});
				})*/

			})

		

		
	}
	
};

