import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';

/**
 * Método que pausa a execução por uma certa quantidade de tempo
 *
 * @param ms A quantidade de tempo em millisegundos
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Método que retorna a largura da tela
 */
export function getScreenWidth(): number {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

/**
 * Método que retorna uma lista de erros
 *
 * @param error
 */
export function getCrudErrors({ status, error }: any): string[] {
  if (status >= 500 && status <= 599)
    return ['Ocorreu um erro interno, por favor, tente novamente.'];

  if (!Array.isArray(error.message)) {
    if (typeof error.message === 'string' && error.message.includes('Cannot'))
      return ['A rota especificada não foi encontrada, por favor, contate os administradores se o erro persistir.'];

    return [error.message || 'Ocorreu um erro inesperado, por favor, contate os administradores se o erro persistir.'];
  }

  // @ts-ignore
  return error.message.map(({ constraints }) => constraints && Object.values(constraints) || [])
    .reduce((acc, actual) => [...acc, ...actual] as string[]);
}

/**
 * Método que carrega uma imagem base64
 *
 * @param file A referencia da imagem
 * @param onLoad O callback ao carregar a imagem
 */
export function processBase64Image(file: any, onLoad: (base64: string) => void): void {
  if (!file)
    return;

  const reader = new FileReader();

  reader.onloadend = () => {
    if (typeof reader.result !== 'string')
      return;

    onLoad(reader.result);
  };

  reader.readAsDataURL(file);
}

/**
 * Método que verifica se o usuário tem permissão de administrador
 *
 * @param token As informações do token de autenticação
 */
export function isAdmin(token: string): boolean {
  const jwt = new JwtHelperService();

  if (!token || jwt.isTokenExpired(token))
    return false;

  const tokenPayload = decode(token);

  if (typeof tokenPayload.roles !== 'string')
    return false;

  return hasAdminRoles(tokenPayload.roles);
}

/**
 * Método que diz se o usuário possui permissões de administrador
 *
 * @param roles As permissões do usuário
 */
export function hasAdminRoles(roles: string): boolean {
  const rolesArray = typeof roles === 'string' && roles.split('|') || '';

  return rolesArray.includes('admin');
}
