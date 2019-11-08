# Início

Repositório base para API's em NestJS

## Configurações iniciais

Execute antes de tudo o seguinte comando:
```shell
npm i typeorm nodemon -g
```

### Docker

Se não possuir o Docker e o Docker Compose instalado, instale na máquina antes para conseguir usar o banco MySQL localmente.

Após instalar, execute `docker-compose up -d` para iniciar o banco de dados.

## Migrations

De início, execute o comando `npm run migration` para executar a migração da entidade do usuário.

Após isso, crie suas entidades e execute em seguida `npm run add-migration NOME_DA_MIGRATION` para gerar as migrations, abre a pasta migrations em `src/typeorm/migrations` e verique **SEMPRE** se as modificações estão corretas.

Se estiverem corretas, basta executar então: `npm run migration` para passar as alterações para o banco de dados.

### Importante

Sempre que alterar a conexão com o banco de dados, altere também em `src/app.module.ts` e no `ormconfig.js`, sempre mantenha ambas as versões atualizadas.

Não dava para manter num arquivo apenas porque por usar TypeScript, ele dá vários problemas estranhos.

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
        - `products.services.ts`
    - `models` ( Proxys, payloads e interfaces relacionados ao produto )
        - `products-create.payload.ts`
        - `products-update.payload.ts`

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
