/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function (req, res) {

		var email = req.body.email,
			password = req.body.password;

		if (!email || !password) {
			return res
				.status(422)
				.send("Campos incompletos")
		}

		Usuario.findByEmail(email, function (err, user){
			if (err) { 
				return res
					.status(500)
					.send("Error interno al buscar el email")
			}

			if (!user) {
				return res
					.status(401)
					.send("Credenciales incorrectos")
			}

			user.comparePassword(password, function (err, isMatch){
				if (isMatch) {
					sails.log.debug("User logged", user);
					return res.json(user);
				}
				return res
					.status(401)
					.send("Credenciales incorrectos")
			});
		});

	},

	registro: function (req, res) {

		var user = new Usuario({
			nombres: req.body.nombres,
			apellidos: req.body.apellidos,
			email: req.body.email,
			password: req.body.password
		});

		user.save(function (err) {
			if (err) {
				return res
					.status(422)
					.send(err);
			}

			sails.log.debug("User registered", user);
			return res.json(user)

		})
	}
};

