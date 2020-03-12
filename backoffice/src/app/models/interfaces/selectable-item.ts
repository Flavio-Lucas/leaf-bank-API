/**
 * A interface que representa um item que pode ser selecionado
 */
export interface Selectable {
  /**
   * Diz se está selecionado
   */
  isSelected: boolean;
}

/**
 * O tipo que transforma um item genérico para um que pode ser selecionado
 */
export type SelectableItem<T> = T & Selectable;
