// importação de módulos
var conexao = require("./conexaobanco");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require('method-override');

app.use(bodyParser.json()); //pega o que foi digitado transforma os dados em html (objeto)
app.use(bodyParser.urlencoded({ extended: true })); //aprova, dá o ok
app.set("view engine", "ejs");
app.use(express.json());  // Para requisições com body JSON
app.use(express.urlencoded({ extended: true }));  // Para requisições URL-encoded
app.use(methodOverride('_method'));

// conexão com public e views
app.use(express.static("public"));
app.set('views', __dirname + '/views');

// rota index
app.get("/", function (req, res) {
  res.render('index');
});

// Rota para processar o formulário
app.post("/", (req, res) => {
  // Aqui você pode acessar os dados enviados pelo formulário
  const {
    nome,
    sobrenome,
    email,
    whatsapp,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  //prevenindo SQL injection
  var sql =
    "INSERT INTO clientes(nome, sobrenome, email, whatsapp, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

  conexao.query(sql, [nome, sobrenome, email, whatsapp, cep, logradouro, numero, complemento, bairro, cidade, estado],
    function (error, result) {
      if(error){
        console.log('Erro ao adicionar usuário', error);
        return res.status(500).json({error: 'Erro ao adicionar usuário'});
    }
      res.redirect("/listadeclientes");
    }
  );
});

//read do banco de dados
app.get('/listadeclientes', function(req, res) {
  var sql = "SELECT * FROM clientes";
  conexao.query(sql, function(error, result) {
    if (error) {
      console.log('Erro na consulta:', error);
    }
    res.render('listadeclientes', { clientes: result });
  });
});

// rotas alterar/excluir cadastro
app.get('/detalhescliente', function(req, res) {
  var sql = "SELECT * FROM clientes WHERE codcliente=?";
  var codcliente = req.query.codcliente;

  conexao.query(sql, [codcliente], function(error, result) {
    if (result && result.length > 0) {
      res.render('detalhescliente', { clientes: result[0] });
    } else {
      res.status(404).send('Cliente não encontrado');
    }
  });
});

app.put('/update-clientes/:codcliente', (req, res) => {
  console.log('Dados recebidos para atualização:', req.body);
  
  var {codcliente} = req.params;
  var { nome, sobrenome, email, whatsapp, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;

  // Verificar se o codcliente existe
  conexao.query('SELECT * FROM clientes WHERE codcliente = ?', [codcliente], function(error, results) {
    if (error) {
      console.log('Erro na consulta:', error);
      return res.status(500).send('Erro no servidor');
    }
    if (results.length === 0) {
      return res.status(404).send('Cliente não encontrado');
    }

    // Executar a atualização
    var sqlUpdate = "UPDATE clientes SET nome=?, sobrenome=?, email=?, whatsapp=?, cep=?, logradouro=?, numero=?, complemento=?, bairro=?, cidade=?, estado=? WHERE codcliente=?";
    
    conexao.query(sqlUpdate, [nome, sobrenome, email, whatsapp, cep, logradouro, numero, complemento, bairro, cidade, estado, codcliente], (error, result) => {
      if(error) {
        console.error('Erro ao atualizar usuário: ', error);
        return res.status(500).json({ error: 'Erro ao atualizar o usuário'});
    }
      if (result.affectedRows === 0) {
          return res.status(404).jason({ error: 'Usuário não encontrado'});
      }
      console.log('Atualização bem-sucedida:', result);
      res.redirect('/listadeclientes');
    });
  });
});

app.delete('/delete-clientes/:codcliente', function(req, res) {
  var sqlDelete = "DELETE FROM clientes WHERE codcliente = ?";
  var {codcliente} = req.params;

  conexao.query(sqlDelete, [codcliente], function(error, result) {
    if(error){
      console.error('Erro ao excluir usuário', error);
      return res.status(500).json({ error: 'Erro ao excluir usuário'});
    }
    if(result.affectedRows === 0){
        return res.status(404).json({ error: 'Usuário não encontrado'})
    }
    res.redirect('/listadeclientes');
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});