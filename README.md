# Início

Essa é a API que fornece os dados necessários para o Frontend, escrita em TypeScript com NestJS.

## Configurações iniciais

Execute antes de tudo o seguinte comando:
```shell
npm i typeorm nodemon -g
```

### Docker

Se não possuir o Docker e o Docker Compose instalado, instale na máquina antes para conseguir usar o banco MySQL localmente.

Após instalar, execute `docker-compose up -d` para iniciar o banco de dados.

### MySQL

Use o seguinte comando para criar o arquivo de configurações a partir do exemplo:
```shell
cp .env.mysql.example .env
```

E depois, inicie o `container` que contém os serviços do MySQL usando:
```shell
docker-compose up -d mysql
```

Pronto! Agora, você pode criar uma `migration` usando `npm run add-migration v1`, e depois executa-la com `npm run migration` para iniciar o banco de dados. 

### SQLite

Se for usar SQLite em vez de MySQL, instale as dependências necessárias com:
```shell
sudo apt-get install sqlite3 libsqlite3-dev
```

E depois inicie uma banco de dados inicial com:
```shell
sqlite3 example.db "VACUUM;"
```

Por fim, crie o arquivo contendo as configurações iniciais:
```shell
cp .env.sqlite.example .env
```

Pronto! Agora, você pode criar uma `migration` usando `npm run add-migration v1`, e depois executa-la com `npm run migration` para iniciar o banco de dados. 

## Migrations

Para criar uma `migration`, use o comando:
```shell
npm run add-migration NOME_DA_MIGRATION
```

E para executar todas as suas `migrations`, use:
```shell
npm run migration
```

Caso queira realizar alguma operação mais complexa com o Typeorm, use o comando:
```shell
npm run typeorm:cli COMANDO
```

## Typeorm

Esse é o nome biblioteca que lida com o banco de dados, a estrutura desse cara é a seguinte:

- `src/typeorm/migrations`: O local onde todas as migrations ficam.
- `src/typeorm/entities`: O local onde todas as entidades criadas devem ficar, **SEMPRE** devem possuir o final terminando em `.entity.ts`.

## Estrutura

Sempre, ao criar uma nova entidade, crie uma pasta em `src` com o nome da entidade ( Ex: `src/products` ).
Dentro da pasta, deve possuir a seguinte estrutura:

- `products`
    - `products.module.ts`
    - `controllers` ( Todos os controllers relacionados ao produto )
        - `products.controller.ts`
    - `services` ( Todos os serviços relacionados ao produto )
        - `products.service.ts`
    - `models` ( Proxys, payloads e interfaces relacionados ao produto )
        - `products-create.payload.ts`
        - `products-update.payload.ts`

## Autenticação

Há quatro formas de autenticação na aplicação:
- Local
- Facebook
- Google
- Facens

Todas essas formas de autenticação vem ativas por padrão mas caso queira desativar alguma, basta ir no `app.module.ts` e remove os modulos:
- `GoogleModule` - Para remover a autenticação com o Google
- `FacebookModule` - Para remover a autenticação com o Facebook
- `FacensModule` - Para remover a autenticação com a Facens

## Testes

Todos os testes E2E, que são os mais comuns e que devem ser escritos, estão na pasta `test`.

Para testar, foi adicionado um modulo em `src/modules/test` que contém no `controller` algumas rotas padrões que você pode acabar utilizando.

### Seed

Com relação ao seed de usuários, em `src/modules/test/controllers/test.controller.ts`, ele contém um método para realizar esse seed, edite esse método ou crie outros quando precisar seedar o banco de dados.

### Utilidades

Na pasta `test/utils` eu recomendo você colocar no primeiro funções que realizem vários passos repetitivos que podem ser utilizados em mais de um arquivo. Exemplo: autenticação de cada usuário que foi adicionado por uma seed.

E na pasta `test/models`, eu recomendo você a adicionar todas as `interfaces`, `enums`, `proxies` e `payloads` criados só para os testes.

## Bugs

### helmet_1.default is not a function nestjs

Procure onde você está importando a biblioteca, troque de:

```diff
- import helmet from 'helmet'
+ import * as helmet from 'helmet'
```

### Erro 400 ao entrar na rota `localhost/api/swagger`

No meu navegador isso acontecia muito e abrir a aba anonima fazia voltar a funcionar. 
Isso ocorre também com o Ionic, Angular e outros.
