import { DateTime } from 'luxon';

export const dateTransformer = {
  to: value => value,
  from: value => {
    if (value === null)
      return null;

    return DateTime.fromISO(value, { setZone: true, locale: 'pt-BR' }).toJSDate();
  },
};
