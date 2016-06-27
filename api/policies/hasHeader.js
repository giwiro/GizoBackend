module.exports = function(req, res, next) {

	var header = req.headers['user-agent'];

	if (header === 'Gizo-Retrofit') {
		return next();
	}

	return res
			.status(401)
			.send("No pertenece al dominio de solicitud");
};
