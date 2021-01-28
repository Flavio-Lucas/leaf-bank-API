//#region Imports

import { registerDecorator, ValidationOptions } from 'class-validator';

//#endregion

/**
 * A função que representa o decorator que valida um CPF
 *
 * @param validationsOptions As opções de validação
 */
export function IsValidCpf(validationsOptions?: ValidationOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidCpf',
      target: object.constructor,
      propertyName,
      options: validationsOptions,
      validator: {
        validate(value: any) {

          if (typeof value !== 'string')
            return false;

          value = value
            .replace('.', '')
            .replace('.', '')
            .replace('.', '')
            .replace('-', '');

          if (value.length !== 11)
            return false;

          if ((value === '00000000000') || (value === '11111111111') || (value === '22222222222') || (value === '33333333333') || (value === '44444444444') || (value === '55555555555') || (value === '66666666666') || (value === '77777777777') || (value === '88888888888') || (value === '99999999999'))
            return false;

          let numero: number = 0;
          let caracter: string = '';
          const numeros: string = '0123456789';
          let j: number = 10;
          let somatorio: number = 0;
          let resto: number = 0;
          let digito1: number = 0;
          let digito2: number = 0;
          let cpfAux: string = '';

          cpfAux = value.substring(0, 9);

          for (let i: number = 0; i < 9; i++) {
            caracter = cpfAux.charAt(i);

            if (numeros.search(caracter) === -1)
              return false;

            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
          }

          resto = somatorio % 11;
          digito1 = 11 - resto;

          if (digito1 > 9)
            digito1 = 0;

          j = 11;
          somatorio = 0;
          cpfAux = cpfAux + digito1;

          for (let i: number = 0; i < 10; i++) {
            caracter = cpfAux.charAt(i);
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
          }

          resto = somatorio % 11;
          digito2 = 11 - resto;

          if (digito2 > 9)
            digito2 = 0;

          cpfAux = cpfAux + digito2;

          return value === cpfAux;
        },
      },
    });
  };
}
