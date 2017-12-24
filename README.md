# churrasco-garantido-api

Esta é uma API para o sistema de pedidos de churrasco

O tutorial abaixo assume que esta API esteja rodando no endereço https://localhost:3000

## Como utilizar

### Criar uma conta

Para criar uma conta, deve-se enviar uma requisição **POST** para https://localhost:3000/account/create com o seguinte corpo:

```javascript
{
  "username": "(string) um email válido",
  "password": "(string) um password contendo pelo menos 6 caracteres e uma letra minúscula, maiúscula e um número"
}
```

Se a conta for criada com sucesso, então a resposta será um HTTP 201.

### Realizar login

Exceto pela criação de conta e pelo login, todos os endpoints requisitam um JWT no cabeçalho HTTP

Para isso, deve-se utilizar a rota https://localhost:3000/account/login com uma conta válida (ver "Criar uma conta")

O login é uma requisição **POST** contendo o seguinte corpo:

```javascript
{
  "username": "(string) um email cadastrado",
  "password": "(string) o password para a conta"
}
```

Caso o login seja válido, a resposta HTTP conterá o JWT para utilizar o sistema

### Atualizando informações da conta

Para atualizar as informações da conta, deve-se fazer uma requisição **PUT** para https://localhost:3000/account contendo o seguinte corpo:

```javascript
{
  "password": "(string) o password atual da conta",
  "updateData": {
    "username": "(string) se existir, será o novo e-mail da conta",
    "password": "(string) se existir, será o novo password da conta"
  }
}
```

As mesmas regras de criação de conta valem para a atualização.

Se a conta for atualizada com sucesso, uma resposta HTTP 204 será retornada.

### Criando uma empresa

Para criar uma empresa, deve-se fazer uma requisição **POST** para https://localhost:3000/companies contendo o seguinte corpo:

```javascript
{
  "name": "(string) o nome da empresa",
  "cnpj": "(string) o CNPJ da empresa (sem separações)"
}
```

O CNPJ deve ser um CNPJ válido não pode ser um CNPJ já cadastrado para o usuário.

Se a empresa for criada com sucesso, uma resposta HTTP 201 será retornada

### Buscando as empresas

Para buscar as empresas cadastradas para o usuário, deve-se fazer uma requisição **GET** para https://localhost:3000/companies

Havendo sucesso na requisição, será retornado HTTP 200 contendo um array com a seguinte estrutura:

```javascript
{
  "name": "(string) o nome da empresa",
  "cnpj": "(string) o CNPJ da empresa (sem separações)"
}
```

### Buscando os produtos

Para buscar os produtos existentes no sistema, deve-se fazer uma requisição **GET** para https://localhost:3000/products

Havendo sucesso na requisição, será retornado HTTP 200 contendo um array de strings.

### Criando um pedido

Para criar um pedido, deve-se fazer uma requisição **POST** para https://localhost:3000/orders contendo o seguinte corpo:

```javascript
{
  "cnpj": "(string) o CNPJ da empresa do pedido (sem separações)",
  "products": [{
    "name": "(string) o nome do produto",
    "quantity": "(number) a quantidade do produto"
  }]
}
```

Deve haver pelo menos um item no pedido.

Se o pedido for criado com sucesso, uma resposta HTTP 201 será retornada.

### Excluindo pedidos

Para excluir um pedido, deve-se fazer uma requisição **DELETE** para https://localhost:3000/orders/:code onde ":code" é o código do pedido

Havendo sucesso na requisição, será retornado HTTP 204.

### Buscando pedidos

Para buscar os pedido de uma determinada empresa, deve-se fazer uma requisição **GET** para https://localhost:3000/companies/:cnpj/orders onde ":cnpj" é o CNPJ da empresa

Havendo sucesso na requisição, será retornado HTTP 200 contendo um array com a seguinte estrutura:

```javascript
{
  "code": "(number) o código do pedido",
  "products": [{
    "name": "(string) o nome do produto",
    "quantity": "(number) a quantidade do produto"
  }]
}
```

### Obtendo um resumo das empresas e pedidos

Para buscar um resumo das empresas e seus pedidos, deve-se fazer uma requisição **GET** para https://localhost:3000/summary

Havendo sucesso na requisição, será retornado HTTP 200 contendo um array com a seguinte estrutura:

```javascript
{
  [
    "name": "(string) o nome da empresa",
    "cnpj": "(string) o CNPJ da empresa (sem separações)",
    "orders": "(number) a quantidade de pedidos desta empresa"
  ]
}
```