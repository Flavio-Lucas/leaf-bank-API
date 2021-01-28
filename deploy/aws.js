const zip = require('./utils/zip');
const rimraf = require('rimraf');
const { execSync } = require('child_process');

const env = require('./utils/env');

if (!env.AWS_PROFILE || !env.AWS_LAMBDA_NAME)
  throw new Error('É necessário setar as variáveis de ambiente AWS_PROFILE e AWS_LAMBDA_NAME para realizar o deploy para a AWS.');

const awsProfile = env.AWS_PROFILE;
const awsLambdaName = env.AWS_LAMBDA_NAME;
const awsRegion = env.AWS_REGION;

const awsArtifacts = [
  { path: './node_modules', name: 'node_modules', type: 'directory' },
  { path: './dist', name: 'dist', type: 'directory' },
  { path: './deploy/aws/index.js', name: 'index.js', type: 'file' },
  { path: './ormconfig.js', name: 'ormconfig.js', type: 'file' },
];

async function runDeploy() {
  // Remover antigos artefatos da build
  await new Promise(resolve => rimraf('./deploy/deploy.zip', resolve));
  await new Promise(resolve => rimraf('./dist', resolve));

  console.log('Instalando dependências...');
  // Realiza o build da API
  execSync('npm ci');

  console.log('Realizando o build...');
  // Realiza o build da API
  execSync('npm run build');

  console.log('Limpando node_modules...');
  // Realiza o build da API
  execSync('npm prune --production');

  // Remove dependências e arquivos inúteis
  await new Promise(resolve => rimraf('./node_modules/**/*.d.ts', resolve));
  await new Promise(resolve => rimraf('./node_modules/**/*.js.map', resolve));
  await new Promise(resolve => rimraf('./node_modules/typeorm/browser', resolve));

  console.log('Zipando arquivos...');
  // Zip os arquivos que precisam ser enviados
  await zip(awsArtifacts, './deploy/deploy.zip');

  console.log('Enviando para a AWS...');
  // Realiza o deploy dos arquivos para a AWS
  execSync(`aws --profile ${ awsProfile } --region ${ awsRegion } lambda update-function-code --function-name ${ awsLambdaName } --zip-file fileb://deploy/deploy.zip --publish`);

  console.log('Restaurando ambiente...');
  // Instalar novamente as dependencias
  execSync('npm ci');
}

runDeploy();
