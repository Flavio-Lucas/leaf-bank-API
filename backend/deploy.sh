#!/usr/bin/env bash
rm -r -f deploy.zip

npm run build

npm prune --production

zip -r deploy.zip dist node_modules index.js

# Manda os arquivos para a AWS
aws --profile aws_liga --region us-east-1 lambda update-function-code --function-name NOME_DA_FUNCAO_LAMBDA --zip-file fileb://deploy.zip --publish

npm i
