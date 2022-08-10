export function getId(url) {
  const match = /\D+\/(\d+)-.+$/.exec(url);
  return match[1] ? parseInt(match[1], 10) : 0;
};

export function getElement(stat) {
  const regex = /(-?\d+) ((de|à|to|and|a|y)? (-?\d+))?/gi;
  return stat.replace(regex, '').trim();
};

export function getDate(date) {
  return date.split(/:(.+)/)[1].trim();
};

export function sanatizer(string) {
  return string.replace(/(\\n)|(\(|\))/g, '').replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s\s+/g, ' ').trim();
};

export function normalizeText(text) {
  return text ? text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
};
