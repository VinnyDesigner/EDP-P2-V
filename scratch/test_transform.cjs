// Test the transformation logic
const v = [{code: 'ar', label: 'عربي'}, {code: 'en', label: 'English'}];
const y = 'en';
const x = (e, t) => ({ar: typeof e == 'string' && !/[\uAC00-\uD7AF]/.test(e) ? e : (t || e), en: t, ko: e});
const S = e => typeof e == 'object' && !!e && ('en' in e) && ('ar' in e || 'ko' in e);
function C(e, t = y) {
  let n = e => S(e) ? (t === 'ar' ? (e.ar || e.ko || e.en) : (e.en || e.ar)) : Array.isArray(e) ? e.map(n) : typeof e == 'object' && e ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, n(t)])) : e;
  return n(e);
}

const testObj = {
  about: x('عن المنصة', 'About EDP'),
  apps: x('التطبيقات', 'Applications'),
  untranslated: x('클릭해서 문의하세요', 'Click to contact')
};

console.log('English output:', C(testObj, 'en'));
console.log('Arabic output:', C(testObj, 'ar'));

