/**
 * A classe base para as entidades
 */
export class BaseEntity {

  /**
   * A identificação do post
   */
  id: number;

  /**
   * Diz quando foi criado essa postagem
   */
  createdAt: Date;

  /**
   * Diz quando foi atualizado essa postagem
   */
  updatedAt: Date;

  /**
   * Diz se a entidade está ativada
   */
  isActive: boolean;

}
