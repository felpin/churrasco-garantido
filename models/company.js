const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  name: String,
  cnpj: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
});

const companyModel = mongoose.model('Company', companySchema);

module.exports = companyModel;
