/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var passwordHash = require('password-hash');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

module.exports = {

    schema: {
        nombres: {
            type: String,
            required: true
        },
        apellidos: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        colecciones: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'coleccion' 
        }]
    },



  /**
   * constructSchema()
   *
   * Note that this function must be synchronous!
   *
   * @param  {Dictionary} schemaDefinedAbove  [the raw schema defined above, or `{}` if no schema was provided]
   * @param  {SailsApp} sails                 [just in case you have globals disabled, this way you always have access to `sails`]
   * @return {MongooseSchema}
   */
    constructSchema: function (schemaDefinedAbove, sails) {
        // e.g. we might want to pass in a second argument to the schema constructor
        var newSchema = new sails.mongoose.Schema(schemaDefinedAbove, { autoIndex: false });

        newSchema.pre('save', function (next) {

            var user = this;

            // only hash the password if it has been modified (or is new)
            if (!user.isModified('password')) return next();

            var hashedPassword = passwordHash.generate(user.password);
            
            user.password = hashedPassword;
            next();
        });

        // Find by email
        newSchema.static('findByEmail', function (email, cb) {
        	return this
                .findOne({'email' : email})
                .populate('colecciones')
                .exec(cb);
        })

        newSchema.method('comparePassword', function (candidatePassword, cb) {
            cb(null, passwordHash.verify(candidatePassword, this.password));
        })

        // Regardless, you must return the instantiated Schema instance.
        return newSchema;
  }

};