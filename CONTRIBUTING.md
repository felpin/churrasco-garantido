# CONTRIBUTING

Para rodar o código localmente, é necessário criar um arquivo ".env" na raiz do projeto.

Este arquivo contém as variáveis de ambiente do processo que serão automaticamente carregadas ao iniciar o servidor.

O arquivo deve conter a seguinte estrutura:

```txt
DB_CONNECTION_STRING=<string de conexão com o banco de dados>
JWT_SECRET=<segredo para gerar e validar o JWT>
```