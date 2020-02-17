# Se certifica se está na branch correta
git checkout master

# Busca as ultimas alteracoes
git pull

# Lança as ultimas modificações
git push

# Instala o que precisar
npm i

# Builda uma nova versao
npm run build:prod

# Se conecta com a instãncia, de forma que,
# qualquer comando a seguir será executado na instância
ssh -i ~/keys/liga-proposta.pem ubuntu@18.229.216.200 -o TCPKeepAlive="yes" -o ServerAliveInterval="60" << 'ENDSSH'
# Verifica se a pasta publica de sites esta criada, se estiver, nao faz nada
mkdir ~/sites -p
mkdir ~/sites/freela.api/dist -p
mkdir ~/sites/backups/freela.api -p

# Limpa a pasta de node_modules para não fazer backup disso
rm -r -f ~/sites/freela.api/node_modules

# Entra na pasta do laradock e pausa a api
cd ~/freela.liga-proposta/backend && docker-compose stop api

# Realiza um backup da versao antiga do site com a data de remoção
mv ~/sites/freela.api ~/sites/backups/freela.api/$(date '+%Y-%m-%d_%H:%M:%S')

mkdir ~/sites/freela.api -p
# Sinaliza o fim da execução dos scripts na instância
ENDSSH

# Compacta os arquivos para enviar para o servidor
tar --exclude='./node_modules' --exclude='./.git' --exclude='./certbot' --exclude='./nginx' --exclude='./.idea' -zcvf publish.tar.gz ./

# Envia os arquivos para a instância
scp -r -i ~/keys/liga-proposta.pem publish.tar.gz ubuntu@18.229.216.200:/home/ubuntu/sites/freela.api

# Se conecta com a instãncia, de forma que,
# qualquer comando a seguir será executado na instância
ssh -i ~/keys/liga-proposta.pem ubuntu@18.229.216.200 -o TCPKeepAlive="yes" -o ServerAliveInterval="60" << 'ENDSSH'
# Entra na pasta
cd ~/sites/freela.api

# Descompacta a pasta da api
tar -zxvf publish.tar.gz

# Remove o antigo zip
rm -r -f publish.tar.gz

# Instala as dependencias
npm install --only=prod

# Inicia a api novamente
cd ~/freela.liga-proposta/backend && docker-compose up -d api

# Sinaliza o fim da execução dos scripts na instância
ENDSSH

# Remove a antiga pasta
rm -r -f publish.tar.gz
