const path = require('path');

// module.exports = path.dirname(process.mainModule.filename);  OLD
module.exports = path.dirname(require.main.filename); //retorna o caminho para diretório do arquivo a ser acessado