/**
 * PictogramaController
 *
 * @description :: Server-side logic for managing Pictogramas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var multiparty = require('multiparty');
var util = require('util');
var path = require('path');

module.exports = {

	add: function (req, res) {
		sails.log.info("addPictograma");
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

				console.log("path", path.join(sails.config.appPath, '/.tmp/uploads/' + idColeccion));

				req.file('foto').upload({
					dirname: path.join(sails.config.appPath, '/.tmp/uploads/' + idColeccion),
					saveAs: function (file, cb) {
						console.log("save as ", file.filename);
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
				})

			})

		

		
	}
	
};

