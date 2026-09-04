function isCyrillic(text) {
  return /[А-Яа-яЂђЈјЉљЊњЋћЏџ]/.test(String(text));
}

const latinToCyrillic = {
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', đ: 'ђ', e: 'е', ž: 'ж', z: 'з', i: 'и',
  j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', š: 'ш',
  t: 'т', u: 'у', f: 'ф', h: 'х', c: 'ц', č: 'ч', ć: 'ћ'
};

function toCyrillic(text) {
  return String(text).replace(/dž|lj|nj|Dž|Lj|Nj|DŽ|LJ|NJ|[a-zA-ZđĐžŽšŠčČćĆ]/g, match => {
    const lower = match.toLowerCase();
    const digraphs = { dž: 'џ', lj: 'љ', nj: 'њ' };
    const converted = digraphs[lower] || latinToCyrillic[lower] || match;
    if (match === match.toUpperCase()) return converted.toUpperCase();
    if (match[0] === match[0].toUpperCase()) return converted[0].toUpperCase() + converted.slice(1);
    return converted;
  });
}

function normalizeLatin(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, character => character === 'Đ' ? 'D' : 'd')
    .toLowerCase();
}

module.exports = { isCyrillic, toCyrillic, normalizeLatin };
