# CONTRIBUTING

Para rodar o código localmente, é necessário criar um arquivo ".env" na raiz do projeto.

Este arquivo contém as variáveis de ambiente do processo que serão automaticamente carregadas ao iniciar o servidor.

O arquivo deve conter a seguinte estrutura:

```txt
DB_CONNECTION_STRING=<string de conexão com o banco de dados>
JWT_SECRET=<segredo para gerar e validar o JWT>
SERVER_PORT=<porta de acesso ao servidor>
SERVER_SSL_CRT=<localização do certificado SSL (exemplo: cert.pem significa que o certificado está na raiz do projeto com o nome cert.pem)>
SERVER_SSL_KEY=<localização da chave privada SSL (exemplo: key.pem significa que o certificado está na raiz do projeto com o nome key.pem)>
```

Um arquivo SSL auto assinado pode ser gerado com o seguinte comando:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```