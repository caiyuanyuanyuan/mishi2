(() => {
  'use strict';
  const D = window.GAME_DATA;
  const LS_KEY = 'zeroPointMemoryVerify_v1';
  const root = document.getElementById('gameRoot');
  const modalRoot = document.getElementById('modalRoot');
  const hudScene = document.getElementById('hudScene');
  const bgm = document.getElementById('bgm');
  let hintTimer = null;

  const defaultState = () => ({
    started:false,currentScene:1,unlockedScene:1,scene10Part:'front',
    completedPuzzles:{},foundSubs:{},hints:{},easterClicks:0,
    bgm:{enabled:false,volume:.32},master:false,stageReached:false,
    ending:{ordinary:false,director:false}
  });

  let state = loadState();
  function loadState(){
    try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(LS_KEY)||'{}')); }
    catch { return defaultState(); }
  }
  function saveState(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); updateHud(); }
  function pkey(s,p){ return `${s}-${p}`; }
  function isPuzzleDone(s,p){ return !!state.completedPuzzles[pkey(s,p)]; }
  function scenePuzzleCount(s){ return D.puzzleMeta[s].length; }
  function completedCount(s){ let n=0; for(let p=0;p<scenePuzzleCount(s);p++) if(isPuzzleDone(s,p)) n++; return n; }
  function isSceneDone(s){ return completedCount(s) === scenePuzzleCount(s); }
  function totalSceneDone(){ let n=0; for(let s=1;s<=10;s++) if(isSceneDone(s)) n++; return n; }
  function foundCount(){ return Object.values(state.foundSubs).filter(Boolean).length; }
  function updateHud(){
    const done=totalSceneDone(); hudScene.textContent=`MEMORY VERIFY · ${done} / 10 · 未剪字幕 ${foundCount()} / 30`;
    document.getElementById('btnSupport').classList.toggle('hidden', !(state.ending.ordinary||state.ending.director));
  }
  function toast(msg,type=''){ const el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=msg; document.getElementById('toastStack').appendChild(el); setTimeout(()=>el.remove(),3300); }
  function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  function normCode(s){ return String(s||'').replace(/[^0-9A-Za-z\u4e00-\u9fff]/g,'').toLowerCase(); }
  function sameSet(a,b){ return a.length===b.length && [...a].sort().join('|')===[...b].sort().join('|'); }
  function memberName(id){ return D.members.find(m=>m.id===id)?.name||id; }
  function member(id){ return D.members.find(m=>m.id===id); }

  // HUD
  document.getElementById('btnArchive').onclick=()=> state.started ? openArchive() : toast('校验档案还没有建立。');
  document.getElementById('btnSceneMap').onclick=()=> state.started ? openSceneMap() : toast('先启动记忆校验。');
  document.getElementById('btnRestart').onclick=openRestart;
  document.getElementById('btnBgm').onclick=openBgm;
  document.getElementById('btnSupport').onclick=()=>openModal('催更','AUTHOR SUPPORT',`<div class="support-card"><div class="heart">♡</div><p>去小红书打赏激励作者不眠不休更新下一篇啊~</p></div>`,{narrow:true});

  function render(){
    updateHud();
    if(!state.started) renderStart(); else renderScene(state.currentScene);
  }

  function renderStart(){
    root.innerHTML=`<section class="screen start-screen"><div class="start-card">
      <div class="kicker">TOP 登陆少年二周年主题 · 十局连续密室</div>
      <div class="start-title">《密室：零点校验》</div>
      <div class="start-sub">2026.08.28 · 23:07 · 距离 8 月 29 日零点已经不到一个小时。<br>二周年特别舞台彩排结束以后，工作人员准备最后测试舞台大屏。</div>
      <div class="terminal">&gt; TOP_2ND_MASTER_FINAL<br>&gt; <b>MEMORY VERIFY&nbsp;&nbsp;0 / 10</b><br>&gt; FINAL MASTER OFFLINE<br><br>“想看最后一版，就先证明你还记得前面的。”</div>
      <div class="start-actions"><button class="primary" id="startBtn">启动记忆校验</button><button class="secondary" id="rulesBtn">查看机制</button></div>
      <div class="start-meta">玩家必须在零点之前完成十次校验，找回离线保存的二周年最终母带。</div>
    </div></section>`;
    document.getElementById('startBtn').onclick=()=>{state.started=true; saveState(); render();};
    document.getElementById('rulesBtn').onclick=()=>openModal('校验规则','SYSTEM NOTE',`<div class="rule-card">每一局都有连续谜题。完成当局后会解锁下一局，但你仍然可以返回以前的房间寻找遗漏的【未剪字幕】。<br><br>右上角【校验档案】只保存已经确认的知识，不直接保存最终密码。所有进度、BGM 设置、字幕收集与结局记录都写入 localStorage。</div>`,{narrow:true});
  }

  function renderScene(sid){
    const scene=D.scenes[sid-1];
    const back = sid===10 && state.scene10Part==='back';
    const img = back ? scene.backImage : scene.image;
    const hots = (sid===10 && back) ? scene10BackHotspots() : D.hotspots[sid];
    const dots=D.puzzleMeta[sid].map((_,i)=>`<i class="dot ${isPuzzleDone(sid,i)?'done':''}"></i>`).join('');
    root.innerHTML=`<section class="screen scene-screen theme-${scene.theme}"><div class="scene-stage">
      <img class="bg" src="${img}" alt="Scene ${sid} ${esc(scene.title)}">
      <div class="scene-vignette"></div>
      <div class="scene-header-card"><div class="scene-number">SCENE ${String(sid).padStart(2,'0')} ${back?'· MIRROR BACK':''}</div><h2>${esc(scene.title)}</h2><p>${esc(scene.objective)}</p></div>
      ${hots.map(h=>hotspotHtml(h,sid)).join('')}
      <div class="scene-progress"><span>${completedCount(sid)}/${scenePuzzleCount(sid)} 校验</span>${dots}<span class="subtitle-meter">字幕 ${sceneSubCount(sid)}/3</span></div>
      ${isSceneDone(sid) ? `<button class="scene-next" id="nextSceneBtn">${sid<10?'进入下一局 →':(state.master?'前往舞台 →':'最终归档已就绪')}</button>`:''}
    </div></section>`;
    root.querySelectorAll('.hotspot').forEach(el=>el.onclick=()=>handleHotspot(sid,el.dataset));
    const nb=document.getElementById('nextSceneBtn'); if(nb) nb.onclick=()=>{
      if(sid<10){ state.currentScene=sid+1; state.unlockedScene=Math.max(state.unlockedScene,sid+1); saveState(); renderScene(state.currentScene); }
      else if(state.master) renderStageIntro(); else toast('先从 B 柜取得最终母带。');
    };
  }

  function hotspotHtml(h,sid){
    const done=h.kind==='puzzle' && isPuzzleDone(sid,Number(h.p));
    return `<button class="hotspot ${h.kind==='sub'?'subtle-sub':''} ${done?'completed':''}" data-kind="${h.kind}" ${h.p!=null?`data-p="${h.p}"`:''} ${h.i!=null?`data-i="${h.i}"`:''} style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%" aria-label="${esc(h.label||'可交互区域')}"><span class="hotspot-label">${esc(h.label||'可交互区域')}</span></button>`;
  }
  function sceneSubCount(s){ let n=0; for(let i=0;i<3;i++) if(state.foundSubs[`${s}-${i}`]) n++; return n; }
  function handleHotspot(sid,data){
    if(data.kind==='puzzle'){ const p=Number(data.p); if(!canOpenPuzzle(sid,p)) return; openPuzzle(sid,p); }
    else if(data.kind==='sub') collectSubtitle(sid,Number(data.i));
    else {
      const hs=(sid===10&&state.scene10Part==='back'?scene10BackHotspots():D.hotspots[sid]).find(h=>h.kind==='env');
      openModal(hs?.label||'环境反馈','ENVIRONMENT',`<div class="environment-message"><div class="icon">⌁</div>${esc(hs?.text||'这里暂时没有新的机关。')}</div>`,{narrow:true});
    }
  }
  function canOpenPuzzle(s,p){
    if(p>0 && !isPuzzleDone(s,p-1)){ toast('前一项校验还没有完成。'); return false; }
    if(s===10 && p>0 && state.scene10Part!=='back'){ toast('镜面仍处于锁定状态。'); return false; }
    return true;
  }
  function scene10BackHotspots(){
    return [
      {kind:'puzzle',p:1,x:36,y:28,w:30,h:43,label:'A / B 归档箱'},
      {kind:'puzzle',p:2,x:38,y:53,w:29,h:33,label:'MASTER ARCHIVE · B'},
      {kind:'env',x:4,y:2,w:31,h:92,label:'镜后区域',text:'镜子已经移开。左侧只剩一块深色镜面反光，真正的归档架藏在后面。'},
      {kind:'sub',i:0,x:67,y:19,w:7,h:10,label:'上层设备记录'},
      {kind:'sub',i:1,x:89,y:7,w:7,h:10,label:'门边警示灯'},
      {kind:'sub',i:2,x:54,y:34,w:6,h:8,label:'B 柜标签'}
    ];
  }

  function collectSubtitle(s,i){
    const key=`${s}-${i}`; const no=(s-1)*3+i+1;
    if(state.foundSubs[key]){ toast(`未剪字幕 ${String(no).padStart(2,'0')} 已经归档。`); return; }
    state.foundSubs[key]=true; saveState();
    openModal(`未剪字幕 ${String(no).padStart(2,'0')}`,'UNUSED SUBTITLE',`<div class="subtitle-found"><div class="subtitle-no">${String(no).padStart(2,'0')}</div><div><div class="subtitle-index">TIMELINE FRAGMENT FOUND</div><p>“${esc(D.subtitles[s][i])}”</p></div></div>`,{narrow:true,onClose:()=>renderScene(state.currentScene)});
  }

  // Modal utility
  function openModal(title,kicker,body,opt={}){
    closeModal(false);
    modalRoot.innerHTML=`<div class="modal-backdrop"><section class="modal ${opt.narrow?'narrow':''} ${opt.wide?'wide':''}" role="dialog" aria-modal="true"><div class="modal-head"><small>${esc(kicker||'')}</small><h3>${esc(title)}</h3>${opt.subtitle?`<p>${esc(opt.subtitle)}</p>`:''}<button class="modal-close" aria-label="关闭">×</button></div><div class="modal-body">${body}</div></section></div>`;
    modalRoot.querySelector('.modal-close').onclick=()=>closeModal(true);
    modalRoot.querySelector('.modal-backdrop').onclick=e=>{ if(e.target===e.currentTarget && !opt.locked) closeModal(true); };
    modalRoot._onClose=opt.onClose||null;
    return modalRoot.querySelector('.modal-body');
  }
  function closeModal(callCb=true){
    if(hintTimer){clearInterval(hintTimer);hintTimer=null;}
    const cb=modalRoot._onClose; modalRoot.innerHTML=''; modalRoot._onClose=null; if(callCb&&cb) cb();
  }

  function openPuzzle(s,p){
    const meta=D.puzzleMeta[s][p], done=isPuzzleDone(s,p);
    const body=openModal(meta.title,`SCENE ${String(s).padStart(2,'0')} · VERIFY ${p+1}`,`<div id="puzzleMount"></div><div id="hintMount"></div>`,{wide:true,onClose:()=>renderScene(state.currentScene)});
    const mount=body.querySelector('#puzzleMount');
    if(done){ mount.innerHTML=`<div class="puzzle-done-banner">✓ 这项校验已经通过。你可以重新查看谜面，但进度不会被清除。</div>`; }
    renderPuzzleContent(s,p,mount,done);
    renderHintSystem(s,p,body.querySelector('#hintMount'));
  }

  function completePuzzle(s,p,msg='校验通过。'){
    if(isPuzzleDone(s,p)){toast('这项校验已经记录。','ok'); return;}
    state.completedPuzzles[pkey(s,p)]=true;
    if(isSceneDone(s) && s<10) state.unlockedScene=Math.max(state.unlockedScene,s+1);
    saveState(); toast(msg,'ok');
  }
  function finishAndRefresh(s,p,msg){ completePuzzle(s,p,msg); setTimeout(()=>{ closeModal(false); renderScene(state.currentScene); },500); }
  function feedback(el,msg,ok=false){ el.textContent=msg; el.className=`feedback ${ok?'ok':'bad'}`; }

  function renderHintSystem(s,p,mount){
    const key=pkey(s,p), hints=D.puzzleMeta[s][p].hints;
    if(!state.hints[key]) state.hints[key]={revealed:0,t1:0,t2:0};
    mount.className='hint-box';
    mount.innerHTML=`<div class="section-title">三级提示</div><div class="hint-actions"><button class="hint-btn" data-h="1"></button><button class="hint-btn" data-h="2"></button><button class="hint-btn" data-h="3"></button></div><div class="hintReveals"></div>`;
    mount.querySelectorAll('.hint-btn').forEach(b=>b.onclick=()=>useHint(key,Number(b.dataset.h),hints,mount));
    const refresh=()=>refreshHintButtons(key,hints,mount); refresh(); hintTimer=setInterval(refresh,1000);
  }
  function useHint(key,n,hints,mount){
    const h=state.hints[key], now=Date.now();
    if(n===1 && h.revealed<1){h.revealed=1;h.t1=now;}
    else if(n===2 && h.revealed<2 && now-h.t1>=15000){h.revealed=2;h.t2=now;}
    else if(n===3 && h.revealed<3 && now-h.t2>=20000){h.revealed=3;}
    saveState(); refreshHintButtons(key,hints,mount);
  }
  function refreshHintButtons(key,hints,mount){
    if(!mount?.isConnected) return; const h=state.hints[key], now=Date.now(); const bs=mount.querySelectorAll('.hint-btn');
    const wait2=Math.max(0,15-Math.floor((now-h.t1)/1000)), wait3=Math.max(0,20-Math.floor((now-h.t2)/1000));
    bs[0].textContent=h.revealed>=1?'Hint 1 ✓':'Hint 1'; bs[0].disabled=h.revealed>=1;
    bs[1].textContent=h.revealed>=2?'Hint 2 ✓':(h.revealed<1?'Hint 2 · 锁定':wait2>0?`Hint 2 · ${wait2}s`:'Hint 2'); bs[1].disabled=h.revealed<1||h.revealed>=2||wait2>0;
    bs[2].textContent=h.revealed>=3?'Hint 3 ✓':(h.revealed<2?'Hint 3 · 锁定':wait3>0?`Hint 3 · ${wait3}s`:'Hint 3'); bs[2].disabled=h.revealed<2||h.revealed>=3||wait3>0;
    mount.querySelector('.hintReveals').innerHTML=Array.from({length:h.revealed},(_,i)=>`<div class="hint-reveal"><b>Hint ${i+1}</b> · ${esc(hints[i])}</div>`).join('');
  }

  // Reusable member UI helpers
  function memberButtons(ids=D.members.map(m=>m.id), withNames=true){ return ids.map(id=>{const m=member(id);return `<button type="button" class="toggle-member" data-id="${id}">${withNames?esc(m.name):'成员卡'}</button>`}).join(''); }
  function memberOptions(blank='请选择'){ return `<option value="">${blank}</option>`+D.members.map(m=>`<option value="${m.id}">${m.name}</option>`).join(''); }
  function photoGrid(unknown=true){ const order=['zzy','zzx','zj','zh','sxh']; return `<div class="grid five">${order.map(id=>{const m=member(id);return `<button class="member-card ${unknown?'unknown':''}" data-member="${id}" type="button"><img src="${m.image}" alt="成员照片"><div class="member-caption">${unknown?'档案 ?':m.name}</div></button>`}).join('')}</div>`; }

  function renderPuzzleContent(s,p,mount,done){
    const key=`${s}-${p}`;
    if(key==='1-0') return puzzleS1P1(mount,done);
    if(key==='1-1') return puzzleS1P2(mount,done);
    if(key==='1-2') return puzzleS1P3(mount,done);
    if(key==='2-0') return puzzleS2P1(mount,done);
    if(key==='2-1') return puzzleS2P2(mount,done);
    if(key==='2-2') return simpleCode(mount,2,2,'按“强 花 壮 香 锤”读取每个人拥有过的不同室友数量。','12111');
    if(key==='3-0') return numberTable(mount,3,0,'耳洞数量',{zzx:7,zh:2,zzy:0,zj:0,sxh:0});
    if(key==='3-1') return numberTable(mount,3,1,'有兄弟姐妹记 1，没有记 0',{zzx:0,zh:0,zzy:0,zj:1,sxh:1});
    if(key==='3-2') return puzzleS3P3(mount,done);
    if(key==='4-0') return groupSelect(mount,4,0,'第一张分类表',['领带 / 长裤','领结 / 短裤'],{zzx:0,zh:0,zzy:1,zj:0,sxh:1});
    if(key==='4-1') return groupSelect(mount,4,1,'第二张分类表',['体力组','脑力组'],{zzx:0,zh:1,zzy:1,zj:0,sxh:0});
    if(key==='4-2') return puzzleS4P3(mount,done);
    if(key==='5-0') return puzzleS5P1(mount,done);
    if(key==='5-1') return puzzleS5P2(mount,done);
    if(key==='5-2') return puzzleS5P3(mount,done);
    if(key==='5-3') return puzzleS5P4(mount,done);
    if(key==='6-0') return puzzleS6P1(mount,done);
    if(key==='6-1') return puzzleS6P2(mount,done);
    if(key==='6-2') return numberTable(mount,6,2,'五首舞台出演次数',{zzx:2,zzy:3,zj:4,zh:3,sxh:3});
    if(key==='6-3') return puzzleS6P4(mount,done);
    if(key==='7-0') return puzzleS7P1(mount,done);
    if(key==='7-1') return puzzleS7P2(mount,done);
    if(key==='7-2') return simpleCode(mount,7,2,'规则：120°E 西边=0；距离 120°E 不超过 0.1°=2；东边=1。按生日月份由早到晚读取。','02100');
    if(key==='8-0') return puzzleS8P1(mount,done);
    if(key==='8-1') return puzzleS8P2(mount,done);
    if(key==='8-2') return simpleCode(mount,8,2,'MASTER VIDEO · CHAPTER INDEX：输入四张已经筛出的章节卡。','03071009');
    if(key==='9-0') return puzzleS9P1(mount,done);
    if(key==='9-1') return simpleCode(mount,9,1,'继续使用第三局的整套 QWERTY 连续编号，把 R / M / H / Y 依次变成两位数字。','04261606');
    if(key==='9-2') return puzzleS9P3(mount,done);
    if(key==='10-0') return puzzleS10P1(mount,done);
    if(key==='10-1') return puzzleS10P2(mount,done);
    if(key==='10-2') return puzzleS10P3(mount,done);
  }

  function puzzleS1P1(mount,done){
    const cards=[['Twenty-two X','zzx'],['ZACK / B.A.O','zzy'],['Jeremy','zj'],['LEFT','zh'],['SU','sxh']];
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">操作：先点一张英文名卡，再点一张成员照片完成归档。照片在完成校验前不长期显示姓名。</div><div class="section-title">英文名卡</div><div id="aliasPool">${cards.map((x,i)=>`<button class="token" data-alias="${i}">${esc(x[0])}</button>`).join('')}</div><div class="section-title">五份成员档案</div>${photoGrid(true)}<div class="input-row" style="margin-top:12px"><button class="verify-btn" id="verify">归档校验</button></div><div class="feedback" id="fb"></div>`);
    let selected=null, assign={};
    mount.querySelectorAll('[data-alias]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.alias); mount.querySelectorAll('[data-alias]').forEach(x=>x.classList.toggle('selected',x===b));});
    mount.querySelectorAll('[data-member]').forEach(b=>b.onclick=()=>{if(selected==null){toast('先选一张英文名卡。');return;} Object.keys(assign).forEach(k=>{if(assign[k]===b.dataset.member) delete assign[k];}); assign[selected]=b.dataset.member; update();});
    function update(){ mount.querySelectorAll('[data-member]').forEach(b=>{const idx=Object.keys(assign).find(k=>assign[k]===b.dataset.member); const cap=b.querySelector('.member-caption'); cap.textContent=idx!=null?cards[Number(idx)][0]:'档案 ?'; b.classList.toggle('selected',idx!=null);}); }
    mount.querySelector('#verify').onclick=()=>{ const ok=cards.every((x,i)=>assign[i]===x[1]); if(ok){feedback(mount.querySelector('#fb'),'五份基础档案恢复。',true); finishAndRefresh(1,0,'MEMORY CHECK · 英文名归档完成');} else feedback(mount.querySelector('#fb'),'这个人的另外两条信息好像对不上。'); };
  }

  function puzzleS1P2(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">终端显示：“从一年最早出生的人开始。”<br>排好五个人以后，只看 MBTI 最后一个字母：J = 1，P = 0。</div><div class="section-title">点击五个人，建立生日月份顺序</div><div id="orderPool">${memberButtons()}</div><div class="rule-card" id="orderView" style="margin-top:10px">读取顺序：—</div><div class="input-row" style="margin-top:12px"><input class="code-input" id="code" placeholder="输入 5 位 0/1"><button class="secondary" id="clear">清空顺序</button><button class="verify-btn" id="verify">校验</button></div><div class="feedback" id="fb"></div>`);
    const order=[]; mount.querySelectorAll('#orderPool .toggle-member').forEach(b=>b.onclick=()=>{if(!order.includes(b.dataset.id)&&order.length<5){order.push(b.dataset.id);b.classList.add('on');update();}}); mount.querySelector('#clear').onclick=()=>{order.length=0;mount.querySelectorAll('.toggle-member').forEach(b=>b.classList.remove('on'));update();}; function update(){mount.querySelector('#orderView').textContent='读取顺序：'+(order.length?order.map(memberName).join(' → '):'—');}
    mount.querySelector('#verify').onclick=()=>{const okOrder=order.join(',')==='sxh,zj,zzy,zh,zzx', okCode=normCode(mount.querySelector('#code').value)==='10100'; if(okOrder&&okCode) finishAndRefresh(1,1,'生日顺序与 MBTI 读取规则已确认'); else feedback(mount.querySelector('#fb'),okOrder?'顺序已经对了，但校验码没有通过。':'这些信息都对，但读取顺序似乎还有问题。');};
  }

  function puzzleS1P3(mount){
    const qs=[['左上','INFP + 重庆'],['右上','INFP + 非重庆'],['左下','非 INFP + 重庆'],['右下','非 INFP + 非重庆']];
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">四象限：横向为 重庆 / 非重庆，纵向为 INFP / 非 INFP。先归档，再按 <b>右上 → 右下 → 左下 → 左上</b> 读取；左上若有两人，按生日月份先后。</div><table class="matrix"><tr><th>成员</th>${D.members.map(m=>`<th>${m.name}</th>`).join('')}</tr><tr><td>象限</td>${D.members.map(m=>`<td><select class="select-input quad" data-id="${m.id}"><option value="">—</option>${qs.map((q,i)=>`<option value="${i}">${q[0]} · ${q[1]}</option>`).join('')}</select></td>`).join('')}</tr></table><div class="section-title">按系统规则依次点击五个人</div><div id="orderPool">${memberButtons()}</div><div class="rule-card" id="orderView" style="margin-top:10px">读取：—</div><div class="input-row" style="margin-top:12px"><button class="secondary" id="clear">清空</button><button class="verify-btn" id="verify">完成四象限校验</button></div><div class="feedback" id="fb"></div>`);
    const order=[]; mount.querySelectorAll('#orderPool .toggle-member').forEach(b=>b.onclick=()=>{if(!order.includes(b.dataset.id)){order.push(b.dataset.id);b.classList.add('on');mount.querySelector('#orderView').textContent='读取：'+order.map(memberName).join(' → ');}}); mount.querySelector('#clear').onclick=()=>{order.length=0;mount.querySelectorAll('#orderPool .toggle-member').forEach(b=>b.classList.remove('on'));mount.querySelector('#orderView').textContent='读取：—';};
    mount.querySelector('#verify').onclick=()=>{const ans={zzx:'0',zh:'0',zj:'1',sxh:'2',zzy:'3'}; const qok=[...mount.querySelectorAll('.quad')].every(x=>x.value===ans[x.dataset.id]); const ook=order.join(',')==='zj,zzy,sxh,zh,zzx'; if(qok&&ook) finishAndRefresh(1,2,'MEMORY CHECK 01 解锁'); else feedback(mount.querySelector('#fb'),qok?'象限已经归对，但读取顺序似乎还有问题。':'这张卡暂时对不上。');};
  }

  function puzzleS2P1(mount){
    const chars=['强','花','壮','香','锤'], families=['爸爸','妈妈','弟弟','姐姐','团宠']; const ans={强:['zj','爸爸'],花:['zzy','妈妈'],壮:['zzx','弟弟'],香:['sxh','姐姐'],锤:['zh','团宠']};
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">冰箱磁贴只写了五个字：“强 花 壮 香 锤”。给每个角色字选择成员，再选择家庭身份。</div><table class="matrix"><tr><th>角色字</th><th>成员</th><th>家庭身份</th></tr>${chars.map(c=>`<tr><td><b>${c}</b></td><td><select class="select-input who" data-c="${c}">${memberOptions()}</select></td><td><select class="select-input fam" data-c="${c}"><option value="">请选择</option>${families.map(x=>`<option>${x}</option>`).join('')}</select></td></tr>`).join('')}</table><div class="input-row" style="margin-top:12px"><button class="verify-btn" id="verify">组合角色卡</button></div><div class="feedback" id="fb"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=chars.every(c=>mount.querySelector(`.who[data-c="${c}"]`).value===ans[c][0]&&mount.querySelector(`.fam[data-c="${c}"]`).value===ans[c][1]); if(ok) finishAndRefresh(2,0,'五个角色已确认'); else feedback(mount.querySelector('#fb'),'这个人的另外两条信息好像对不上。');};
  }

  function pairKey(a,b){ return [a,b].sort().join('-'); }
  function puzzleS2P2(mount){
    const ids=D.members.map(m=>m.id); const pairs=[]; for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)pairs.push([ids[i],ids[j]]);
    const correct={1:[pairKey('zj','zzy')],2:[pairKey('zzx','zh'),pairKey('zzy','zj')],3:[pairKey('zzx','zh'),pairKey('zzy','sxh')]};
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">每一天勾选真正“住在同一间房”的成员对。没有勾选到的人自动视为单独住宿</div>${[1,2,3].map(d=>`<div class="section-title">第 ${d} 天</div><div class="pair-grid">${pairs.map(([a,b])=>`<label class="check-card"><input type="checkbox" data-day="${d}" value="${pairKey(a,b)}">${memberName(a)} + ${memberName(b)}</label>`).join('')}</div>`).join('')}<div class="input-row" style="margin-top:14px"><button class="verify-btn" id="verify">提交三天分房</button></div><div class="feedback" id="fb"></div>`);
    mount.querySelector('#verify').onclick=()=>{let ok=true;for(const d of [1,2,3]){const got=[...mount.querySelectorAll(`input[data-day="${d}"]:checked`)].map(x=>x.value);if(!sameSet(got,correct[d]))ok=false;} if(ok) finishAndRefresh(2,1,'三天室友关系已归档'); else feedback(mount.querySelector('#fb'),'这张房间卡暂时对不上。记关系。');};
  }

  function numberTable(mount,s,p,title,ans){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">${esc(title)}。请自行填写五个人对应的数字。</div><table class="matrix"><tr>${D.members.map(m=>`<th>${m.name}</th>`).join('')}</tr><tr>${D.members.map(m=>`<td><input class="mini-input n" data-id="${m.id}" inputmode="numeric"></td>`).join('')}</tr></table><div class="input-row" style="margin-top:12px"><button class="verify-btn" id="verify">校验</button></div><div class="feedback" id="fb"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=[...mount.querySelectorAll('.n')].every(x=>String(ans[x.dataset.id])===x.value.trim()); if(ok) finishAndRefresh(s,p,'个人资料已确认'); else feedback(mount.querySelector('#fb'),'校验没有通过。');};
  }

  function puzzleS3P3(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">排序规则：①耳洞多的人在前；②耳洞相同，有手足的人在前；③仍相同，生日月份早的人在前。<br><br>标准 QWERTY 连续编号：<br>第一排：Q=01 W=02 E=03 R=04 T=05 Y=06 U=07 I=08 O=09 P=10<br>第二排：A=11 S=12 D=13 F=14 G=15 H=16 J=17 K=18 L=19<br>第三排：Z=20 X=21 C=22 V=23 B=24 N=25 M=26<br>按刚才五个人的顺序，只取英文名第一个字母。</div><div class="section-title">点击建立成员顺序</div><div id="orderPool">${memberButtons()}</div><div class="rule-card" id="orderView" style="margin-top:10px">顺序：—</div><div class="input-row" style="margin-top:12px"><input id="code" class="code-input"><button id="clear" class="secondary">清空</button><button id="verify" class="verify-btn">转轮校验</button></div><div id="fb" class="feedback"></div>`);
    const order=[]; mount.querySelectorAll('#orderPool .toggle-member').forEach(b=>b.onclick=()=>{if(!order.includes(b.dataset.id)){order.push(b.dataset.id);b.classList.add('on');mount.querySelector('#orderView').textContent='顺序：'+order.map(memberName).join(' → ');}}); mount.querySelector('#clear').onclick=()=>{order.length=0;mount.querySelectorAll('.toggle-member').forEach(b=>b.classList.remove('on'));mount.querySelector('#orderView').textContent='顺序：—';};
    mount.querySelector('#verify').onclick=()=>{const ok1=order.join(',')==='zzx,zh,sxh,zj,zzy',ok2=normCode(mount.querySelector('#code').value)==='0519121720'; if(ok1&&ok2) finishAndRefresh(3,2,'五个 26 键坐标已确认'); else feedback(mount.querySelector('#fb'),ok1?'成员顺序正确，但五个两位数转轮没有通过。':'这些信息都对，但读取顺序似乎还有问题。');};
  }

  function groupSelect(mount,s,p,title,groups,ans){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">${esc(title)}。为五个人选择所属分类。</div><table class="matrix"><tr><th>成员</th><th>分类</th></tr>${D.members.map(m=>`<tr><td>${m.name}</td><td><select class="select-input g" data-id="${m.id}"><option value="">请选择</option>${groups.map((g,i)=>`<option value="${i}">${g}</option>`).join('')}</select></td></tr>`).join('')}</table><div class="input-row" style="margin-top:12px"><button id="verify" class="verify-btn">确认分类表</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=[...mount.querySelectorAll('.g')].every(x=>x.value!=='' && Number(x.value)===ans[x.dataset.id]); if(ok) finishAndRefresh(s,p,'分类表已确认'); else feedback(mount.querySelector('#fb'),'这张卡暂时对不上。');};
  }

  function puzzleS4P3(mount){
    const stations={A:'领结 + 体力',B:'领带 + 体力 + 水瓶',C:'领结 + 脑力',D:'领带 + 脑力',E:'领带 + 体力'}; const ans={A:'sxh',B:'zj',C:'zzy',D:'zh',E:'zzx'};
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">两张表叠起来后，B 与 E 都是“领带 + 体力”，系统补充最后一层：星座。</div><table class="matrix"><tr><th>站位</th><th>三层条件</th><th>成员</th></tr>${Object.entries(stations).map(([k,v])=>`<tr><td><b>${k}</b></td><td>${v}</td><td><select class="select-input st" data-k="${k}">${memberOptions()}</select></td></tr>`).join('')}</table><div class="input-row" style="margin-top:12px"><button id="verify" class="verify-btn">点亮 A-E 光圈</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=[...mount.querySelectorAll('.st')].every(x=>x.value===ans[x.dataset.k]); if(ok) finishAndRefresh(4,2,'五个地面站位全部点亮'); else feedback(mount.querySelector('#fb'),'两张表已经叠上了，但第三层属性仍有一处不匹配。');};
  }

  const quotes=[
    ['A','他们生三个，感情能不好嘛。','sxh'],['B','我只是一个摄影师，没有和过稀泥。','zh'],['C','小宝甜还是青提甜～','zzy'],['D','就是鸡丝凉面！没有错啊~','zzx'],['E','哪有持续！拿过来呀～','zj']
  ];
  const mostTags=[['最想收购 sdfj 的人','zj'],['最没办法的人','zzx'],['最熟练掌握登员使用手册的人','zzy'],['最直的人','zh'],['如果变成女生，想把他们一个个亲一遍的人','sxh']];
  const games=[['憋笑挑战','zzx'],['认人游戏——漫威英雄版','zzy'],['谁是卧底版恐怖箱','zj'],['蒙眼版 123 木头人','zh'],['不能做挑战','sxh']];

  function puzzleS5P1(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">把每张语录配回对应成员。第五句可以直接点击文字。</div>${quotes.map(([l,q])=>`<div class="quote-card ${l==='E'?'easter':''}" data-quote="${l}"><b>${l}</b> “${esc(q)}”<div style="margin-top:7px"><select class="select-input qsel" data-l="${l}">${memberOptions()}</select></div></div>`).join('')}<div class="input-row" style="margin-top:12px"><button id="verify" class="verify-btn">语录归位</button></div><div id="fb" class="feedback"></div>`);
    const e=mount.querySelector('[data-quote="E"]'); e.addEventListener('click',ev=>{if(ev.target.tagName==='SELECT'||ev.target.tagName==='OPTION')return;state.easterClicks=(state.easterClicks||0)+1;saveState();const msgs=['没有持续。','都说了没有持续。','拿过来呀——'];toast(msgs[Math.min(state.easterClicks,3)-1]);});
    mount.querySelector('#verify').onclick=()=>{const ok=quotes.every(([l,,id])=>mount.querySelector(`.qsel[data-l="${l}"]`).value===id); if(ok) finishAndRefresh(5,0,'五张语录已归位'); else feedback(mount.querySelector('#fb'),'这个人的另外两条信息好像对不上。');};
  }
  function puzzleS5P2(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">把五张“最……”标签配回对应成员。</div>${mostTags.map(([t],i)=>`<div class="drop-row"><label>${esc(t)}</label><select class="select-input msel" data-i="${i}">${memberOptions()}</select></div>`).join('')}<div class="input-row"><button id="verify" class="verify-btn">标签归位</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=mostTags.every((x,i)=>mount.querySelector(`.msel[data-i="${i}"]`).value===x[1]); if(ok) finishAndRefresh(5,1,'五张“最……”标签已归位'); else feedback(mount.querySelector('#fb'),'这张标签暂时对不上。');};
  }
  function puzzleS5P3(mount){
    const shuffled=[games[3],games[0],games[4],games[1],games[2]];
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">给每个黑洞游戏选择对应成员。</div>${shuffled.map(([g],i)=>`<div class="drop-row"><label>${esc(g)}</label><select class="select-input gsel" data-i="${i}">${memberOptions()}</select></div>`).join('')}<div class="input-row"><button id="verify" class="verify-btn">黑洞游戏归位</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=shuffled.every((x,i)=>mount.querySelector(`.gsel[data-i="${i}"]`).value===x[1]); if(ok) finishAndRefresh(5,2,'五个黑洞游戏已确认'); else feedback(mount.querySelector('#fb'),'这个人的另外两条信息好像对不上。');};
  }
  function puzzleS5P4(mount){
    const tagOptions=mostTags.map((x,i)=>`<option value="${i}">${esc(x[0])}</option>`).join(''); const gameOptions=games.map((x,i)=>`<option value="${i}">${esc(x[0])}</option>`).join('');
    const qByMember={sxh:'A',zh:'B',zzy:'C',zzx:'D',zj:'E'}, tagByMember={}, gameByMember={}; mostTags.forEach((x,i)=>tagByMember[x[1]]=String(i));games.forEach((x,i)=>gameByMember[x[1]]=String(i));
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">现在系统把三套卡重新打乱。每个成员下面必须同时放入属于他的语录编号、“最……”标签和黑洞游戏。<br>完成后，按黑洞游戏名称字数从少到多读取成员，只取生日日期个位。</div><table class="matrix"><tr><th>成员</th><th>语录</th><th>“最……”标签</th><th>黑洞游戏</th></tr>${D.members.map(m=>`<tr data-m="${m.id}"><td>${m.name}</td><td><select class="select-input qq"><option value="">—</option>${quotes.map(x=>`<option value="${x[0]}">${x[0]}</option>`).join('')}</select></td><td><select class="select-input tt"><option value="">—</option>${tagOptions}</select></td><td><select class="select-input gg"><option value="">—</option>${gameOptions}</select></td></tr>`).join('')}</table><div class="input-row" style="margin-top:12px"><input id="code" class="code-input" placeholder="5 位最终校验码"><button id="verify" class="verify-btn">三层卡校验</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{let triples=true;mount.querySelectorAll('tr[data-m]').forEach(r=>{const id=r.dataset.m;if(r.querySelector('.qq').value!==qByMember[id]||r.querySelector('.tt').value!==tagByMember[id]||r.querySelector('.gg').value!==gameByMember[id])triples=false;}); const code=normCode(mount.querySelector('#code').value)==='92320'; if(triples&&code) finishAndRefresh(5,3,'综合复盘校验完成'); else feedback(mount.querySelector('#fb'),triples?'三层卡都对上了，但最后的读取数字没有通过。':'一句话不够。至少三条线索都对上，才算同一个人。');};
  }

  function toggleGroupWidget(mount,sets,limits){
    const selected={}; Object.keys(sets).forEach(k=>selected[k]=[]);
    mount.querySelectorAll('[data-group][data-mid]').forEach(b=>b.onclick=()=>{const g=b.dataset.group,id=b.dataset.mid,arr=selected[g]; if(arr.includes(id)){arr.splice(arr.indexOf(id),1);b.classList.remove('on');} else if(arr.length<(limits[g]||99)){arr.push(id);b.classList.add('on');} else toast(`这个位置最多选择 ${limits[g]} 人。`);});
    return selected;
  }
  function puzzleS6P1(mount){
    const groups={love:'爱情',friend:'友情',family:'亲情'}, ans={love:['zzx','sxh'],friend:['zh','sxh'],family:['zj','zzy']};
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">每种主题选择两名成员。</div>${Object.entries(groups).map(([k,n])=>`<div class="section-title">${n}</div><div class="stage-members">${D.members.map(m=>`<button class="toggle-member" data-group="${k}" data-mid="${m.id}">${m.name}</button>`).join('')}</div>`).join('')}<div class="input-row" style="margin-top:12px"><button id="verify" class="verify-btn">确认三种主题</button></div><div id="fb" class="feedback"></div>`);
    const sel=toggleGroupWidget(mount,groups,{love:2,friend:2,family:2}); mount.querySelector('#verify').onclick=()=>{const ok=Object.keys(ans).every(k=>sameSet(sel[k],ans[k])); if(ok) finishAndRefresh(6,0,'三种自创歌曲主题已确认'); else feedback(mount.querySelector('#fb'),'这张主题磁贴暂时对不上。');};
  }
  function puzzleS6P2(mount){
    const songs={s1:'《别非让我大声说出来》',s2:'《千疮百孔》',s3:'《Bad Romance》',s4:'《死了都要爱》',s5:'《美》'};
    const ans={s1:['zj','zh','sxh'],s2:['zzx','zh','sxh'],s3:['zzy','zj','zh'],s4:['zzy','zj','sxh'],s5:['zzx','zzy','zj']};
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">每首舞台选择三名成员。</div>${Object.entries(songs).map(([k,n])=>`<div class="section-title">${esc(n)}</div><div class="stage-members">${D.members.map(m=>`<button class="toggle-member" data-group="${k}" data-mid="${m.id}">${m.name}</button>`).join('')}</div>`).join('')}<div class="input-row" style="margin-top:12px"><button id="verify" class="verify-btn">提交五首舞台表</button></div><div id="fb" class="feedback"></div>`);
    const sel=toggleGroupWidget(mount,songs,Object.fromEntries(Object.keys(songs).map(k=>[k,3]))); mount.querySelector('#verify').onclick=()=>{const ok=Object.keys(ans).every(k=>sameSet(sel[k],ans[k])); if(ok) finishAndRefresh(6,1,'五首舞台成员表已恢复'); else feedback(mount.querySelector('#fb'),'这张舞台卡暂时对不上。');};
  }
  function puzzleS6P4(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">第三题得到的次数表只是“读取表”。下面五个问题都先用集合关系选出成员，再读取他的出现次数。<br>A = 爱情组成员集合;B = 友情组成员集合;C = 亲情组成员集合;cnt(x)：成员x的舞台出现次数</div><div class="grid two">
      <div class="question-card"><span class="math">① cnt(A∩B) = ?</span><br>爱情组和友情组共同出现的人的舞台次数</div>
      <div class="question-card"><span class="math">② cnt(A-B) = ?</span><br>友情组中、不属于爱情组的人的舞台次数</div>
      <div class="question-card"><span class="math">③ C = {x1,x2} max(cnt(x1),cnt(x2))</span><br>亲情组两人里，五首舞台出现次数更多的</div>
      <div class="question-card"><span class="math">④ A = {y1,y2} min(cnt(y1),cnt(y2))</span><br>爱情组里出现次数更少的人</div>
      <div class="question-card"><span class="math">⑤ 设全体成员全集为U max<sub>x∈U</sub> cnt(x)</span><br>取全体最多者的舞台次数</div>
    </div><div class="input-row" style="margin-top:12px"><input id="code" class="code-input" placeholder="五位校验码"><button id="verify" class="verify-btn">编队终检</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{if(normCode(mount.querySelector('#code').value)==='33424') finishAndRefresh(6,3,'五首舞台最终校验完成'); else feedback(mount.querySelector('#fb'),'第三题算出的次数表还不是最终密码。');};
  }

  function puzzleS7P1(mount){
    const ans={zzx:'重庆',zh:'重庆',sxh:'重庆',zzy:'哈尔滨',zj:'常州'};
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">城市路线图只有三个出发点：重庆 / 常州 / 哈尔滨。把五个人送回出发城市。</div><table class="matrix"><tr><th>成员</th><th>出发城市</th></tr>${D.members.map(m=>`<tr><td>${m.name}</td><td><select class="select-input city" data-id="${m.id}"><option value="">请选择</option><option>重庆</option><option>常州</option><option>哈尔滨</option></select></td></tr>`).join('')}</table><div class="input-row" style="margin-top:12px"><button id="verify" class="verify-btn">绘制五条路线</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=[...mount.querySelectorAll('.city')].every(x=>x.value===ans[x.dataset.id]); if(ok) finishAndRefresh(7,0,'五条出发路线已恢复'); else feedback(mount.querySelector('#fb'),'这条路线暂时对不上。');};
  }
  function puzzleS7P2(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">哪一个人的出生城市几乎为标准北京时间？</div><div class="input-row"><select id="who" class="select-input" style="max-width:260px">${memberOptions()}</select><button id="verify" class="verify-btn">比较经度</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{if(mount.querySelector('#who').value==='zj') finishAndRefresh(7,1,'常州 119.97°E 已被圈出'); else feedback(mount.querySelector('#fb'),'经纬度不是让你计算北京到家乡多少公里。');};
  }

  function simpleCode(mount,s,p,rule,answer){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">${rule}</div><div class="input-row" style="margin-top:12px"><input id="code" class="code-input" inputmode="numeric" placeholder="输入校验码"><button id="verify" class="verify-btn">校验</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{if(normCode(mount.querySelector('#code').value)===answer) finishAndRefresh(s,p,'校验通过'); else feedback(mount.querySelector('#fb'),'校验没有通过。');};
  }

  function puzzleS8P1(mount){
    const opts = [
  ['01', '《LOVE IS DANGEROUS!（危险的爱）》'],
  ['02', '《耶（Yeah）》'],
  ['03', '《我 VS JustinBieber》'],
  ['04', '《无所畏计划（Emergency）》'],
  ['05', '《For you（写给你）》'],
  ['06', '《痴人说梦（DayDream）》'],
  ['07', '《你能听到吗》'],
  ['08', '《命（FATE）》'],
  ['09', '《走在路上突然收到了快乐邀请》'],
  ['10', '《无所不能 TOP》 · CD Only'],
  ['11', '《Still Alive（背水一战）》']
];
    const conditions=[['A','标题里直接出现 VS 的歌曲','03'],['B','没有任何英文副标题，且在两首纯中文核心候选中标题更短','07'],['C','被明确标记为 CD Only','10'],['D','回到两首纯中文标题，取更长的一首','09']];
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">“不要你背曲序，只要你会筛选。”<br>系统把满足本轮结构条件的四个核心候选推到前台，其余曲目保持灰色，不要求玩家补全未提供的曲目名称。</div><div class="grid two">${opts.map(x=>`<div class="question-card"><b>${x[0]}</b> ${esc(x[1])}</div>`).join('')}</div><div class="section-title">四个筛选条件</div>${conditions.map(([k,t])=>`<div class="drop-row"><label>${k} · ${esc(t)}</label><select class="select-input cond" data-k="${k}"><option value="">选择编号</option>${opts.map(x=>`<option value="${x[0]}">${x[0]}</option>`).join('')}</select></div>`).join('')}<div class="input-row"><button id="verify" class="verify-btn">完成筛选</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=conditions.every(([k,,a])=>mount.querySelector(`.cond[data-k="${k}"]`).value===a); if(ok) finishAndRefresh(8,0,'四个核心候选已筛出'); else feedback(mount.querySelector('#fb'),'注意标题“长什么样”，而不是只看歌名内容。');};
  }
  function puzzleS8P2(mount){
    const slots=[['对抗','03'],['提问','07'],['仅实体介质','10'],['最长中文句子','09']];
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">现在获得 03 / 07 / 10 / 09 四张卡，但卡槽按“筛选理由”命名，不按曲序摆。</div>${slots.map(([n])=>`<div class="drop-row"><label>${n}</label><select class="select-input slot" data-n="${n}"><option value="">选择卡片</option>${['03','07','10','09'].map(x=>`<option>${x}</option>`).join('')}</select></div>`).join('')}<div class="input-row"><button id="verify" class="verify-btn">插入四张卡</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const ok=slots.every(([n,a])=>mount.querySelector(`.slot[data-n="${n}"]`).value===a); if(ok) finishAndRefresh(8,1,'四张卡已按筛选理由归位'); else feedback(mount.querySelector('#fb'),'这张卡暂时对不上。');};
  }

  function puzzleS9P1(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">墙上四张卡：润！ 闷。 哈？ 哟～<br>四个英文字母。</div><div class="input-row"><input id="letters" class="code-input" placeholder="四个字母，例如 ABCD" maxlength="10"><button id="verify" class="verify-btn">识别语音线索</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{if(normCode(mount.querySelector('#letters').value)==='rmhy') finishAndRefresh(9,0,'R / M / H / Y 已确认'); else feedback(mount.querySelector('#fb'),'不要读声调。看四个字的拼音首字母。');};
  }
  function puzzleS9P3(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">标点运算卡：<br><b>！ = 取列　。 = 取行　？ = 行 + 列　～ = 列 - 行</b></div><div class="grid four" style="grid-template-columns:repeat(4,1fr)"><div class="input-row" style="margin-top:12px"><input id="code" class="code-input" placeholder="4 位结果"><button id="verify" class="verify-btn">定位镜后区域</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{if(normCode(mount.querySelector('#code').value)==='4276') finishAndRefresh(9,2,'镜后 B 柜 · MASTER 已定位'); else feedback(mount.querySelector('#fb'),'校验没有通过。');};
  }

  function puzzleS10P1(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">中央屏幕只有四个空格：<br>“不是任何一个人的名字。”<br>“是五个人共同使用的名字。”</div><div class="input-row"><input id="name" class="code-input" placeholder="四个字"><input id="code" class="code-input" placeholder="笔画个位"><button id="verify" class="verify-btn">开启镜面</button></div><div id="fb" class="feedback"></div>`);
    mount.querySelector('#verify').onclick=()=>{const name=String(mount.querySelector('#name').value).replace(/\s/g,''); const code=normCode(mount.querySelector('#code').value); if(name==='登陆少年'&&code==='2746'){completePuzzle(10,0,'共同名字已确认'); state.scene10Part='back'; saveState(); feedback(mount.querySelector('#fb'),'镜面锁解除。',true); setTimeout(()=>{closeModal(false); playMirrorTransition();},650);} else feedback(mount.querySelector('#fb'),name==='登陆少年'?'共同名字正确，但笔画个位校验没有通过。':'不是任何一个人的名字。');};
  }
  function playMirrorTransition(){
    const old=root.querySelector('.scene-stage img.bg'); if(old) old.classList.add('mirror-open'); setTimeout(()=>renderScene(10),1250);
  }
  function puzzleS10P2(mount){
    const icons=[['爸爸','zj'],['最直的人','zh'],['魔术','sxh'],['妈妈','zzy'],['没办法','zzx']];
    mount.insertAdjacentHTML('beforeend',`<div class="rule-card">镜后出现两个黑色硬件箱：<br><b>A · REHEARSAL CACHE</b><br><b>B · MASTER ARCHIVE</b><br><br>第九局已经给过实体位置。先选对归档箱。<br><br>B 柜五位锁依次画着：<b>爸爸 / 最直的人 / 魔术 / 妈妈 / 没办法</b>。这些图标会调用第二局、第五局和基础档案；把图标还原成成员后，再调用第三局的“耳洞 + 兄弟姐妹人数”。</div><div class="input-row"><button class="chip-btn box" data-box="A">打开 A</button><button class="chip-btn box" data-box="B">打开 B</button><span id="boxStatus" class="small-note">尚未选择</span></div><div class="section-title">五个图标先还原成五个人</div>${icons.map(([label],i)=>`<div class="drop-row"><label>${label}</label><select class="select-input icon-member" data-i="${i}">${memberOptions()}</select></div>`).join('')}<div class="rule-card" style="margin-top:12px">锁上写：“取耳洞数 + 兄弟姐妹人数。”</div><div class="input-row" style="margin-top:12px"><input id="code" class="code-input" placeholder="B 柜 5 位密码"><button id="verify" class="verify-btn">最终归档校验</button></div><div id="fb" class="feedback"></div>`);
    let box=''; mount.querySelectorAll('.box').forEach(b=>b.onclick=()=>{box=b.dataset.box;mount.querySelectorAll('.box').forEach(x=>x.classList.toggle('selected',x===b)); if(box==='A'){mount.querySelector('#boxStatus').textContent='错误！这里是彩排缓存。';toast('你找到了正确的区域，但不是正确的母带。','bad');} else mount.querySelector('#boxStatus').textContent='B · MASTER ARCHIVE';});
    mount.querySelector('#verify').onclick=()=>{
      if(box!=='B'){feedback(mount.querySelector('#fb'),'这个标记有点眼熟，也许以前在哪里见过。');return;}
      const mapOk=icons.every(([,id],i)=>mount.querySelector(`.icon-member[data-i="${i}"]`).value===id);
      if(!mapOk){feedback(mount.querySelector('#fb'),'这个人的另外两条信息好像对不上。先把五个图标准确还原成五个人。');return;}
      if(normCode(mount.querySelector('#code').value)==='12109') finishAndRefresh(10,1,'MASTER ARCHIVE 已解锁'); else feedback(mount.querySelector('#fb'),'成员顺序已经对了，但数字校验没有通过。回看第三局的耳洞与手足。');
    };
  }
  function puzzleS10P3(mount){
    mount.insertAdjacentHTML('beforeend',`<div class="master-card"><div class="ssd"><div><b>TOP_2ND_MASTER</b><small>FINAL CUT · DO NOT OVERWRITE</small></div></div><p>里面没有话筒，也没有额外机关。只有一个黑色 SSD。</p><button id="take" class="primary">取得【二周年最终母带】</button></div>`);
    mount.querySelector('#take').onclick=()=>{ if(!state.master){state.master=true;completePuzzle(10,2,'二周年最终母带已取得');state.stageReached=true;saveState();} closeModal(false); setTimeout(renderStageIntro,350); };
  }

  // Archive / map / settings
  function openArchive(){
    const html=`<div class="archive-list">${D.scenes.map(s=>{const c=completedCount(s.id), total=scenePuzzleCount(s.id); if(c===0) return `<div class="archive-scene locked"><h4>Scene ${String(s.id).padStart(2,'0')} · ${esc(D.archive[s.id].title)}</h4><div class="small-note">尚未确认</div></div>`; const items=D.archive[s.id].items; const reveal=Math.max(1,Math.ceil(items.length*c/total)); return `<div class="archive-scene"><h4>Scene ${String(s.id).padStart(2,'0')} · ${esc(D.archive[s.id].title)} <small>${c}/${total}</small></h4><ul>${items.slice(0,reveal).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="not-password">档案只保存“知识”，不会直接显示本局最终密码。</div></div>`;}).join('')}</div>`;
    openModal('校验档案','CONFIRMED KNOWLEDGE',html,{wide:true});
  }
  function openSceneMap(){
    const html=`<div class="rule-card">所有已经进入过的场景都可以返回。完成后仍可回来寻找未剪字幕。</div><div class="scene-map-grid" style="margin-top:12px">${D.scenes.map(s=>{const lock=s.id>state.unlockedScene, cur=s.id===state.currentScene;return `<button class="scene-tile ${lock?'locked':''} ${cur?'current':''}" data-s="${s.id}" ${lock?'disabled':''}><strong>${String(s.id).padStart(2,'0')} · ${esc(s.title)}</strong><small>${completedCount(s.id)}/${scenePuzzleCount(s.id)} 校验 · 字幕 ${sceneSubCount(s.id)}/3</small><div class="mini-dots">${[0,1,2].map(i=>`<i class="${state.foundSubs[`${s.id}-${i}`]?'on':''}"></i>`).join('')}</div></button>`}).join('')}</div>${state.master?`<div class="input-row" style="margin-top:14px"><button id="stageAgain" class="primary">返回舞台</button></div>`:''}`;
    const b=openModal('场景回看','SCENE ARCHIVE',html,{wide:true}); b.querySelectorAll('.scene-tile:not(.locked)').forEach(x=>x.onclick=()=>{state.currentScene=Number(x.dataset.s); if(state.currentScene===10 && !isPuzzleDone(10,0)) state.scene10Part='front'; saveState(); closeModal(false);renderScene(state.currentScene);}); const st=b.querySelector('#stageAgain'); if(st)st.onclick=()=>{closeModal(false);renderStageIntro();};
  }
  function openBgm(){
    const b=openModal('BGM','AUDIO CONTROL',`<div class="rule-card">开关和音量都会保存。</div><div class="input-row" style="margin-top:15px"><button id="toggle" class="primary">${state.bgm.enabled?'暂停 BGM':'播放 BGM'}</button><label>音量 <input id="vol" type="range" min="0" max="1" step="0.01" value="${state.bgm.volume}"></label></div><div class="small-note" style="margin-top:12px">浏览器通常要求先由玩家点击后才允许播放音频。</div>`,{narrow:true});
    b.querySelector('#toggle').onclick=async()=>{state.bgm.enabled=!state.bgm.enabled;saveState();await applyBgm();closeModal(false);openBgm();}; b.querySelector('#vol').oninput=e=>{state.bgm.volume=Number(e.target.value);bgm.volume=state.bgm.volume;saveState();};
  }
  async function applyBgm(){bgm.volume=state.bgm.volume; if(state.bgm.enabled){try{await bgm.play();}catch{state.bgm.enabled=false;saveState();toast('浏览器阻止了自动播放，请再次点击 BGM 播放。');}}else bgm.pause();}
  function openRestart(){
    const b=openModal('重新开始','DANGER ZONE',`<div class="rule-card">重新开始会清除十局谜题、30 段字幕、档案和结局记录。BGM 音量也会恢复默认。</div><p id="restartText">第一次确认：确定要删除当前浏览器里的全部进度吗？</p><div class="input-row"><button id="cancel" class="secondary">取消</button><button id="confirm" class="primary">第一次确认</button></div>`,{narrow:true});
    let step=1;
    b.querySelector('#cancel').onclick=()=>closeModal();
    b.querySelector('#confirm').onclick=()=>{
      if(step===1){step=2;b.querySelector('#restartText').textContent='第二次确认：此操作不可撤销。真的从 Scene 01 重新开始？';b.querySelector('#confirm').textContent='第二次确认并清除';return;}
      localStorage.removeItem(LS_KEY);state=defaultState();bgm.pause();closeModal(false);render();toast('进度已清除。');
    };
  }

  // Stage and endings
  function renderStageIntro(){
    state.stageReached=true;saveState();root.innerHTML=`<section class="screen stage-screen"><img class="stage-bg" src="assets/backgrounds/ending_restore_transition.png" alt="舞台母带恢复"><div class="stage-overlay"><div class="stage-panel"><div class="kicker">FINAL MASTER · STAGE LOAD</div><h2>最后一步</h2><p>【二周年最终母带】正在等待舞台控制台载入。它不属于刚才那个房间。</p><button id="loadMaster" class="primary">载入最终母带</button><button id="backScenes" class="secondary">返回场景补找字幕</button></div></div></section>`;
    document.getElementById('loadMaster').onclick=runCountdown; document.getElementById('backScenes').onclick=()=>{renderScene(state.currentScene);};
  }
  function runCountdown(){
    let sec=52; root.innerHTML=`<section class="screen stage-screen"><img class="stage-bg" src="assets/backgrounds/ending_restore_transition.png" alt="母带恢复"><div class="stage-overlay"><div class="stage-panel"><div class="kicker">MASTER RESTORE</div><div class="countdown" id="count">23:59:52</div><p>母带恢复中……</p></div></div></section>`;
    const t=setInterval(()=>{sec++;const c=document.getElementById('count');if(c)c.textContent=sec<=59?`23:59:${String(sec).padStart(2,'0')}`:'00:00:00';if(sec>=60){clearInterval(t);setTimeout(renderOrdinaryEnding,550);}},520);
  }
  function renderOrdinaryEnding(){
    state.ending.ordinary=true;saveState(); const all=foundCount()===30;
    root.innerHTML=`<section class="screen stage-screen"><img class="stage-bg" src="assets/backgrounds/ending_stage.jpg" alt="二周年舞台"><div class="stage-overlay"><div class="stage-panel"><div class="ending-badge">00:00 · MASTER RESTORED</div><h2>2026.08.29</h2><div class="ending-lines">${D.stageText.ordinary.map(x=>`<p>${esc(x)}</p>`).join('')}</div><div class="input-row" style="justify-content:center;margin-top:14px">${all?`<button id="director" class="primary">恢复未剪字幕 · 30 / 30</button>`:`<button id="backScenes" class="secondary">返回场景补找字幕 · ${foundCount()} / 30</button>`}<button id="map" class="ghost">场景回看</button></div></div></div></section>`;
    const dir=document.getElementById('director'); if(dir)dir.onclick=renderDirectorEnding; const back=document.getElementById('backScenes'); if(back)back.onclick=()=>renderScene(state.currentScene); document.getElementById('map').onclick=openSceneMap;
  }
  function renderDirectorEnding(){
    state.ending.director=true;saveState(); root.innerHTML=`<section class="screen stage-screen"><img class="stage-bg" src="assets/backgrounds/ending_stage.jpg" alt="二周年舞台完整结局"><div class="stage-overlay"><div class="stage-panel"><div class="ending-badge">DIRECTOR CUT · UNUSED SUBTITLES 30 / 30</div><h2>答案会忘，坐标不会。</h2><div class="ending-lines">${D.stageText.director.map(x=>`<p>${esc(x)}</p>`).join('')}</div><div class="input-row" style="justify-content:center;margin-top:14px"><button id="backScenes" class="secondary">返回十局</button><button id="map" class="ghost">场景回看</button></div></div></div></section>`; document.getElementById('backScenes').onclick=()=>renderScene(state.currentScene);document.getElementById('map').onclick=openSceneMap;
  }

  // Keep BGM preference and start app.
  bgm.volume=state.bgm.volume;
  // 浏览器刷新后不能无手势自动播放：若玩家此前保存为开启，则在下一次真实点击时恢复。
  if(state.bgm.enabled){ document.addEventListener('pointerdown',()=>{ bgm.volume=state.bgm.volume; bgm.play().catch(()=>{}); },{once:true}); }
  render();
})();
