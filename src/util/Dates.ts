import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatLocale = (date: Date, formatText: string): string =>
  format(date, formatText, {
    locale: ptBR,
  });

export function getOnlyTimeHmm(date: Date): string {
  return formatLocale(new Date(date), 'HH:mm');
}
