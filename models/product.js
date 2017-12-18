// It isn't possible to create new products and there is a few products, so database is not needed.

const products = ['Cerveja', 'Carne', 'Pão de alho', 'Refrigerente', 'Guardanapo', 'Carvão', 'Álcool', 'Churrasqueira'];

function find() {
  return [...products];
}

module.exports = {
  find,
};
