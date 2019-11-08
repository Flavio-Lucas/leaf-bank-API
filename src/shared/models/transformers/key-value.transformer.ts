import { plainToClass, serialize } from 'class-transformer';
import { ValueTransformer } from 'typeorm';

import { KeyValueProxy } from '../proxys/key-value.proxy';

export const keyValueTransformer: ValueTransformer = {
  from(value: string): KeyValueProxy[] {
    const objects = JSON.parse(value) as KeyValueProxy[];

    if (!Array.isArray(objects))
      return [];

    return plainToClass(KeyValueProxy, objects);
  },
  to(value: KeyValueProxy[]): string {
    return serialize(value);
  },
};
