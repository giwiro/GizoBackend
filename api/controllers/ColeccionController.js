/**
 * ColeccionController
 *
 * @description :: Server-side logic for managing Coleccions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getAll: function (req, res) {
		var idUsuario = req.body.idUsuario;

		if (!idUsuario) {
			return res
				.status(400)
				.send("Parámetros incorrectos")
		}

		Usuario
			.findById(idUsuario)
			.exec(function (err, usuario) {
				if (err) {
					return res
						.status(401)
						.send("No autorizado")
				}

				sails.log.debug("Colecciones getAll", usuario.colecciones);
				return res
					.json(usuario.colecciones)
			})

	},
	add: function (req, res) {
		var idUsuario = req.body.idUsuario,
			texto = req.body.texto;

		if (!idUsuario || !texto) {
			return res
				.status(400)
				.send("Parámetros incorrectos")
		}

		var col = new Coleccion({
			texto: texto
		})

		Usuario
			.findById(idUsuario)
			.exec(function (err, usuario) {
				if (err) {
					return res
						.status(401)
						.send("No autorizado")
				}

				col
					.save(function (err, newColeccion) {
						if (err) {
							return res
								.status(500)
								.send("Error interno al guardar la colección")
						}

						usuario.colecciones.push(newColeccion._id);

						usuario
							.save(function (err, newUsuario) {
								if (err) {
									return res
										.status(500)
										.send("Error guardando al usuario")
								}

								sails.log.debug("Colecciones agregada", newColeccion);
								return res
									.json(newColeccion)
							})
					})


			})

		
	}
};

