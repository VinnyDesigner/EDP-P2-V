const fs = require('fs');

let code = fs.readFileSync('public/assets/SpaceStage-D-3WnXB-.js', 'utf8');

const target = 'v.index!==i&&v.index>=0&&(i=v.index,n.current&&(n.current.textContent=String(i%l.length+1).padStart(2,`0`)),r.current&&(r.current.textContent=o[l[i%l.length]]))';

const replacement = 'v.index!==i&&v.index>=0&&(i=v.index,n.current&&(n.current.textContent=String(i%_edpCoinItems.length+1).padStart(2,`0`)),r.current&&(r.current.textContent=((typeof document<`u`&&document.documentElement.lang===`ar`)?_edpCoinItems[i%_edpCoinItems.length].ar:_edpCoinItems[i%_edpCoinItems.length].en)))';

if (!code.includes(target)) {
  throw new Error('target not found in SpaceStage-D-3WnXB-.js');
}

const edpList = 'var _edpCoinItems=[{en:`Abu Dhabi Nature`,ar:`طبيعة أبوظبي`},{en:`Air Quality Portal`,ar:`بوابة جودة الهواء`},{en:`EAD Chatbot & AI`,ar:`المستشار البيئي الذكي`},{en:`Naha Sustainability`,ar:`منصة ناهى للاستدامة`},{en:`Marine Water Quality`,ar:`جودة المياه البحرية`},{en:`Protected Areas Portal`,ar:`المحميات الطبيعية`},{en:`Dredges Detection AI`,ar:`رصد التجريف بالذكاء الاصطناعي`},{en:`Groundwater Wells`,ar:`المياه الجوفية`},{en:`Fisheries Management`,ar:`إدارة مصائد الأسماك`},{en:`Bird Tracking System`,ar:`تتبع الطيور الفضائي`},{en:`Land Subsidence AI`,ar:`نمذجة هبوط الأراضي`},{en:`Outfall Monitoring`,ar:`مراقبة مصبات المياه`}];';

code = edpList + code.replace(target, replacement);

fs.writeFileSync('public/assets/SpaceStage-D-3WnXB-.js', code);
console.log('Successfully updated SpaceStage-D-3WnXB-.js');

