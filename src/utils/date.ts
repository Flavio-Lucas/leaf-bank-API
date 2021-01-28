import * as momentTimezone from 'moment-timezone';

export const FORMAT_WITH_TIMEZONE = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export function toMoment(inp?: momentTimezone.MomentInput, format?: momentTimezone.MomentFormatSpecification): momentTimezone.Moment {
  return momentTimezone(inp, format).tz('America/Sao_Paulo');
}

export const getNowString: () => string = () => toMoment().format(FORMAT_WITH_TIMEZONE);
