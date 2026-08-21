'use strict';

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const STORAGE_KEY = 'sixthArchiveEscape_v1';
const MEMBER_ORDER = ['zzx','zzy','zj','zh','sxh'];

const MEMBERS = {
  zzx:{name:'朱志鑫',img:'assets/members/zzx.jpg',month:11,day:19,zodiac:'天蝎座',mbti:'INFP',ear:9,sibling:0,pet:0,game:'憋笑挑战'},
  zzy:{name:'张泽禹',img:'assets/members/zzy.jpg',month:4,day:30,zodiac:'金牛座',mbti:'ESTJ',ear:0,sibling:0,pet:3,game:'认人游戏（漫威英雄）'},
  zj:{name:'张极',img:'assets/members/zj.jpg',month:2,day:3,zodiac:'水瓶座',mbti:'INFP',ear:0,sibling:1,pet:1,game:'谁是卧底版恐怖箱'},
  zh:{name:'左航',img:'assets/members/zh.jpg',month:5,day:22,zodiac:'双子座',mbti:'INFP',ear:2,sibling:0,pet:1,game:'蒙眼踢足球'},
  sxh:{name:'苏新皓',img:'assets/members/sxh.jpg',month:1,day:12,zodiac:'摩羯座',mbti:'ENTJ',ear:0,sibling:1,pet:0,game:'不能做挑战'}
};

const QUOTES = {
  sxh:'他们生三个，感情能不好嘛',
  zh:'我只是一个摄影师，没有和过稀泥',
  zzy:'小宝甜还是青提甜～',
  zzx:'就是鸡丝凉面！没有错啊~',
  zj:'哪有持续！拿过来呀～'
};

const MOST_Q = [
  ['最想收购 sdfj 的人','zj'],
  ['最没办法的人','zzx'],
  ['耍赖最先开团的人','zzy'],
  ['最直的人','zh'],
  ['变成女生想把他们一个个亲一遍的人','sxh']
];

const SONGS = [
  'LOVE IS DANGEROUS!（危险的爱）','耶（Yeah）','我 VS JustinBieber','无所畏计划（Emergency）','For you（写给你）','痴人说梦（DayDream）','你能听到吗','命（FATE）','走在路上突然收到了快乐邀请','无所不能 TOP（CD Only）','Still Alive（背水一战）'
];

const TRIOS = {
  '573':{members:['zzy','zj','zh'],desc:'三个人都在 57 中读过中学。',weight:15},
  'OK3':{members:['zzx','zj','zh'],desc:'三个人都比过 OK 手势。',weight:3},
  'C83':{members:['zzx','zj','sxh'],desc:'三个人一起去韩国训练。',weight:11},
  '打瓦3':{members:['zzx','zzy','zh'],desc:'三个人都打瓦。',weight:3}
};

const FRAGMENTS = {
  1:'五个人的个人资料其实一直都没有出错。',
  2:'出问题的是一个从来不填写“姓名”的档案。',
  3:'有人曾经在标题旁写过一句：“别把我们背成五张百科。”',
  4:'系统第一次测试时，只允许录入“客观字段”。',
  5:'生日、宠物、家庭、习惯，看起来什么都有。',
  6:'但有人问了一句：“那我们之间的东西放哪儿？”',
  7:'最早的联合档案测试，不允许直接输入姓名。',
  8:'因为姓名只能证明“你是谁”。',
  9:'而他们想测试的是：“什么东西一出现，你就会想到这个人？”',
  10:'分房记录原本只是节目组的一张工作表。',
  11:'后来有人把它改成了关系图。',
  12:'同一个房间出现两次，在系统里就会形成更粗的一条线。',
  13:'系统开始允许“同一个人拥有很多标签”。',
  14:'体力、脑力、衣服、角色，没有任何一个标签能够单独定义一个人。',
  15:'但几个标签交叉在一起，就会出现唯一答案。',
  16:'第六份档案第一次出现了内容。',
  17:'它没有记录“成员属性”。',
  18:'它记录的是：A 和 B 之间发生过什么。',
  19:'很多题最开始都来自综艺问卷和聊天记录。',
  20:'有人觉得这些问题太怪了。',
  21:'旁边却有人写：“怪一点才记得住。”',
  22:'A 箱是旧版本档案备份。',
  23:'2026 二周年的联合授权器已经转入 B 箱。',
  24:'专辑资料不是舞台密码。它只是证明归档算法还能正确读取旧资料。',
  25:'四个三人组来自四件完全不同的事情。',
  26:'但系统只看到一个共同特点：“三个人之间确实存在一段共享经历。”',
  27:'23:10　B 箱二周年联合授权器写入完成。存放位置：镜后档案架。',
  28:'第六份档案从来没有“姓名”字段。',
  29:'它只保存成员之间的连接。',
  30:'五个人可以拥有五份档案。可“登陆少年”，只能存在于他们彼此之间。'
};

const SCENES = {
  1:{title:'《五份档案》',sub:'三人组资料室 / 回忆资料角',bg:'assets/backgrounds/bg7.jpg',difficulty:'★★☆☆☆',puzzles:['生日顺序','星座 × MBTI 档案校验','“最……”问卷','档案差值']},
  2:{title:'《9 · 2 · 0》',sub:'成员储物柜身份区',bg:'assets/backgrounds/bg3.jpg',difficulty:'★★★☆☆',puzzles:['耳洞','兄弟姐妹','现在家里的宠物','三字段身份值']},
  3:{title:'《26 键》',sub:'后台化妆间 / 输入法测试区',bg:'assets/backgrounds/bg5.jpg',difficulty:'★★★☆☆',puzzles:['这是谁说的','“润闷哈哟”全新密码','“登陆少年”的 26 键坐标','两个口令的距离']},
  4:{title:'《无所不能 TOP · 分房》',sub:'分房复盘室',bg:'assets/backgrounds/bg4.jpg',difficulty:'★★★★☆',puzzles:['还原三天房间','谁和谁真正住过一起','个人住宿统计','房间权重']},
  5:{title:'《强 · 花 · 壮 · 香 · 锤》',sub:'角色卡与分类指挥区',bg:'assets/backgrounds/bg6.jpg',difficulty:'★★★★☆',puzzles:['角色笔画','角色差值','四个集合交叉定位','两组差值叠加']},
  6:{title:'《三种关系》',sub:'舞蹈室 / 关系光谱实验区',bg:'assets/backgrounds/bg2.jpg',difficulty:'★★★★☆',puzzles:['歌曲关系归组','一个人可以出现几次','关系 × MBTI','日期尾数']},
  7:{title:'《五个黑洞》',sub:'黑洞游戏复盘练习室',bg:'assets/backgrounds/bg1.jpg',difficulty:'★★★★☆',puzzles:['黑洞游戏对应','按照名字长度排序','“最……”身份复核','跨局字段']},
  8:{title:'《无所畏惧》',sub:'专辑资料室',bg:'assets/backgrounds/bg8.jpg',difficulty:'★★★★★',puzzles:['恢复 11 首完整曲序','括号集合','“无所畏惧”不是总笔画','专辑校验串']},
  9:{title:'《四个三人组》',sub:'联合数据控制室',bg:'assets/backgrounds/bg9.jpg',difficulty:'★★★★★',puzzles:['名称来源','四集合成员出现次数','给“组”加权','成员的组权重总和']},
  10:{title:'《第六份档案》',sub:'第六档案入口 / 镜后档案架',bg:'assets/backgrounds/bg10.jpg',difficulty:'★★★★★+',puzzles:['六字段联合校验','A 还是 B','B 箱五槽密码','第六个人是谁']}
};

const HINTS = {
  '1-1':['不要比较年份，也不用比较具体日期。','先看月份。','01 → 02 → 04 → 05 → 11。'],
  '1-2':['先把每个人的星座和 MBTI 当成两个独立字段。','同一个人的两个字段必须同时正确。','朱志鑫对应天蝎座 / INFP；其余也逐一对应。'],
  '1-3':['五张采访标签的顺序本身很重要。','先给五个问题找到人，再保留原问题顺序。','第一位是张极，第二位是朱志鑫。'],
  '1-4':['不要再排人，利用上一题得到的成员顺序。','把五人的出生月份写成一排，再做相邻绝对差。','02 / 11 / 04 / 05 / 01。'],
  '2-1':['不是所有人的数字都大于零。','注意柜门记录里只有两个人有非零数据。','朱志鑫是 9，左航是 2。'],
  '2-2':['柜子里只有两张家庭提示卡。','有姐姐和有弟弟分别记为 1。','张极 1、苏新皓 1，其余为 0。'],
  '2-3':['按固定成员顺序填写。','看前台宠物资料卡，不要和兄弟姐妹混在一起。','张泽禹是 3，张极和左航各 1。'],
  '2-4':['三排数字不是三个密码。','每个人都要单独代入墙上的公式。','先算朱志鑫：9。'],
  '3-1':['每句怪话都属于不同的人。','可以先从最有辨识度的两句开始排除。','“摄影师”对应左航，“拿过来呀”对应张极。'],
  '3-2':['听语气没用，这次也不看声调。','把拼音首字母放进 26 键坐标，再按标点规则取值。','R 取列、M 取行、H 行列相加、Y 列减行。'],
  '3-3':['仍然使用上一题的 26 键坐标。','D / L / S / N 分别计算行号 + 列号。','L 的结果 11 只保留个位。'],
  '3-4':['最后一步不是加法。','比较两个四位数同一位置上的数字。','第一位是 |4-5| = 1。'],
  '4-1':['先把三天分别还原，不要急着算公式。','第一天只有一对同住，第二天和第三天各有两对。','第一天张极和张泽禹同住。'],
  '4-2':['把“同住”理解成两个人之间的一条线。','同一对连续出现两晚，权重就是 2。','张极↔张泽禹 2 晚，朱志鑫↔左航 2 晚。'],
  '4-3':['分别统计“和别人住”与“自己住”。','每个人三天总数应该能核对到 3。','张泽禹同住 3 晚、单住 0 晚。'],
  '4-4':['三天记录要先合并。','公式是（同住夜数 × 0.5 + 单住夜数）向上取整。','朱志鑫是 2×0.5+1。'],
  '5-1':['这里只按墙上给出的统一笔画口径。','五张角色牌顺序固定为强、花、壮、香、锤。','强 12、花 7、壮 6、香 9、锤 13。'],
  '5-2':['五个角色排成一队。','不看本身，看相邻之间差多少。','前两位差值分别是 5、1。'],
  '5-3':['这是集合交叉，不是单一标签判断。','每个问题都把衣着组和体/脑力组相交，再看家庭条件。','A 是张极，B 是朱志鑫。'],
  '5-4':['5134 不是最终密码。','另一组四位数来自五个人出生月份的相邻差。','先得到 9643，再和 5134 相加。'],
  '6-1':['一个人可以被拖进不止一个关系。','苏新皓会出现在两个区域。','爱情：朱志鑫/苏新皓；友情：左航/苏新皓；亲情：张极/张泽禹。'],
  '6-2':['统计每个人在三个关系里出现了几次。','只有一个人出现两次。','固定成员顺序下是 1 / 1 / 1 / 1 / 2。'],
  '6-3':['需要回看第一局 MBTI。','把关系集合与 INFP / 非 INFP 做交叉。','爱情∩INFP 是朱志鑫；爱情∩非 INFP 是苏新皓。'],
  '6-4':['顺序来自上一题。','不是月份，这次只看生日日期最后一位。','19、12、22、03、30。'],
  '7-1':['五张海报分别属于不同成员。','从“蒙眼踢足球”“恐怖箱”等关键词判断。','左航是蒙眼踢足球，张极是谁是卧底版恐怖箱。'],
  '7-2':['先按核心游戏名的汉字数量分组。','同长度时再用出生月份从早到晚排序。','4 字组先张泽禹后朱志鑫。'],
  '7-3':['这是第一局“最……”问卷的复核。','可以直接打开“回看记录”查看第一局。','保持第一局五道问题的原顺序。'],
  '7-4':['这次必须回看第二局档案。','不是第二局的加权公式，三项直接相加。','按照上一题/排序得到的成员顺序逐个计算。'],
  '8-1':['先不要算任何数字，先把曲序恢复。','注意第 10 首是 CD Only，但依然属于完整曲目。','总共 11 首，01 到 11 都要排进去。'],
  '8-2':['只看标题里有没有括号补充信息。','分别求“有括号”和“无括号”的序号和，再相减。','有括号序号和是 47，无括号序号和是 19。'],
  '8-3':['不是求总笔画。','后一个字减去前一个字。','8-4、9-8、11-9。'],
  '8-4':['10 和 11 都有用。','10 是 CD Only 的曲目编号。','三段是 412 / 18 / 11。'],
  '9-1':['名称不是人名密码。','先确认每个三人组的三名成员和名称来源。','573 是张泽禹 / 张极 / 左航。'],
  '9-2':['统计每个人出现于几个三人组。','同一个人可以在三个组里都出现。','朱志鑫 3 次，苏新皓 1 次。'],
  '9-3':['不要把 573 拆成三个人。','先给四个“组”计算数字权重。','573 的权重是 15，C83 是 11。'],
  '9-4':['先算五个人各自参与组的权重总和。','再按出生月份从早到晚重新排序，只取个位。','月份顺序是苏新皓、张极、张泽禹、左航、朱志鑫。'],
  '10-1':['这次需要大量回看前面的记录。','六个字段分别来自第二、四、六、九局。','固定成员顺序是朱志鑫、张泽禹、张极、左航、苏新皓。'],
  '10-2':['两个箱子外观不能区分。','回看第八、第九局的剧情碎片。','A 是旧版本，2026 二周年联合授权器转入 B。'],
  '10-3':['需要第九局“组权重总和”和第一局生日月份。','五个人都做：生日月份 + 组权重总和。','朱志鑫是 11 + 17。'],
  '10-4':['这不是数字题。','五个人已经各自拥有独立档案。','请填写这五个人共同的正式组合名称。']
};

const CLOCKS = {1:'22:36',2:'22:42',3:'22:49',4:'22:56',5:'23:03',6:'23:10',7:'23:18',8:'23:27',9:'23:39',10:'23:52'};

function freshState(){
  const solved={}; for(let s=1;s<=10;s++) solved[s]=[false,false,false,false];
  return {
    version:1,currentScene:1,unlockedScene:1,solved,sceneComplete:{},fragments:[],records:{},cluesSeen:{},
    mirrorOpen:false,finalBoxSelected:null,archiveKeyObtained:false,stageUnlocked:false,normalEnding:false,completeEnding:false,
    bgmOn:true,bgmVolume:.24,easter:{keyboard:0,trio:0},compatNoticeSeen:false
  };
}

let state = loadState();
let currentPuzzle = null;
let currentHintLevel = 0;
let currentSongOrder = null;

function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return freshState();
    const parsed=JSON.parse(raw), base=freshState();
    const merged={...base,...parsed};
    merged.solved={...base.solved,...(parsed.solved||{})};
    for(let s=1;s<=10;s++) merged.solved[s]=Array.isArray(merged.solved[s])?merged.solved[s].slice(0,4):[false,false,false,false];
    merged.sceneComplete={...base.sceneComplete,...(parsed.sceneComplete||{})};
    merged.records={...base.records,...(parsed.records||{})};
    merged.cluesSeen={...base.cluesSeen,...(parsed.cluesSeen||{})};
    merged.easter={...base.easter,...(parsed.easter||{})};
    return merged;
  }catch(e){ return freshState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); updateHud(); }
function hasSave(){ return !!localStorage.getItem(STORAGE_KEY); }
function resetState(){ localStorage.removeItem(STORAGE_KEY); state=freshState(); saveState(); location.reload(); }

function escapeHtml(v){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function norm(v){ return String(v??'').trim().replace(/[\s\-_/|，,。·]/g,'').toLowerCase(); }
function pad2(n){ return String(n).padStart(2,'0'); }
function sameSet(a,b){ return a.length===b.length && [...a].sort().join('|')===[...b].sort().join('|'); }
function memberName(id){ return MEMBERS[id]?.name||id; }
function memberOptions(selected=''){ return `<option value="">选择成员</option>`+MEMBER_ORDER.map(id=>`<option value="${id}" ${selected===id?'selected':''}>${MEMBERS[id].name}</option>`).join(''); }
function simpleOptions(items){ return `<option value="">请选择</option>`+items.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join(''); }
function memberGrid(ids=MEMBER_ORDER){ return `<div class="grid five">${ids.map(id=>`<button type="button" class="memberCard" data-member="${id}"><img src="${MEMBERS[id].img}" alt="${MEMBERS[id].name}"><b>${MEMBERS[id].name}</b></button>`).join('')}</div>`; }
function status(el,msg,good=false){ if(!el)return; el.textContent=msg; el.className='answerStatus '+(good?'good':'bad'); }
function toast(msg,type=''){ const t=document.createElement('div'); t.className='toast '+type; t.innerHTML=msg; $('#toastHost').appendChild(t); setTimeout(()=>t.remove(),3400); }
function recordKey(scene,p){ return `${scene}-${p}`; }
function solvedCount(){ return Object.values(state.solved).reduce((n,a)=>n+a.filter(Boolean).length,0); }
function fragmentCount(){ return state.fragments.length; }
function sceneSolved(scene){ return state.solved[scene].every(Boolean); }
function archivePercent(){ if(state.stageUnlocked)return 100; const c=Object.keys(state.sceneComplete).filter(k=>Number(k)<=9&&state.sceneComplete[k]).length; return Math.min(96,Math.round(c*96/9)); }

const sceneBg=$('#sceneBg'), hotspots=$('#hotspots'), modalOverlay=$('#modalOverlay'), modal=$('#modal'), modalBody=$('#modalBody');

function updateHud(){
  const s=state.currentScene, sc=SCENES[s];
  $('#sceneNo').textContent=`SCENE ${String(s).padStart(2,'0')}`;
  $('#sceneTitle').textContent=sc.title;
  $('#sceneSub').textContent=(s===10&&state.mirrorOpen?'镜后档案储藏区':sc.sub);
  $('#clockTime').textContent=CLOCKS[s]||'22:36';
  $('#clockDate').textContent='2026.08.28';
  $('#puzzleCount').textContent=`${solvedCount()} / 40`;
  $('#fragmentCount').textContent=`${fragmentCount()} / 30`;
  $('#archivePercent').textContent=`${archivePercent()}%`;
  $('#bgmState').textContent=state.bgmOn&&!$('#bgmAudio').paused?'播放中':'已暂停';
  $('#bgmBtn').classList.toggle('on',state.bgmOn&&!$('#bgmAudio').paused);
}

function setModal(title,desc,html,size='normal',opts={}){
  $('#modalEyebrow').textContent=opts.eyebrow||'';
  $('#modalTitle').textContent=title;
  $('#modalDesc').textContent=desc||'';
  modalBody.innerHTML=html||'';
  modal.className=size==='small'?'small':size==='wide'?'wide':size==='xwide'?'xwide':'';
  modalOverlay.classList.remove('hidden'); modalOverlay.setAttribute('aria-hidden','false');
  $('#modalHint').classList.toggle('hidden',!opts.hints);
  $('#modalReview').classList.toggle('hidden',opts.review===false);
  currentHintLevel=0;
  if(opts.hints){ currentPuzzle={scene:opts.scene,puzzle:opts.puzzle}; } else if(!opts.keepPuzzle){ currentPuzzle=null; }
}
function closeModal(){ modalOverlay.classList.add('hidden'); modalOverlay.setAttribute('aria-hidden','true'); currentPuzzle=null; }
$('#closeModal').addEventListener('click',closeModal);
modalOverlay.addEventListener('click',e=>{ if(e.target===modalOverlay) closeModal(); });
$('#modalHint').addEventListener('click',()=>{
  if(!currentPuzzle)return;
  const key=recordKey(currentPuzzle.scene,currentPuzzle.puzzle), arr=HINTS[key]||[];
  if(!arr.length)return toast('这个机关没有额外提示。','info');
  const i=Math.min(currentHintLevel,arr.length-1); currentHintLevel=Math.min(currentHintLevel+1,arr.length);
  toast(`<b>提示 ${i+1}/3</b><br>${escapeHtml(arr[i])}`,'info');
});
$('#modalReview').addEventListener('click',()=>openReview(currentPuzzle?{...currentPuzzle}:null));

function solve(scene,p,result,detail){
  state.solved[scene][p-1]=true;
  state.records[recordKey(scene,p)]={scene,p,title:SCENES[scene].puzzles[p-1],result,detail};
  if(sceneSolved(scene)){
    state.sceneComplete[scene]=true;
    if(scene<10) state.unlockedScene=Math.max(state.unlockedScene,scene+1);
    if(scene===10) state.stageUnlocked=true;
  }
  saveState();
  toast('联合校验记录已更新。','good');
}
function canOpenPuzzle(scene,p){ return p===1 || state.solved[scene][p-2]; }
function openPuzzleHub(scene=state.currentScene){
  const sc=SCENES[scene];
  const tiles=sc.puzzles.map((title,i)=>{
    const p=i+1, done=state.solved[scene][i], open=canOpenPuzzle(scene,p);
    return `<button class="puzzleTile ${done?'solved':''} ${!open?'locked':''}" data-p="${p}" ${!open?'disabled':''}>
      <span class="num">PUZZLE ${String(p).padStart(2,'0')}</span><h3>${escapeHtml(title)}</h3>
      <p>${done?'可以重新打开复盘；结果已写入回看记录。':open?'机关已解锁，点击开始。':'完成上一题后解锁。'}</p>
      <span class="statusPill ${done?'solved':''}">${done?'已解决':open?'待校验':'锁定'}</span></button>`;
  }).join('');
  const next = scene<10 && state.sceneComplete[scene] ? `<div class="divider"></div><button id="nextSceneBtn" class="primary">进入下一局</button>` : '';
  setModal(`${sc.title} · 解谜终端`,`${sc.difficulty} · 每一道已经解开的谜题都可以随时回看。`,`<div class="puzzleHub">${tiles}</div>${next}`,'wide',{review:true});
  $$('.puzzleTile',modalBody).forEach(b=>b.addEventListener('click',()=>openPuzzle(scene,Number(b.dataset.p))));
  if($('#nextSceneBtn')) $('#nextSceneBtn').onclick=()=>goScene(scene+1);
}

function openReview(returnTo=null){
  const sections=[];
  for(let s=1;s<=state.unlockedScene;s++){
    const recs=[];
    for(let p=1;p<=4;p++){
      const r=state.records[recordKey(s,p)];
      if(r) recs.push(`<div class="recordItem"><div class="recordNo">${s}.${p}</div><div><b>${escapeHtml(r.title)}</b><p>${escapeHtml(r.detail||'')}</p><p>记录结果：<span class="recordValue">${escapeHtml(r.result||'—')}</span></p></div></div>`);
      else recs.push(`<div class="recordItem"><div class="recordNo">${s}.${p}</div><div><b>${escapeHtml(SCENES[s].puzzles[p-1])}</b><p class="muted">${canOpenPuzzle(s,p)?'尚未解决。':'尚未解锁。'}</p></div></div>`);
    }
    sections.push(`<section class="recordScene"><h3>第 ${s} 局 · ${escapeHtml(SCENES[s].title)}</h3>${recs.join('')}</section>`);
  }
  const back=returnTo?`<div class="divider"></div><button id="returnPuzzle" class="primary">返回刚才的谜题</button>`:'';
  setModal('回看记录','所有已经解开的中间结果都会保存在这里。跨局题不用靠记忆硬背。',sections.join('')+back,'wide',{review:false});
  if(returnTo && $('#returnPuzzle')) $('#returnPuzzle').onclick=()=>openPuzzle(returnTo.scene,returnTo.puzzle);
}

function openArchive(){
  const sections=[];
  for(let s=1;s<=10;s++){
    if(s>state.unlockedScene && s!==10) break;
    const nums=[s*3-2,s*3-1,s*3];
    const dots=nums.map(n=>`<span class="${state.fragments.includes(n)?'got':''}">${state.fragments.includes(n)?'●':'○'}</span>`).join(' ');
    const texts=nums.map(n=>state.fragments.includes(n)?`<div class="fragmentText"><b>碎片 ${String(n).padStart(2,'0')}</b><br>${escapeHtml(FRAGMENTS[n])}</div>`:`<div class="fragmentText muted">尚未找到</div>`).join('');
    sections.push(`<section class="fragmentScene"><div class="fragmentSceneHead"><b>第 ${s} 局</b><span class="fragmentDots">${dots}</span></div>${texts}</section>`);
  }
  const footer = state.fragments.length===30 ? `<div class="puzzleIntro"><strong>30 / 30</strong>　完整二周年纪念记录已具备恢复条件。</div>` : `<div class="puzzleIntro">已找到 <strong>${state.fragments.length} / 30</strong>。未找到的碎片只显示为空位，不剧透内容。</div>`;
  setModal('联合档案','剧情碎片不影响基础通关；前九局通关后仍可返回补收集。',footer+sections.join(''),'wide',{review:true});
}

function openMap(){
  const items=[];
  for(let s=1;s<=10;s++){
    const locked=s>state.unlockedScene, current=s===state.currentScene;
    items.push(`<button class="mapScene ${locked?'locked':''} ${current?'current':''}" data-scene="${s}" ${locked?'disabled':''}><b>第 ${s} 局 · ${escapeHtml(SCENES[s].title)}</b><span>${escapeHtml(SCENES[s].sub)} · ${state.sceneComplete[s]?'已完成':'进行中'}</span></button>`);
  }
  setModal('场景地图','已解锁场景可以任意返回。回到旧场景不会清空当前进度。',`<div class="mapGrid">${items.join('')}</div>`,'wide',{review:true});
  $$('.mapScene',modalBody).forEach(b=>b.addEventListener('click',()=>goScene(Number(b.dataset.scene))));
}

function goScene(scene){
  if(scene<1||scene>state.unlockedScene)return;
  state.currentScene=scene; saveState(); closeModal(); renderScene();
}

function collectFragment(n){
  if(state.fragments.includes(n)) return toast('这里已经看过了。','info');
  state.fragments.push(n); state.fragments.sort((a,b)=>a-b); saveState();
  toast(`<b>获得剧情碎片 ${String(n).padStart(2,'0')}</b><br>${escapeHtml(FRAGMENTS[n])}`,'good');
  renderScene();
}

function addHotspot({x,y,w,h,tip,action,cls='',fragment=null,disabled=false}){
  const b=document.createElement('button'); b.type='button'; b.className=`hotspot ${cls} ${disabled?'locked':''}`; b.dataset.tip=tip||'';
  Object.assign(b.style,{left:`${x}%`,top:`${y}%`,width:`${w}%`,height:`${h}%`});
  if(fragment){ b.classList.add('fragment',state.fragments.includes(fragment)?'found':'available'); }
  if(!disabled) b.addEventListener('click',()=>{ b.classList.add('touching'); setTimeout(()=>b.classList.remove('touching'),180); if(fragment && !state.fragments.includes(fragment)) collectFragment(fragment); if(action) action(); });
  hotspots.appendChild(b);
}

const CLUE_HTML = {
  s1profiles:`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><div class="memberMini"><img src="${MEMBERS[id].img}"><b>${MEMBERS[id].name}</b></div><p>生日：${pad2(MEMBERS[id].month)} 月 ${pad2(MEMBERS[id].day)} 日</p><p>星座：${MEMBERS[id].zodiac}</p><p>MBTI：${MEMBERS[id].mbti}</p></div>`).join('')}</div>`,
  s1interview:`<div class="grid two"><div class="card"><h3>采访索引 A</h3><p>“最想收购 sdfj”——张极</p><p>“最没办法”——朱志鑫</p></div><div class="card"><h3>采访索引 B</h3><p>“耍赖最先开团”——张泽禹</p><p>“最直”——左航</p><p>“变成女生想……”——苏新皓</p></div></div>`,
  s2ears:`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><h3>${MEMBERS[id].name}</h3><p>耳洞记录：<strong class="gold">${MEMBERS[id].ear}</strong></p></div>`).join('')}</div>`,
  s2family:`<div class="grid two"><div class="card"><h3>家庭提示卡 01</h3><p>张极：一位姐姐。</p></div><div class="card"><h3>家庭提示卡 02</h3><p>苏新皓：一位弟弟。</p></div></div><p class="tiny">其余三份家庭字段为空。</p>`,
  s2pets:`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><h3>${MEMBERS[id].name}</h3><p>当前家里宠物：<strong class="gold">${MEMBERS[id].pet}</strong></p></div>`).join('')}</div>`,
  s3quotes:`<div class="grid two">${Object.entries(QUOTES).map(([id,q])=>`<div class="card"><h3>${MEMBERS[id].name}</h3><p>“${escapeHtml(q)}”</p></div>`).join('')}</div>`,
  s3keyboard:`<div class="puzzleIntro">26 键坐标图：每一行单独从左向右计列。</div>${keyboardHtml()}`,
  s3punct:`<div class="grid four"><div class="card"><h3>！</h3><p>取列</p></div><div class="card"><h3>。</h3><p>取行</p></div><div class="card"><h3>？</h3><p>行 + 列</p></div><div class="card"><h3>～</h3><p>列 - 行</p></div></div>`,
  s4day1:`<div class="card"><h3>第一天</h3><p>张极 + 张泽禹一间。朱志鑫单独。左航单独。苏新皓单独。</p></div>`,
  s4day2:`<div class="card"><h3>第二天</h3><p>朱志鑫 + 左航。张泽禹 + 张极。苏新皓单独。</p></div>`,
  s4day3:`<div class="card"><h3>第三天</h3><p>朱志鑫 + 左航。张泽禹 + 苏新皓。张极单独。</p></div>`,
  s4formula:`<div class="puzzleIntro"><strong>房间权重</strong> = （同住夜数 × 0.5 + 单住夜数）向上取整</div>`,
  s5stroke:`<div class="grid five"><div class="card"><h3>强</h3><p>12</p></div><div class="card"><h3>花</h3><p>7</p></div><div class="card"><h3>壮</h3><p>6</p></div><div class="card"><h3>香</h3><p>9</p></div><div class="card"><h3>锤</h3><p>13</p></div></div>`,
  s5groups:`<div class="grid two"><div class="card"><h3>领带 / 长裤组</h3><p>左航、张极、朱志鑫</p></div><div class="card"><h3>领结 / 短裤组</h3><p>张泽禹、苏新皓</p></div><div class="card"><h3>体力组</h3><p>朱志鑫、张极、苏新皓</p></div><div class="card"><h3>脑力组</h3><p>张泽禹、左航</p></div></div>`,
  s6relations:`<div class="grid three"><div class="card"><h3>爱情</h3><p>朱志鑫、苏新皓</p></div><div class="card"><h3>友情</h3><p>左航、苏新皓</p></div><div class="card"><h3>亲情</h3><p>张极、张泽禹</p></div></div>`,
  s7games:`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><div class="memberMini"><img src="${MEMBERS[id].img}"><b>${MEMBERS[id].name}</b></div><p>${escapeHtml(MEMBERS[id].game)}</p></div>`).join('')}</div>`,
  s8songs:`<div class="inputCol">${SONGS.map((s,i)=>`<div class="card"><b>${String(i+1).padStart(2,'0')}.</b> ${escapeHtml(s)}</div>`).join('')}</div>`,
  s8stroke:`<div class="grid four"><div class="card"><h3>无</h3><p>4</p></div><div class="card"><h3>所</h3><p>8</p></div><div class="card"><h3>畏</h3><p>9</p></div><div class="card"><h3>惧</h3><p>11</p></div></div>`,
  s9trios:`<div class="grid two">${Object.entries(TRIOS).map(([name,t])=>`<div class="card"><h3>${name}</h3><p>${t.members.map(memberName).join(' / ')}</p><p>${escapeHtml(t.desc)}</p></div>`).join('')}</div>`,
  s10device:`<div class="grid two"><div class="card"><h3>A 箱</h3><p>设备标签残缺，外观无法判断版本。</p></div><div class="card"><h3>B 箱</h3><p>设备标签残缺，外观无法判断版本。</p></div></div><p class="tiny">真正版本信息需要回看前面获得的记录与剧情碎片。</p>`
};
function keyboardHtml(){
  const rows=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']];
  return `<div class="keyboardMap">${rows.map((r,ri)=>`<div class="keyRow">${r.map((k,ci)=>`<div class="key">${k}<em>${ri+1},${ci+1}</em></div>`).join('')}</div>`).join('')}</div>`;
}
function clue(title,desc,html,key){
  state.cluesSeen[key]=true; saveState(); setModal(title,desc,html,'wide',{review:true});
}

function renderScene(){
  const s=state.currentScene; let bg=SCENES[s].bg;
  if(s===10 && state.mirrorOpen) bg='assets/backgrounds/bg11.jpg';
  sceneBg.src=bg; $('#sceneCanvas').classList.toggle('endingGlow',false); hotspots.innerHTML=''; updateHud();
  renderHotspots(s);
}

function renderHotspots(s){
  const terminal=()=>openPuzzleHub(s);
  if(s===1){
    addHotspot({x:29,y:21,w:44,h:35,tip:'中央回忆墙',action:()=>clue('中央回忆墙','五份档案的基础字段被重新整理。',CLUE_HTML.s1profiles,'s1profiles')});
    addHotspot({x:14,y:18,w:12,h:31,tip:'MEMO 板',action:()=>clue('MEMO 板','零散采访索引被钉在这里。',CLUE_HTML.s1interview,'s1interview'),fragment:1});
    addHotspot({x:30,y:58,w:43,h:18,tip:'三人组卡片',action:()=>clue('旧卡片','这些三人组会在后面再次出现。','<div class="puzzleIntro">573 / OK3 / C83。此时暂时看不出用途。</div>','s1cards')});
    addHotspot({x:12,y:66,w:61,h:28,tip:'桌面文件',action:terminal,fragment:2});
    addHotspot({x:74,y:44,w:22,h:25,tip:'成员资料卡',action:terminal,fragment:3});
  } else if(s===2){
    addHotspot({x:0,y:13,w:11,h:36,tip:'储物柜规则牌',action:()=>clue('储物柜规则','五个成员的输入顺序固定。','<div class="puzzleIntro">固定顺序：朱志鑫 → 张泽禹 → 张极 → 左航 → 苏新皓。</div>','s2order'),fragment:4});
    addHotspot({x:12,y:10,w:50,h:82,tip:'成员柜门',action:()=>clue('柜门记录','柜门内侧留下了耳洞登记数字。',CLUE_HTML.s2ears,'s2ears')});
    addHotspot({x:63,y:21,w:16,h:26,tip:'公告板',action:()=>clue('家庭提示卡','两张家庭字段被夹在公告板上。',CLUE_HTML.s2family,'s2family'),fragment:5});
    addHotspot({x:72,y:63,w:22,h:18,tip:'长椅',action:terminal});
    addHotspot({x:81,y:66,w:19,h:28,tip:'前台资料卡',action:()=>clue('宠物档案','当前家里宠物数量。',CLUE_HTML.s2pets,'s2pets'),fragment:6});
  } else if(s===3){
    addHotspot({x:0,y:12,w:28,h:63,tip:'白板',action:()=>clue('登言登语索引','五张语句卡背后留下成员名。',CLUE_HTML.s3quotes,'s3quotes'),fragment:7});
    addHotspot({x:27,y:7,w:27,h:85,tip:'零食架 / 键盘卡',action:()=>{state.easter.keyboard=(state.easter.keyboard||0)+1;saveState();if(state.easter.keyboard===5)toast('检测结果：九宫格用户数量：0。','info');else if(state.easter.keyboard>5)toast('都说了是 26 键。','info');clue('26 键坐标图','五个人全都用 26 键。',CLUE_HTML.s3keyboard,'s3keyboard');}});
    addHotspot({x:72,y:12,w:28,h:74,tip:'化妆镜',action:terminal,fragment:8});
    addHotspot({x:61,y:59,w:10,h:29,tip:'化妆推车',action:()=>clue('标点运算卡','四种标点分别改变坐标取法。',CLUE_HTML.s3punct,'s3punct')});
    addHotspot({x:54,y:0,w:18,h:99,tip:'黑色幕布',action:()=>clue('组合首字母','幕布背面只写了四个字母。','<div class="puzzleIntro mono">D / L / S / N</div>','s3initials')});
    addHotspot({x:0,y:73,w:28,h:26,tip:'桌面档案盒',action:terminal,fragment:9});
  } else if(s===4){
    addHotspot({x:0,y:10,w:20,h:66,tip:'冰箱记录',action:()=>clue('第一天分房','冰箱侧面夹着第一天安排。',CLUE_HTML.s4day1,'s4day1'),fragment:10});
    addHotspot({x:46,y:18,w:41,h:34,tip:'白色吊柜',action:()=>clue('第二天分房','吊柜门上贴着第二天安排。',CLUE_HTML.s4day2,'s4day2')});
    addHotspot({x:89,y:22,w:11,h:39,tip:'右侧海报',action:()=>clue('第三天分房','海报背后是第三天安排。',CLUE_HTML.s4day3,'s4day3'),fragment:11});
    addHotspot({x:18,y:43,w:59,h:55,tip:'中岛台',action:terminal});
    addHotspot({x:20,y:36,w:57,h:26,tip:'食品包装 / 便签',action:()=>clue('房间权重公式','便签给出最终权重算法。',CLUE_HTML.s4formula,'s4formula'),fragment:12});
  } else if(s===5){
    addHotspot({x:0,y:5,w:22,h:66,tip:'游戏说明',action:()=>clue('角色笔画口径','为了避免笔画争议，现场直接给出统一口径。',CLUE_HTML.s5stroke,'s5stroke'),fragment:13});
    addHotspot({x:24,y:31,w:43,h:31,tip:'五张角色牌',action:terminal});
    addHotspot({x:74,y:20,w:14,h:45,tip:'指挥中心分类牌',action:()=>clue('衣着分类','领带/长裤与领结/短裤分组。',CLUE_HTML.s5groups,'s5groups'),fragment:14});
    addHotspot({x:88,y:22,w:11,h:40,tip:'今日任务板',action:()=>clue('体力 / 脑力分类','另一组标签写在任务板上。',CLUE_HTML.s5groups,'s5groups2')});
    addHotspot({x:72,y:61,w:27,h:32,tip:'军绿色箱子',action:terminal,fragment:15});
  } else if(s===6){
    addHotspot({x:49,y:0,w:35,h:100,tip:'舞蹈镜',action:()=>clue('三种关系','镜面亮起三个关系区域。',CLUE_HTML.s6relations,'s6relations'),fragment:16});
    addHotspot({x:64,y:28,w:10,h:66,tip:'话筒架',action:terminal});
    addHotspot({x:72,y:0,w:18,h:40,tip:'2ND 灯牌',action:()=>clue('生日档案提示','这局最后会用到具体“日期”，不是月份。','<div class="puzzleIntro">生日资料在第一局回看记录与成员档案中。</div>','s6birthday'),fragment:17});
    addHotspot({x:75,y:32,w:12,h:34,tip:'二周年照片墙',action:()=>clue('MBTI 提示','关系集合会和第一局 MBTI 再次交叉。','<div class="puzzleIntro">INFP：朱志鑫 / 张极 / 左航。非 INFP：张泽禹 / 苏新皓。</div>','s6mbti')});
    addHotspot({x:0,y:45,w:64,h:55,tip:'地面关系光谱',action:terminal,fragment:18});
  } else if(s===7){
    addHotspot({x:26,y:16,w:39,h:33,tip:'黑板',action:()=>clue('五个黑洞','黑板旁贴着五张游戏海报归属。',CLUE_HTML.s7games,'s7games'),fragment:19});
    addHotspot({x:0,y:33,w:21,h:58,tip:'钢琴',action:()=>clue('排序规则','核心游戏名按汉字数量从短到长；同长度看出生月份。','<div class="puzzleIntro">短的在前。长度相同，出生月份早的在前。</div>','s7sort')});
    addHotspot({x:14,y:36,w:22,h:57,tip:'乐谱架',action:terminal,fragment:20});
    addHotspot({x:58,y:55,w:42,h:45,tip:'桌面 / 电脑',action:terminal,fragment:21});
  } else if(s===8){
    addHotspot({x:25,y:18,w:39,h:32,tip:'专辑黑板',action:()=>clue('《无所畏惧》笔画卡','四个字采用统一笔画口径。',CLUE_HTML.s8stroke,'s8stroke'),fragment:22});
    addHotspot({x:14,y:35,w:22,h:58,tip:'乐谱架',action:()=>clue('完整曲目表','11 张曲目卡的原始目录。',CLUE_HTML.s8songs,'s8songs')});
    addHotspot({x:57,y:55,w:43,h:45,tip:'歌曲卡 / CD',action:terminal,fragment:23});
    addHotspot({x:65,y:44,w:20,h:25,tip:'右侧文件柜',action:()=>clue('CD Only 标签','设备清单上把第 10 首单独标注为 CD Only。','<div class="puzzleIntro">第 10 首：无所不能 TOP（CD Only）。完整专辑仍然是 11 首。</div>','s8cd')});
    addHotspot({x:86,y:11,w:14,h:62,tip:'资料柜',action:terminal,fragment:24});
  } else if(s===9){
    addHotspot({x:18,y:6,w:35,h:42,tip:'TF FAMILY 资料墙',action:()=>clue('四个三人组','成员与名称来源被归档在同一面墙。',CLUE_HTML.s9trios,'s9trios'),fragment:25});
    addHotspot({x:55,y:8,w:16,h:32,tip:'九格面板',action:()=>clue('组权重规则','这次给“组”加权，而不是给人编号。','<div class="puzzleIntro">规则：只把组名中真实出现的数字相加。</div>','s9weight')});
    addHotspot({x:72,y:9,w:17,h:27,tip:'四张卡片',action:terminal,fragment:26});
    addHotspot({x:0,y:51,w:29,h:44,tip:'左侧调音设备',action:terminal});
    addHotspot({x:27,y:51,w:45,h:40,tip:'主控制台',action:terminal});
    addHotspot({x:92,y:55,w:8,h:35,tip:'录音按钮',action:()=>clue('设备写入记录','控制室保留最后一次写入信息。','<div class="puzzleIntro mono">23:10　B 箱二周年联合授权器写入完成。<br>存放位置：镜后档案架。</div>','s9write'),fragment:27});
  } else if(s===10){
    if(!state.mirrorOpen){
      addHotspot({x:55,y:4,w:31,h:83,tip:'大镜面',action:terminal});
      addHotspot({x:73,y:3,w:23,h:64,tip:'二周年回忆墙',action:()=>clue('联合校验提示','最后一次要把前面多个字段真正连起来。','<div class="puzzleIntro">建议先打开“回看记录”，整理第二、四、六、九局结果。</div>','s10review')});
      addHotspot({x:64,y:30,w:11,h:55,tip:'话筒架',action:terminal});
      addHotspot({x:82,y:49,w:18,h:45,tip:'右侧柜子',action:terminal});
    }else{
      addHotspot({x:12,y:8,w:26,h:80,tip:'移开的镜面',action:()=>clue('镜后区域','镜面已经移开，隐藏储物架完全暴露。','<div class="puzzleIntro">第二层有 A / B 两只黑色存档箱。</div>','s10mirror')});
      addHotspot({x:37,y:10,w:34,h:23,tip:'上层仪器',action:()=>clue('设备标签','箱体外观和标签都不足以直接判断。',CLUE_HTML.s10device,'s10device')});
      addHotspot({x:38,y:35,w:14,h:27,tip:'A 箱',action:()=>openPuzzle(10,2)});
      addHotspot({x:51,y:35,w:15,h:27,tip:'B 箱',action:()=>openPuzzle(10,2),fragment:state.solved[10][1]?28:null});
      addHotspot({x:40,y:61,w:28,h:26,tip:'文件 / 授权模块',action:()=>state.solved[10][2]?clue('授权模块背面','黑色授权模块背面只有一句记录。','<div class=\"puzzleIntro\">它只保存成员之间的连接。</div>','s10module'):openPuzzle(10,3),fragment:state.solved[10][2]?29:null});
      addHotspot({x:80,y:15,w:20,h:70,tip:'最终锁区 / 终端',action:()=>state.stageUnlocked?clue('终端底部','最终终端底部留下了最后一句。','<div class=\"puzzleIntro\">五个人可以拥有五份档案。可“登陆少年”，只能存在于他们彼此之间。</div>','s10terminal'):openPuzzleHub(10),fragment:state.stageUnlocked?30:null});
      if(state.stageUnlocked) addHotspot({x:78,y:78,w:21,h:20,tip:'前往二周年舞台',action:showEnding});
    }
  }
}

function showSolvedReview(scene,p){
  const r=state.records[recordKey(scene,p)];
  setModal(`${SCENES[scene].puzzles[p-1]} · 复盘`,'这道题已经完成，可以随时回看中间结果。',`<div class="puzzleIntro"><strong>记录结果</strong><br><span class="recordValue">${escapeHtml(r?.result||'已完成')}</span></div><div class="card"><h3>推导记录</h3><p>${escapeHtml(r?.detail||'结果已写入联合档案。')}</p></div><div class="divider"></div><button id="backHub" class="secondary">返回本局解谜终端</button>`,'small',{review:true});
  $('#backHub').onclick=()=>openPuzzleHub(scene);
}
function puzzleDone(scene,p,result,detail,message='机关校验通过。'){
  solve(scene,p,result,detail);
  const complete=sceneSolved(scene);
  setModal(`${SCENES[scene].puzzles[p-1]} · 通过`,message,`<div class="puzzleIntro">结果已经自动写入<strong>回看记录</strong>，后面的组合题可以直接翻查。</div><div class="inputRow"><button id="backHub" class="primary">${complete&&scene<10?'查看本局完成状态':'返回解谜终端'}</button>${complete&&scene<10?`<button id="goNext" class="secondary">进入第 ${scene+1} 局</button>`:''}</div>`,'small',{review:true});
  $('#backHub').onclick=()=>openPuzzleHub(scene);
  if($('#goNext')) $('#goNext').onclick=()=>goScene(scene+1);
}

function openPuzzle(scene,p){
  if(scene>state.unlockedScene || !canOpenPuzzle(scene,p)) return toast('上一道机关还没有解开。','bad');
  if(state.solved[scene][p-1]) return showSolvedReview(scene,p);
  currentPuzzle={scene,puzzle:p}; currentHintLevel=0;
  if(scene===1) return puzzleScene1(p);
  if(scene===2) return puzzleScene2(p);
  if(scene===3) return puzzleScene3(p);
  if(scene===4) return puzzleScene4(p);
  if(scene===5) return puzzleScene5(p);
  if(scene===6) return puzzleScene6(p);
  if(scene===7) return puzzleScene7(p);
  if(scene===8) return puzzleScene8(p);
  if(scene===9) return puzzleScene9(p);
  if(scene===10) return puzzleScene10(p);
}

function sequenceSelector(ids,needed,onCompleteText=''){ 
  return {html:`${memberGrid(ids)}<div class="divider"></div><div class="label">当前顺序</div><div id="seqBox" class="choiceRow"><span class="muted">依次点击成员</span></div><div class="inputRow" style="margin-top:10px"><button id="clearSeq" class="secondary">重选</button><button id="submit" class="primary">确认顺序</button></div><div id="st" class="answerStatus"></div>`,bind:(expected,ok)=>{
    const seq=[]; const box=$('#seqBox');
    $$('.memberCard',modalBody).forEach(c=>c.onclick=()=>{ const id=c.dataset.member; if(seq.length>=needed)return; seq.push(id); c.classList.add('selected'); box.innerHTML=seq.map(x=>`<span class="choice active">${memberName(x)}</span>`).join(''); });
    $('#clearSeq').onclick=()=>{seq.length=0;box.innerHTML='<span class="muted">依次点击成员</span>';$$('.memberCard',modalBody).forEach(c=>c.classList.remove('selected'));};
    $('#submit').onclick=()=>{ if(seq.join('|')===expected.join('|')) ok(seq); else status($('#st'),'顺序没有通过校验。再回看场景线索。'); };
  }};
}

function puzzleScene1(p){
  if(p===1){
    const ui=sequenceSelector(['sxh','zj','zzy','zh','zzx'],5);
    setModal('谜题 1 · 生日顺序','五张生日卡散落。按照出生月份从早到晚排列。',`<div class="puzzleIntro">场景里的成员档案包含生日字段。先搜索，再排列。</div>${ui.html}`,'wide',{hints:true,scene:1,puzzle:1,review:true});
    ui.bind(['sxh','zj','zzy','zh','zzx'],()=>puzzleDone(1,1,'苏新皓 → 张极 → 张泽禹 → 左航 → 朱志鑫','月份顺序：01 → 02 → 04 → 05 → 11。'));
  }else if(p===2){
    const zodiacs=['天蝎座','金牛座','水瓶座','双子座','摩羯座'], mbtis=['INFP','ESTJ','ENTJ'];
    setModal('谜题 2 · 星座 × MBTI 档案校验','给五份成员档案同时补上星座和 MBTI。',`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><div class="memberMini"><img src="${MEMBERS[id].img}"><b>${MEMBERS[id].name}</b></div><div class="label" style="margin-top:8px">星座</div><select id="z_${id}" class="selectInput">${simpleOptions(zodiacs)}</select><div class="label" style="margin-top:7px">MBTI</div><select id="m_${id}" class="selectInput">${simpleOptions(mbtis)}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">提交五份档案</button><div id="st" class="answerStatus"></div></div>`,'xwide',{hints:true,scene:1,puzzle:2,review:true});
    $('#submit').onclick=()=>{ const ok=MEMBER_ORDER.every(id=>$(`#z_${id}`).value===MEMBERS[id].zodiac&&$(`#m_${id}`).value===MEMBERS[id].mbti); if(ok)puzzleDone(1,2,'五份个人档案：确认','朱志鑫 天蝎/INFP；张泽禹 金牛/ESTJ；张极 水瓶/INFP；左航 双子/INFP；苏新皓 摩羯/ENTJ。','第六个灰色档案槽亮了一下，却仍然显示：无法生成。'); else status($('#st'),'至少有一份档案的星座或 MBTI 没有对应上。'); };
  }else if(p===3){
    setModal('谜题 3 · “最……”问卷','按照采访问题原顺序，为五个问题分别选出成员。',`<div class="inputCol">${MOST_Q.map(([q],i)=>`<div class="card"><div class="label">问题 ${i+1}</div><b>${escapeHtml(q)}</b><select id="q${i}" class="selectInput" style="margin-top:8px">${memberOptions()}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认问卷</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:1,puzzle:3,review:true});
    $('#submit').onclick=()=>{ const ok=MOST_Q.every(([,id],i)=>$(`#q${i}`).value===id); if(ok)puzzleDone(1,3,'张极 → 朱志鑫 → 张泽禹 → 左航 → 苏新皓','问卷原顺序对应成员：张极 / 朱志鑫 / 张泽禹 / 左航 / 苏新皓。'); else status($('#st'),'问卷里还有成员没有对应正确。'); };
  }else if(p===4){
    setModal('谜题 4 · 档案差值','名字不要。留下上一题五个人的出生月份，再看相邻两个人之间差了多少。',`<div class="puzzleIntro">如果忘了谜题 3 的顺序，直接点右上角<strong>回看</strong>。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="4" inputmode="numeric" placeholder="四位数"><button id="submit" class="primary">提交</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:1,puzzle:4,review:true});
    $('#submit').onclick=()=>{ if(norm($('#answer').value)==='9714') puzzleDone(1,4,'9714','02 / 11 / 04 / 05 / 01 的相邻绝对差为 9 / 7 / 1 / 4。','资料柜打开，获得联合校验记录 01。'); else status($('#st'),'机关没有反应。相邻差值还有哪里没对应上。'); };
  }
}

function fiveNumberInputs(prefix,valuesHint=''){ return `<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><h3>${MEMBERS[id].name}</h3><input id="${prefix}_${id}" class="numInput" type="number" min="0" max="20" value="0"></div>`).join('')}</div>${valuesHint}`; }
function readFive(prefix){ return MEMBER_ORDER.map(id=>Number($(`#${prefix}_${id}`).value)); }

function puzzleScene2(p){
  if(p===1){
    setModal('谜题 1 · 耳洞','五个成员，三种数字字段。先完成第一排身份校验。',`${fiveNumberInputs('ear')}<div style="margin-top:12px"><button id="submit" class="primary">确认耳洞记录</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:2,puzzle:1,review:true});
    $('#submit').onclick=()=>{ const v=readFive('ear'); if(v[0]>9) toast('档案管理员：你先冷静一下。','info'); const exp=MEMBER_ORDER.map(id=>MEMBERS[id].ear); if(v.join(',')===exp.join(',')) puzzleDone(2,1,'9 / 0 / 0 / 2 / 0','固定顺序：朱志鑫 9、张泽禹 0、张极 0、左航 2、苏新皓 0。'); else status($('#st'),'数字和柜门记录没有完全对应。'); };
  }else if(p===2){
    setModal('谜题 2 · 兄弟姐妹','第二排字段来自柜子里的两张家庭提示卡。',`${fiveNumberInputs('sib')}<div style="margin-top:12px"><button id="submit" class="primary">确认家庭字段</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:2,puzzle:2,review:true});
    $('#submit').onclick=()=>{ const exp=MEMBER_ORDER.map(id=>MEMBERS[id].sibling); if(readFive('sib').join(',')===exp.join(','))puzzleDone(2,2,'0 / 0 / 1 / 0 / 1','张极有一位姐姐，苏新皓有一位弟弟，其余为 0。');else status($('#st'),'家庭字段没有完全对应。'); };
  }else if(p===3){
    setModal('谜题 3 · 现在家里的宠物','第三排字段来自前台资料卡。',`${fiveNumberInputs('pet')}<div style="margin-top:12px"><button id="submit" class="primary">确认宠物字段</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:2,puzzle:3,review:true});
    $('#submit').onclick=()=>{ const exp=MEMBER_ORDER.map(id=>MEMBERS[id].pet); if(readFive('pet').join(',')===exp.join(','))puzzleDone(2,3,'0 / 3 / 1 / 1 / 0','固定顺序：朱志鑫 0、张泽禹 3、张极 1、左航 1、苏新皓 0。');else status($('#st'),'有宠物数量没有对上。'); };
  }else if(p===4){
    setModal('谜题 4 · 三字段身份值','控制器显示：身份值 = 耳洞 + 2 × 宠物 + 3 × 兄弟姐妹。',`<div class="puzzleIntro">三排数据都已写进<strong>回看记录</strong>。固定成员顺序不变。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric" placeholder="五位数字"><button id="submit" class="primary">计算并提交</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:2,puzzle:4,review:true});
    $('#submit').onclick=()=>{ const a=norm($('#answer').value); if(['98543','96543'].includes(a)){ const logical=a==='96543'; puzzleDone(2,4,a,logical?'按本局最新字段直接计算：9 / 6 / 5 / 4 / 3。':'按剧本终端记录值保存：9 / 8 / 5 / 4 / 3。','获得联合校验记录 02。'); } else status($('#st'),'机关没有反应。重新核对三排字段和加权公式。'); };
  }
}

function quoteOptions(){ return `<option value="">选择成员</option>`+MEMBER_ORDER.map(id=>`<option value="${id}">${MEMBERS[id].name}</option>`).join(''); }
function puzzleScene3(p){
  if(p===1){
    const quotes=Object.entries(QUOTES);
    setModal('谜题 1 · 这是谁说的','桌面散落五张“登言登语”，为每句话配人。',`<div class="inputCol">${quotes.map(([id,q],i)=>`<div class="card"><p>“${escapeHtml(q)}”</p><select id="q${i}" class="selectInput">${quoteOptions()}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认五张语音贴纸</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:3,puzzle:1,review:true});
    $('#submit').onclick=()=>{ if(quotes.every(([id],i)=>$(`#q${i}`).value===id))puzzleDone(3,1,'五句登言登语全部归档','苏新皓：他们生三个…；左航：摄影师…；张泽禹：小宝甜…；朱志鑫：鸡丝凉面…；张极：哪有持续…。','镜面亮起：润！闷。哈？哟～');else status($('#st'),'还有语句和成员没有对应上。'); };
  }else if(p===2){
    setModal('谜题 2 · “润！闷。哈？哟～”','取拼音首字母的 26 键坐标，再按标点运算。',`<div class="grid two"><div class="card">${keyboardHtml()}</div><div class="card"><h3>标点运算</h3><p>！ = 取列</p><p>。 = 取行</p><p>？ = 行 + 列</p><p>～ = 列 - 行</p></div></div><div class="inputRow" style="margin-top:12px"><input id="answer" class="textInput mono" maxlength="4" inputmode="numeric"><button id="submit" class="primary">提交四位密码</button></div><div id="st" class="answerStatus"></div>`,'wide',{hints:true,scene:3,puzzle:2,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='4385')puzzleDone(3,2,'4385','润 R→第1行第4列取列=4；闷 M→第3行取行=3；哈 H→2+6=8；哟 Y→6-1=5。');else status($('#st'),'坐标或标点运算没有完全对应。');};
  }else if(p===3){
    setModal('谜题 3 · “登陆少年”的 26 键坐标','首字母 D / L / S / N。仍然使用 26 键坐标，行号 + 列号，大于 9 只保留个位。',`<div class="puzzleIntro">如果忘记键盘行列，回看上一题，或重新点击场景里的键盘卡。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="4" inputmode="numeric"><button id="submit" class="primary">提交</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:3,puzzle:3,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='5149')puzzleDone(3,3,'5149','D=2+3=5；L=2+9=11→1；S=2+2=4；N=3+6=9。');else status($('#st'),'组合首字母的坐标还没有完全对上。');};
  }else if(p===4){
    setModal('谜题 4 · 两个口令的距离','机关问：还记得上两次的密码吗？一个来自他们说的话，一个来自他们的名字。求每一位之间的距离。',`<div class="puzzleIntro">不用硬记。右上角<strong>回看</strong>里已经保存谜题 2、3 的结果。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="4" inputmode="numeric"><button id="submit" class="primary">提交距离</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:3,puzzle:4,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='1244')puzzleDone(3,4,'1244','4385 与 5149 逐位绝对差：1 / 2 / 4 / 4。','获得联合校验记录 03。');else status($('#st'),'机关没有反应。不要把两个四位数整体相减。');};
  }
}

const PAIRS=[]; for(let i=0;i<MEMBER_ORDER.length;i++)for(let j=i+1;j<MEMBER_ORDER.length;j++)PAIRS.push([MEMBER_ORDER[i],MEMBER_ORDER[j]]);
function pairValue(a,b){ return [a,b].sort().join('+'); }
function pairOptions(){ return `<option value="">选择同住组合</option>`+PAIRS.map(([a,b])=>`<option value="${pairValue(a,b)}">${memberName(a)} + ${memberName(b)}</option>`).join(''); }
function puzzleScene4(p){
  if(p===1){
    setModal('谜题 1 · 还原三天房间','根据三天住宿安排，选出每天真正同住的组合。',`<div class="grid three"><div class="card"><h3>第一天</h3><select id="d1" class="selectInput">${pairOptions()}</select><p>其余三人单独。</p></div><div class="card"><h3>第二天</h3><select id="d2a" class="selectInput">${pairOptions()}</select><select id="d2b" class="selectInput" style="margin-top:7px">${pairOptions()}</select><p>其余一人单独。</p></div><div class="card"><h3>第三天</h3><select id="d3a" class="selectInput">${pairOptions()}</select><select id="d3b" class="selectInput" style="margin-top:7px">${pairOptions()}</select><p>其余一人单独。</p></div></div><div class="inputRow" style="margin-top:12px"><button id="allTogether" class="ghost">试试五人同住</button><button id="submit" class="primary">校验分房</button></div><div id="st" class="answerStatus"></div>`,'wide',{hints:true,scene:4,puzzle:1,review:true});
    $('#allTogether').onclick=()=>toast('这不是宿舍团建模拟器。','info');
    $('#submit').onclick=()=>{ const d1=$('#d1').value, d2=[$('#d2a').value,$('#d2b').value].sort(),d3=[$('#d3a').value,$('#d3b').value].sort(); const ok=d1===pairValue('zj','zzy')&&d2.join('|')===[pairValue('zzx','zh'),pairValue('zzy','zj')].sort().join('|')&&d3.join('|')===[pairValue('zzx','zh'),pairValue('zzy','sxh')].sort().join('|'); if(ok)puzzleDone(4,1,'433','第一天 4 间；第二天 3 间；第三天 3 间。','三天分房表恢复完成。');else status($('#st'),'至少有一天的同住组合不对。'); };
  }else if(p===2){
    setModal('谜题 2 · 谁和谁真正住过一起','把三天转换成关系边。为每一对成员填写共同住宿夜数。',`<div class="relationMatrix"><table class="relationTable"><thead><tr><th>成员关系</th><th>共同住宿夜数</th></tr></thead><tbody>${PAIRS.map(([a,b],i)=>`<tr><td>${memberName(a)} ↔ ${memberName(b)}</td><td><input id="pair${i}" class="numInput" type="number" min="0" max="3" value="0"></td></tr>`).join('')}</tbody></table></div><div style="margin-top:12px"><button id="submit" class="primary">提交关系图</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:4,puzzle:2,review:true});
    $('#submit').onclick=()=>{ const expected={ [pairValue('zj','zzy')]:2,[pairValue('zzx','zh')]:2,[pairValue('zzy','sxh')]:1 }; const ok=PAIRS.every(([a,b],i)=>Number($(`#pair${i}`).value)===(expected[pairValue(a,b)]||0)); if(ok)puzzleDone(4,2,'张极↔张泽禹 2；朱志鑫↔左航 2；张泽禹↔苏新皓 1','三天分房转成关系边，其余成员对共同住宿均为 0。');else status($('#st'),'关系边的夜数还没有完全对上。'); };
  }else if(p===3){
    const co={zzx:2,zzy:3,zj:2,zh:2,sxh:1},single={zzx:1,zzy:0,zj:1,zh:1,sxh:2};
    setModal('谜题 3 · 个人住宿统计','统计每个人三天中“与别人同住”和“单独住宿”的夜数。',`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><h3>${MEMBERS[id].name}</h3><div class="label">同住夜数</div><input id="co_${id}" class="numInput" type="number" min="0" max="3" value="0"><div class="label" style="margin-top:8px">单住夜数</div><input id="sg_${id}" class="numInput" type="number" min="0" max="3" value="0"></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">提交统计</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:4,puzzle:3,review:true});
    $('#submit').onclick=()=>{ const ok=MEMBER_ORDER.every(id=>Number($(`#co_${id}`).value)===co[id]&&Number($(`#sg_${id}`).value)===single[id]); if(ok)puzzleDone(4,3,'同住 2/3/2/2/1；单住 1/0/1/1/2','固定顺序朱志鑫、张泽禹、张极、左航、苏新皓。');else status($('#st'),'个人统计还有数字没有核对到三天。'); };
  }else if(p===4){
    setModal('谜题 4 · 房间权重','房间权重 = （同住夜数 × 0.5 + 单住夜数）向上取整。',`<div class="puzzleIntro">上一题两排统计已经写入回看记录。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric"><button id="submit" class="primary">提交五人权重</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:4,puzzle:4,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='22223')puzzleDone(4,4,'2 - 2 - 2 - 2 - 3','朱志鑫 2；张泽禹 2；张极 2；左航 2；苏新皓 3。','获得联合校验记录 04。');else status($('#st'),'权重结果没有通过。注意 1.5 和 2.5 都要向上取整。');};
  }
}

function puzzleScene5(p){
  if(p===1){
    const roles=[['强',12],['花',7],['壮',6],['香',9],['锤',13]];
    setModal('谜题 1 · 角色笔画','墙上提供统一笔画口径，为五张角色牌录入数字。',`<div class="grid five">${roles.map(([r])=>`<div class="card"><h3>${r}</h3><input id="r_${r}" class="numInput" type="number" min="0" max="30" value="0"></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认笔画</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:5,puzzle:1,review:true});
    $('#submit').onclick=()=>{ if(roles.every(([r,n])=>Number($(`#r_${r}`).value)===n))puzzleDone(5,1,'12 / 7 / 6 / 9 / 13','角色牌固定顺序：强、花、壮、香、锤。');else status($('#st'),'笔画口径没有全部对应上。'); };
  }else if(p===2){
    setModal('谜题 2 · 角色差值','五个角色排成一队。不看本身，看相邻之间差多少。',`<div class="puzzleIntro">谜题 1 的五个数字可在右上角回看。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="4" inputmode="numeric"><button id="submit" class="primary">提交四位差值</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:5,puzzle:2,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='5134')puzzleDone(5,2,'5134','|12-7|=5，|7-6|=1，|6-9|=3，|9-13|=4。');else status($('#st'),'相邻差值还没完全对应。');};
  }else if(p===3){
    const qs=[
      ['A','领带长裤 ∩ 体力组 ∩ 有兄弟姐妹','zj'],
      ['B','领带长裤 ∩ 体力组 ∩ 无兄弟姐妹','zzx'],
      ['C','领带长裤 ∩ 脑力组','zh'],
      ['D','领结短裤 ∩ 体力组','sxh'],
      ['E','领结短裤 ∩ 脑力组','zzy']
    ];
    setModal('谜题 3 · 四个集合交叉定位','每一道都让玩家选择具体成员；选错可以重新选。',`<div class="inputCol">${qs.map(([l,q],i)=>`<div class="card"><div class="label">${l}</div><b>${escapeHtml(q)}</b><select id="q${i}" class="selectInput" style="margin-top:8px">${memberOptions()}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">执行五次交叉定位</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:5,puzzle:3,review:true});
    $('#submit').onclick=()=>{ if(qs.every((x,i)=>$(`#q${i}`).value===x[2]))puzzleDone(5,3,'张极 → 朱志鑫 → 左航 → 苏新皓 → 张泽禹','A 张极；B 朱志鑫；C 左航；D 苏新皓；E 张泽禹。');else status($('#st'),'有交叉集合定位错了，重新选择即可。'); };
  }else if(p===4){
    setModal('谜题 4 · 两组差值叠加','取谜题 3 五人的出生月份做相邻差，再与角色牌差值逐位相加，只保留个位。',`<div class="puzzleIntro">这题同时依赖谜题 2 和谜题 3。忘记任何一组结果都可以打开<strong>回看</strong>。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="4" inputmode="numeric"><button id="submit" class="primary">提交叠加结果</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:5,puzzle:4,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='4777')puzzleDone(5,4,'4777','成员月份 02/11/05/01/04 → 相邻差 9643；与 5134 逐位相加取个位 → 4777。','获得联合校验记录 05。');else status($('#st'),'两组四位差值叠加后没有通过。');};
  }
}

function relationChecks(group,idPrefix){
  return `<div class="card"><h3>${group}</h3><div class="checkGrid">${MEMBER_ORDER.map(id=>`<label class="checkCard"><input type="checkbox" id="${idPrefix}_${id}">${MEMBERS[id].name}</label>`).join('')}</div></div>`;
}
function checkedMembers(prefix){ return MEMBER_ORDER.filter(id=>$(`#${prefix}_${id}`)?.checked); }
function puzzleScene6(p){
  if(p===1){
    setModal('谜题 1 · 歌曲关系归组','爱情、友情、亲情三个关系区域可以重复出现同一个人。',`<div class="inputCol">${relationChecks('爱情','love')}${relationChecks('友情','friend')}${relationChecks('亲情','family')}</div><div style="margin-top:12px"><button id="submit" class="primary">点亮三种关系</button><div id="st" class="answerStatus"></div></div>`,'xwide',{hints:true,scene:6,puzzle:1,review:true});
    $('#submit').onclick=()=>{ const ok=sameSet(checkedMembers('love'),['zzx','sxh'])&&sameSet(checkedMembers('friend'),['zh','sxh'])&&sameSet(checkedMembers('family'),['zj','zzy']); if(ok)puzzleDone(6,1,'爱情：朱志鑫/苏新皓；友情：左航/苏新皓；亲情：张极/张泽禹','三个关系集合归组完成，苏新皓在两个关系中重复出现。'); else status($('#st'),'至少有一个关系区域没有归组正确。'); };
  }else if(p===2){
    setModal('谜题 2 · 一个人可以出现几次','统计每个人在三个关系中出现的次数，并指出唯一出现两次的人。',`<div class="grid two"><div class="card"><div class="label">唯一出现两次的人</div><select id="who" class="selectInput">${memberOptions()}</select></div><div class="card"><div class="label">固定顺序的五位次数</div><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric"></div></div><div style="margin-top:12px"><button id="submit" class="primary">写入关系次数</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:6,puzzle:2,review:true});
    $('#submit').onclick=()=>{if($('#who').value==='sxh'&&norm($('#answer').value)==='11112')puzzleDone(6,2,'11112','朱志鑫 1、张泽禹 1、张极 1、左航 1、苏新皓 2。');else status($('#st'),'重复出现的人或五位次数不对。');};
  }else if(p===3){
    const qs=[['爱情 ∩ INFP','zzx'],['爱情 ∩ 非 INFP','sxh'],['友情 ∩ INFP','zh'],['亲情 ∩ INFP','zj'],['亲情 ∩ 非 INFP','zzy']];
    setModal('谜题 3 · 关系 × MBTI','把谜题 1 的关系集合与第一局 MBTI 再做一次交叉。',`<div class="puzzleIntro">忘了第一局 MBTI？右上角回看可以直接查。</div><div class="inputCol">${qs.map(([q],i)=>`<div class="card"><b>${q}</b><select id="q${i}" class="selectInput" style="margin-top:7px">${memberOptions()}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认交叉顺序</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:6,puzzle:3,review:true});
    $('#submit').onclick=()=>{if(qs.every((x,i)=>$(`#q${i}`).value===x[1]))puzzleDone(6,3,'朱志鑫 → 苏新皓 → 左航 → 张极 → 张泽禹','按五个交叉条件得到唯一成员顺序。');else status($('#st'),'关系集合和 MBTI 交叉后还有成员不对。');};
  }else if(p===4){
    setModal('谜题 4 · 日期尾数','不要月份。这次只看上一题五个人生日“日期”的最后一位。',`<div class="puzzleIntro">顺序来自谜题 3；生日资料来自第一局。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric"><button id="submit" class="primary">提交日期尾数</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:6,puzzle:4,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='92230')puzzleDone(6,4,'92230','朱志鑫 19→9；苏新皓 12→2；左航 22→2；张极 03→3；张泽禹 30→0。','获得联合校验记录 06。');else status($('#st'),'日期尾数没有通过。注意不是月份。');};
  }
}

function puzzleScene7(p){
  const games=MEMBER_ORDER.map(id=>MEMBERS[id].game);
  if(p===1){
    setModal('谜题 1 · 黑洞游戏对应','五张游戏海报分别属于五个人。',`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><div class="memberMini"><img src="${MEMBERS[id].img}"><b>${MEMBERS[id].name}</b></div><select id="g_${id}" class="selectInput" style="margin-top:8px">${simpleOptions(games)}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认五个黑洞</button><div id="st" class="answerStatus"></div></div>`,'xwide',{hints:true,scene:7,puzzle:1,review:true});
    $('#submit').onclick=()=>{if(MEMBER_ORDER.every(id=>$(`#g_${id}`).value===MEMBERS[id].game))puzzleDone(7,1,'五个黑洞游戏全部对应','朱志鑫憋笑；张泽禹认人；张极恐怖箱；左航蒙眼踢足球；苏新皓不能做挑战。');else status($('#st'),'还有游戏海报没有对应到正确成员。');};
  }else if(p===2){
    const ui=sequenceSelector(['zzy','zzx','sxh','zh','zj'],5);
    setModal('谜题 2 · 按照名字长度排序','只计算核心游戏名汉字数量。短的在前；长度相同，出生月份早的在前。',`<div class="puzzleIntro">4 字、5 字、8 字。先分长度，再处理同长度。</div>${ui.html}`,'wide',{hints:true,scene:7,puzzle:2,review:true});
    ui.bind(['zzy','zzx','sxh','zh','zj'],()=>puzzleDone(7,2,'张泽禹 → 朱志鑫 → 苏新皓 → 左航 → 张极','4字组：张泽禹(04)→朱志鑫(11)；5字组：苏新皓(01)→左航(05)；8字：张极。'));
  }else if(p===3){
    setModal('谜题 3 · “最……”身份复核','电脑重新弹出第一局五个“最”问题。',`<div class="puzzleIntro">这一次允许你直接使用<strong>回看记录</strong>，目的是确认排序结果是一串可复用成员顺序。</div><div class="inputCol">${MOST_Q.map(([q],i)=>`<div class="card"><b>${escapeHtml(q)}</b><select id="q${i}" class="selectInput" style="margin-top:7px">${memberOptions()}</select></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">复核问卷</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:7,puzzle:3,review:true});
    $('#submit').onclick=()=>{if(MOST_Q.every(([,id],i)=>$(`#q${i}`).value===id))puzzleDone(7,3,'第一局问卷复核通过','五个“最”与第一局完全一致；当前需要保留谜题 2 的成员排序。');else status($('#st'),'复核结果和第一局记录不一致。');};
  }else if(p===4){
    setModal('谜题 4 · 跨局字段','按照谜题 2 顺序，对五个人依次计算：耳洞 + 宠物 + 兄弟姐妹。',`<div class="puzzleIntro">这是明确的跨局题。第二局三个字段和第七局排序都可以从<strong>回看记录</strong>翻出。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric"><button id="submit" class="primary">提交五位结果</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:7,puzzle:4,review:true});
    $('#submit').onclick=()=>{const a=norm($('#answer').value);if(['59112','39132'].includes(a)){puzzleDone(7,4,a,a==='39132'?'按第二局最新耳洞字段直接计算：张泽禹3、朱志鑫9、苏新皓1、左航3、张极2。':'按剧本终端保留校验串：5 / 9 / 1 / 1 / 2。','获得联合校验记录 07。');}else status($('#st'),'跨局字段没有通过。先回看第二局的三排数据。');};
  }
}

function renderSortList(order){
  return `<div class="sortList">${order.map((idx,pos)=>`<div class="sortItem" data-pos="${pos}"><div class="sortIndex">${String(pos+1).padStart(2,'0')}</div><div>${escapeHtml(SONGS[idx])}</div><div class="sortButtons"><button type="button" data-move="up">↑</button><button type="button" data-move="down">↓</button></div></div>`).join('')}</div>`;
}
function bindSongSort(){
  $$('.sortButtons button',modalBody).forEach(b=>b.onclick=()=>{const item=b.closest('.sortItem'),pos=Number(item.dataset.pos),dir=b.dataset.move;if(dir==='up'&&pos>0)[currentSongOrder[pos-1],currentSongOrder[pos]]=[currentSongOrder[pos],currentSongOrder[pos-1]];if(dir==='down'&&pos<currentSongOrder.length-1)[currentSongOrder[pos+1],currentSongOrder[pos]]=[currentSongOrder[pos],currentSongOrder[pos+1]];$('#songSortWrap').innerHTML=renderSortList(currentSongOrder);bindSongSort();});
}
function puzzleScene8(p){
  if(p===1){
    currentSongOrder=[5,0,9,2,10,3,7,1,8,4,6];
    setModal('谜题 1 · 恢复 11 首完整曲序','11 张歌曲卡被打乱。用上下箭头恢复完整曲序。',`<div id="songSortWrap">${renderSortList(currentSongOrder)}</div><div style="margin-top:12px"><button id="submit" class="primary">确认曲序</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:8,puzzle:1,review:true});bindSongSort();
    $('#submit').onclick=()=>{if(currentSongOrder.every((v,i)=>v===i))puzzleDone(8,1,'01 → 11 完整曲序恢复','《无所畏惧》共 11 首；第 10 首虽为 CD Only 仍属于完整曲序。');else status($('#st'),'曲序仍有卡片不在正确位置。');};
  }else if(p===2){
    const withParen=[1,2,4,5,6,8,10,11];
    setModal('谜题 2 · 括号集合','不看歌名内容，只判断标题里有没有括号补充信息；分别加和求差。',`<div class="checkGrid">${SONGS.map((s,i)=>`<label class="checkCard"><input type="checkbox" id="song_${i+1}"><b>${String(i+1).padStart(2,'0')}</b><br>${escapeHtml(s)}</label>`).join('')}</div><div class="divider"></div><div class="inputRow"><label class="label">两组序号和的差：</label><input id="answer" class="textInput mono" maxlength="2" inputmode="numeric"><button id="submit" class="primary">提交集合运算</button></div><div id="st" class="answerStatus"></div>`,'xwide',{hints:true,scene:8,puzzle:2,review:true});
    $('#submit').onclick=()=>{const selected=SONGS.map((_,i)=>i+1).filter(n=>$(`#song_${n}`).checked);if(sameSet(selected,withParen)&&norm($('#answer').value)==='28')puzzleDone(8,2,'28','有括号序号和 47；无括号序号和 19；47 - 19 = 28。');else status($('#st'),'括号集合或两组求差没有通过。');};
  }else if(p===3){
    setModal('谜题 3 · “无所畏惧”不是总笔画','机关提供统一笔画卡。填写四个字的笔画，再做“后一个字减前一个字”。',`<div class="grid four">${['无','所','畏','惧'].map(ch=>`<div class="card"><h3>${ch}</h3><input id="st_${ch}" class="numInput" type="number" min="0" max="30" value="0"></div>`).join('')}</div><div class="inputRow" style="margin-top:12px"><label class="label">三位差值：</label><input id="answer" class="textInput mono" maxlength="3" inputmode="numeric"><button id="submit" class="primary">确认</button></div><div id="st" class="answerStatus"></div>`,'wide',{hints:true,scene:8,puzzle:3,review:true});
    $('#submit').onclick=()=>{const ok=Number($('#st_无').value)===4&&Number($('#st_所').value)===8&&Number($('#st_畏').value)===9&&Number($('#st_惧').value)===11&&norm($('#answer').value)==='412';if(ok)puzzleDone(8,3,'412','无4、所8、畏9、惧11；8-4=4，9-8=1，11-9=2。');else status($('#st'),'笔画口径或三段差值没有通过。');};
  }else if(p===4){
    setModal('谜题 4 · 专辑校验串','控制器要求三段：标题笔画差；括号集合差 - CD Only 曲目序号；完整曲目数量。',`<div class="puzzleIntro">前 3 题的中间结果全部可以回看。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="7" inputmode="numeric"><button id="submit" class="primary">提交七位校验串</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:8,puzzle:4,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='4121811')puzzleDone(8,4,'4121811','412 | (28-10=18) | 11 → 4121811。','获得联合校验记录 08。');else status($('#st'),'三段校验串没有通过。');};
  }
}

function trioMembershipCard(name){return `<div class="card"><h3>${name}</h3><div class="checkGrid">${MEMBER_ORDER.map(id=>`<label class="checkCard"><input type="checkbox" id="tr_${name}_${id}">${MEMBERS[id].name}</label>`).join('')}</div><div class="label" style="margin-top:8px">名称来源</div><select id="desc_${name}" class="selectInput">${simpleOptions([...Object.values(TRIOS).map(t=>t.desc),'5号 / 7号 / 3号'])}</select></div>`;}
function puzzleScene9(p){
  if(p===1){
    setModal('谜题 1 · 名称来源','四个三人组的名称不是“一个字符代表一个人”。还原成员与名称来源。',`<div class="grid two">${Object.keys(TRIOS).map(trioMembershipCard).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认四个三人组</button><div id="st" class="answerStatus"></div></div>`,'xwide',{hints:true,scene:9,puzzle:1,review:true});
    $('#submit').onclick=()=>{ if($('#desc_573').value==='5号 / 7号 / 3号'){state.easter.trio=(state.easter.trio||0)+1;saveState();toast(state.easter.trio>1?'573 是三个人都在 57 中读过中学。':'请停止把组合名字拆成人。','info');return;} const ok=Object.entries(TRIOS).every(([name,t])=>sameSet(MEMBER_ORDER.filter(id=>$(`#tr_${name}_${id}`).checked),t.members)&&$(`#desc_${name}`).value===t.desc); if(ok)puzzleDone(9,1,'四个三人组全部归档','573：张泽禹/张极/左航；OK3：朱志鑫/张极/左航；C83：朱志鑫/张极/苏新皓；打瓦3：朱志鑫/张泽禹/左航。');else status($('#st'),'成员集合或名称来源还有错误。'); };
  }else if(p===2){
    const exp={zzx:3,zzy:2,zj:3,zh:3,sxh:1};
    setModal('谜题 2 · 四集合成员出现次数','统计每个人出现在几个三人组。',`${fiveNumberInputs('cnt')}<div style="margin-top:12px"><button id="submit" class="primary">提交五位次数</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:9,puzzle:2,review:true});
    $('#submit').onclick=()=>{if(MEMBER_ORDER.every(id=>Number($(`#cnt_${id}`).value)===exp[id]))puzzleDone(9,2,'32331','朱志鑫3、张泽禹2、张极3、左航3、苏新皓1；这组数据会在最终局再次使用。');else status($('#st'),'成员出现次数没有完全对上四个集合。');};
  }else if(p===3){
    setModal('谜题 3 · 给“组”加权','只把组名中真实出现的数字相加。',`<div class="grid four">${Object.entries(TRIOS).map(([name])=>`<div class="card"><h3>${name}</h3><input id="w_${name}" class="numInput" type="number" min="0" max="30" value="0"></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">确认四组权重</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:9,puzzle:3,review:true});
    $('#submit').onclick=()=>{if(Object.entries(TRIOS).every(([name,t])=>Number($(`#w_${name}`).value)===t.weight))puzzleDone(9,3,'15 / 3 / 11 / 3','573=5+7+3=15；OK3=3；C83=8+3=11；打瓦3=3。');else status($('#st'),'至少有一个“组”权重不对。');};
  }else if(p===4){
    setModal('谜题 4 · 成员的组权重总和','先计算每个人参与的所有组权重总和；再按出生月份从早到晚排序，只取个位。',`<div class="puzzleIntro">谜题 1 和谜题 3 都要回看。第一局生日月份也会用到。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric"><button id="submit" class="primary">提交最终五位密码</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:9,puzzle:4,review:true});
    $('#submit').onclick=()=>{if(norm($('#answer').value)==='19817')puzzleDone(9,4,'19817','组权重总和：朱17、禹18、极29、航21、苏11；按月份苏/极/禹/航/朱排序取个位 → 1/9/8/1/7。','ARCHIVE 06 · DATA COMPLETENESS：96%。获得联合校验记录 09。');else status($('#st'),'最终五位密码没有通过。');};
  }
}

function puzzleScene10(p){
  if(p===1){
    setModal('谜题 1 · 六字段联合校验','前九次只是确认资料。最后一次，请证明这些资料能够连接起来。',`<div class="puzzleIntro">固定成员顺序：朱志鑫 → 张泽禹 → 张极 → 左航 → 苏新皓。<br>每个人计算：耳洞 + 宠物 + 兄弟姐妹 + 与别人同住夜数 + 三人组出现次数 + 歌曲关系参与次数，最后只保留个位。</div><div class="inputRow"><input id="answer" class="textInput mono" maxlength="5" inputmode="numeric"><button id="submit" class="primary">执行联合校验</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:10,puzzle:1,review:true});
    $('#submit').onclick=()=>{const a=norm($('#answer').value);if(['51875','59895'].includes(a)){solve(10,1,a,a==='59895'?'按第二局最新耳洞字段与后续记录直接合并得到 5/9/8/9/5。':'按剧本终端保留联合校验串得到 5/1/8/7/5。');state.mirrorOpen=true;saveState();closeModal();$('#sceneCanvas').classList.add('transitioning');setTimeout(()=>{$('#sceneCanvas').classList.remove('transitioning');renderScene();toast('镜面发出机械声，缓慢向一侧移动。','good');setTimeout(()=>openPuzzleHub(10),500);},650);}else status($('#st'),'联合校验没有通过。建议先打开回看记录整理六个字段。');};
  }else if(p===2){
    if(!state.mirrorOpen)return toast('镜面还没有移开。','bad');
    setModal('谜题 2 · A 还是 B','镜后第二层有两个黑色存档箱，外观和残缺标签都不足以判断。',`<div class="grid two"><button id="boxA" class="card" style="cursor:pointer"><h3>A 箱</h3><p>点击检查。</p></button><button id="boxB" class="card" style="cursor:pointer"><h3>B 箱</h3><p>点击检查。</p></button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:10,puzzle:2,review:true});
    $('#boxA').onclick=()=>{state.finalBoxSelected='A';saveState();status($('#st'),'2025 ARCHIVE BACKUP。文件版本过旧。不会失败，旁边还有另一只箱子。');};
    $('#boxB').onclick=()=>{state.finalBoxSelected='B';solve(10,2,'B 箱','第八局碎片提示 A 为旧版本、二周年联合授权器转入 B；第九局写入记录也指向 B 箱。');saveState();puzzleDoneMessageAfterExistingSolve(10,2,'B 箱确认：二周年联合授权器所在箱。');renderScene();};
  }else if(p===3){
    if(!state.solved[10][1])return toast('先确认正确的存档箱。','bad');
    setModal('谜题 3 · B 箱五槽密码','五个两位数字轮。每个人都做：生日月份 + 第九局组权重总和。',`<div class="grid five">${MEMBER_ORDER.map(id=>`<div class="card"><h3>${MEMBERS[id].name}</h3><input id="v_${id}" class="numInput" type="number" min="0" max="99" value="0"></div>`).join('')}</div><div style="margin-top:12px"><button id="submit" class="primary">打开 B 箱</button><div id="st" class="answerStatus"></div></div>`,'wide',{hints:true,scene:10,puzzle:3,review:true});
    const exp=[28,22,31,26,12]; $('#submit').onclick=()=>{const vals=MEMBER_ORDER.map(id=>Number($(`#v_${id}`).value));if(vals.join(',')===exp.join(',')){solve(10,3,'28 - 22 - 31 - 26 - 12','生日月份 11/04/02/05/01 + 第九局权重 17/18/29/21/11。');state.archiveKeyObtained=true;saveState();renderScene();puzzleDoneMessageAfterExistingSolve(10,3,'B 箱打开。获得【联合档案授权器】。');}else status($('#st'),'五个两位数字轮没有全部对应。');};
  }else if(p===4){
    if(!state.archiveKeyObtained)return toast('先打开 B 箱取得联合档案授权器。','bad');
    setModal('谜题 4 · 第六个人是谁','授权器插入终端。请为 ARCHIVE 06 输入名称。',`<div class="puzzleIntro">这不是数字题。五个人都已经有自己的独立档案。</div><div class="inputRow"><input id="answer" class="textInput" maxlength="12" placeholder="输入正式档案名称"><button id="submit" class="primary">IDENTIFY</button></div><div id="st" class="answerStatus"></div>`,'small',{hints:true,scene:10,puzzle:4,review:true});
    $('#submit').onclick=()=>{const a=$('#answer').value.trim();if(['朱志鑫','张泽禹','张极','左航','苏新皓'].includes(a)){status($('#st'),'该成员已经拥有独立档案。');return;}if(a==='我们'){status($('#st'),'方向正确。请填写正式档案名称。');return;}if(a==='第六个人'){status($('#st'),'不存在第六个人。');return;}if(a==='工作人员'){status($('#st'),'也不是。');return;}if(a==='粉丝'){status($('#st'),'……这份档案里确实有你们留下的内容。但这里要填的是正式名称。');return;}if(a==='登陆少年'){solve(10,4,'登陆少年','ARCHIVE 06 IDENTIFIED · JOINT PROFILE RESTORED · STAGE AUTHORIZATION：UNLOCKED。');state.stageUnlocked=true;state.sceneComplete[10]=true;saveState();renderScene();setModal('ARCHIVE 06 IDENTIFIED','JOINT PROFILE RESTORED · STAGE AUTHORIZATION：UNLOCKED',`<div class="puzzleIntro">舞台门已经打开。你可以先继续搜索镜后区域，收集最后的剧情碎片，再前往舞台。</div><div class="inputRow"><button id="stay" class="secondary">继续搜索</button><button id="stage" class="primary">前往舞台</button></div>`,'small',{review:true});$('#stay').onclick=closeModal;$('#stage').onclick=showEnding;}else status($('#st'),'终端没有识别这个正式档案名称。');};
  }
}
function puzzleDoneMessageAfterExistingSolve(scene,p,msg){
  setModal(`${SCENES[scene].puzzles[p-1]} · 通过`,msg,`<div class="puzzleIntro">结果已写入回看记录。继续处理镜后档案架。</div><button id="hub" class="primary">返回解谜终端</button>`,'small',{review:true});
  $('#hub').onclick=()=>openPuzzleHub(scene);
}

const FULL_STORY = `二周年筹备开始以后，工作人员原本只想重新整理五个人的成员档案。

姓名。生日。星座。MBTI。出生地。爱好。

这些东西很快就整理完了。五个人每个人都有一份非常完整的档案。

但整理过程中，有人突然发现一个问题。

这些资料可以非常准确地介绍：朱志鑫是谁，张泽禹是谁，张极是谁，左航是谁，苏新皓是谁。

可是把五份资料放在一起以后，却依然很难回答一个问题：登陆少年是什么？

因为“组合”并不是五张个人简历拼在一起。

于是二周年资料组又增加了一份特殊档案。不记录个人属性，只记录他们之间发生过什么。

有人和谁住过一间房。有人和谁属于同一个三人组。有人说过什么只有熟悉的人才知道是谁说的怪话。有人玩过什么奇怪的黑洞游戏。有人在爱情主题里出现。有人在友情主题里出现。有人在亲情主题里出现。

有人的宠物是三个。有人有九个耳洞。有人有姐姐。有人有弟弟。有人属于体力组。有人属于脑力组。有人穿领带和长裤。有人穿领结和短裤。

单独看这些信息，全都很零散，甚至有一点莫名其妙。

但只要开始交叉：一个人会逐渐变得唯一。两个人之间会出现一条线。三个人会组成一段共同经历。五个人的线最后会连接成一张完整的图。

这就是：第六份档案。

原本，这份档案只是二周年后台物料的一部分。工作人员打算把它做成一个轻量互动小游戏。

可在 8 月 28 日下午进行后台系统升级时，新的归档程序把“联合档案完整度”错误地加入了正式舞台授权条件。

系统开始认为：如果 ARCHIVE 06 没有完成，那么二周年资料包就是“不完整”。于是舞台授权被自动冻结。

没有人恶作剧。没有黑客。也没有人故意把舞台锁起来。

十个房间里的谜题，其实全部来自当初测试“联合档案”时留下的数据。

所以有：分房、三人组、26 键、登言登语、耳洞、宠物、兄弟姐妹、黑洞游戏、《无所畏惧》、爱情、友情和亲情。

那些看起来最不像“正式档案”的东西，恰恰成为了系统判断“他们是不是他们”最重要的数据。`;

function showEnding(){
  closeModal();
  sceneBg.src='assets/backgrounds/bg12.jpg'; hotspots.innerHTML=''; $('#sceneCanvas').classList.add('endingGlow');
  const complete=state.fragments.length===30;
  if(complete){
    $('#clockTime').textContent='00:00'; $('#clockDate').textContent='2026.08.29';
    $('#endingOverlay').innerHTML=`<div class="endingPanel"><div class="eyebrow">MEMORY RECORDS</div><h1>30 / 30</h1><h2>完整记录已具备恢复条件</h2><p>话筒不在这次故事里。最终需要恢复的，是第六份联合身份档案。</p><div class="lightBars"><i></i><i></i><i></i><i></i><i></i></div><div class="endingActions"><button id="restoreMemory" class="primary big">恢复原始记录</button><button id="backCollect" class="secondary">返回场景</button></div></div>`;
    $('#endingOverlay').classList.remove('hidden');
    $('#restoreMemory').onclick=showCompleteEnding;
    $('#backCollect').onclick=leaveEnding;
  }else{
    state.normalEnding=true; saveState();
    $('#clockTime').textContent='23:58'; $('#clockDate').textContent='2026.08.28';
    $('#endingOverlay').innerHTML=`<div class="endingPanel"><div class="eyebrow">ARCHIVE 06 · RECOVERED</div><h1>登陆少年</h1><h2>STAGE READY</h2><p>系统重新载入二周年特别影像。后台终于恢复。</p><p>舞台资料系统之所以锁定，是因为“联合身份档案”缺少了大量关系字段；经过十个房间，资料被重新补齐。</p><p class="gold">五份档案已经够完整。<br>但第六份档案，必须五个人一起才能写完。</p><div class="divider"></div><h2>普通结局 · 第六份档案</h2><p>当前剧情碎片：${state.fragments.length} / 30。仍可返回前面的房间补收集。</p><div class="endingActions"><button id="backCollect" class="primary">返回补收集</button><button id="archiveEnd" class="secondary">查看联合档案</button></div></div>`;
    $('#endingOverlay').classList.remove('hidden');
    $('#backCollect').onclick=leaveEnding;
    $('#archiveEnd').onclick=()=>{ $('#endingOverlay').classList.add('hidden'); renderScene(); openArchive(); };
  }
}
function leaveEnding(){ $('#endingOverlay').classList.add('hidden'); renderScene(); }
function showCompleteEnding(){
  state.completeEnding=true; saveState();
  $('#endingOverlay').innerHTML=`<div class="endingPanel"><div class="eyebrow">2026.08.29 · 00:00</div><h1>ARCHIVE 06</h1><h2>登陆少年</h2><div class="memoryStory">${escapeHtml(FULL_STORY)}</div><div class="divider"></div><p class="endingCode">字段类型：联合身份　/　成员数量：5　/　状态：持续更新中</p><p>这份档案永远不会真正完成。<br>因为他们还会继续产生新的答案。</p><div class="lightBars"><i></i><i></i><i></i><i></i><i></i></div><h1 style="font-size:25px">二周年快乐。</h1><h2>第六份档案，请继续一起写。</h2><p class="gold">完整结局：《我们》</p><div class="divider"></div><p>“个人资料记录一个人，回忆才记录我们。”</p><div class="endingActions"><button id="backCollect" class="secondary">返回场景</button><button id="restart" class="ghost">重新开始</button></div></div>`;
  $('#backCollect').onclick=leaveEnding; $('#restart').onclick=()=>{ if(confirm('确定清空全部进度重新开始吗？')) resetState(); };
}

function openBgm(){
  const a=$('#bgmAudio');
  setModal('BGM','音频文件固定读取项目根目录的 bgm.mp3。浏览器要求在用户交互后才能播放声音。',`<div class="bgmPanel"><button id="toggleBgm" class="primary">${a.paused?'播放 BGM':'暂停 BGM'}</button><div><div class="label">音量</div><input id="vol" class="volumeRange" type="range" min="0" max="1" step="0.01" value="${state.bgmVolume}"></div></div><div class="divider"></div><p class="tiny">如果以后要换音乐，只需用新的音频覆盖根目录 <b>bgm.mp3</b>，无需修改代码。</p>`,'small',{review:false});
  $('#toggleBgm').onclick=async()=>{ if(a.paused){state.bgmOn=true;await playBgm();$('#toggleBgm').textContent='暂停 BGM';}else{a.pause();state.bgmOn=false;saveState();updateHud();$('#toggleBgm').textContent='播放 BGM';} };
  $('#vol').oninput=e=>{state.bgmVolume=Number(e.target.value);a.volume=state.bgmVolume;saveState();};
}
async function playBgm(){
  const a=$('#bgmAudio'); a.volume=state.bgmVolume;
  try{await a.play();state.bgmOn=true;saveState();updateHud();}catch(e){state.bgmOn=false;saveState();toast('浏览器暂时阻止了自动播放。点击 BGM 按钮即可手动开启。','info');}
}

$('#puzzleHubBtn').onclick=()=>openPuzzleHub();
$('#reviewBtn').onclick=openReview;
$('#archiveBtn').onclick=openArchive;
$('#mapBtn').onclick=openMap;
$('#bgmBtn').onclick=openBgm;
$('#bgmAudio').addEventListener('play',updateHud); $('#bgmAudio').addEventListener('pause',updateHud); $('#bgmAudio').addEventListener('error',()=>toast('未读取到 bgm.mp3，请确认文件位于项目根目录。','bad'));

document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#endingOverlay').classList.contains('hidden'))leaveEnding();else if(!modalOverlay.classList.contains('hidden'))closeModal();}});

function beginGame(newGame=false){
  if(newGame){state=freshState();saveState();}
  $('#introOverlay').classList.add('hidden');
  renderScene();
  if(state.bgmOn) playBgm();
  setTimeout(()=>toast('提示：所有已解谜题都会自动写入“回看记录”。组合题不用硬记。','info'),550);
}

$('#startGameBtn').onclick=()=>beginGame(true);
$('#continueGameBtn').onclick=()=>beginGame(false);
$('#resetGameBtn').onclick=()=>{if(confirm('确定清空全部密室进度吗？'))resetState();};

function init(){
  const saved=hasSave();
  $('#continueGameBtn').classList.toggle('hidden',!saved);
  $('#resetGameBtn').classList.toggle('hidden',!saved);
  $('#startGameBtn').textContent=saved?'开始新游戏':'进入第一局';
  const a=$('#bgmAudio'); a.volume=state.bgmVolume;
  renderScene(); updateHud();
}
init();
