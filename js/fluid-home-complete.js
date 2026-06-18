/* Extracted from index-complete.html during round370-181103-readable-practice-20260616. Keep this file as the home workbench runtime bundle. */
/* ============ 主题 ============ */
(function(){
const K='fm_theme';
function ap(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem(K,t)}catch(e){}}
const s=(()=>{try{return localStorage.getItem(K)}catch(e){return null}})()||((window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light');
ap(s);
document.addEventListener('DOMContentLoaded',()=>{
  const b=document.getElementById('themeT');
  if(!b)return;
  b.addEventListener('click',()=>{const c=document.documentElement.getAttribute('data-theme');ap(c==='dark'?'light':'dark')});
});
})();

/* ============ 页面业务 ============ */
(function(){
function fd(ms){const m=Math.round((ms||0)/60000);if(m<1)return '< 1 分';if(m<60)return m+' 分钟';const h=m/60;return (h<10?h.toFixed(1):Math.round(h))+' 小时';}

function ab(){
  const e=document.getElementById('authAlert');
  const p=new URLSearchParams(location.search);
  const a=p.get('auth');
  if(!a||!e)return;
  const msg={
    required:'此页面需要登录访问。登录后会自动跳回你刚才想去的位置。',
    teacher_required:'当前账号没有教师端权限。学生端学习入口已在下方保留，可继续进入题库、知识点或章节顺序。',
    locked:'账号当前暂时不可用或已被锁定。请联系老师确认权限；登录后会回到原页面。',
    account_locked:'账号当前暂时不可用或已被锁定。请联系老师确认权限；登录后会回到原页面。',
    disabled:'账号当前不可用。请联系老师确认权限；登录后会回到原页面。',
    storage_verify_failed:'浏览器未能保存登录状态。请允许本站本地存储后重试。'
  };
  e.dataset.authState=a;
  e.textContent=msg[a]||'登录后即可继续。';
  e.hidden=false;
}

function peekNextTarget(){
  const clean=t=>{
    if(!t)return '';
    try{
      const u=new URL(t,location.origin);
      if(u.origin!==location.origin)return '';
      const p=u.pathname.toLowerCase();
      if(/^\/(?:_edge-login|_edge-fast-login|_edge-register|_edge-forgot-password|_edge-reset|_edge-logout)(?:\/|$)/i.test(p))return '';
      if((p==='/'||p==='/index-complete'||p==='/index-complete.html')&&u.searchParams.has('auth'))return '';
      return u.pathname+u.search+u.hash;
    }catch(_){return ''}
  };
  try{
    const q=new URLSearchParams(location.search).get('next');
    return clean(q)||clean(sessionStorage.getItem('fm_auth_redirect'))||clean(localStorage.getItem('fm_next_target'));
  }catch(_){return ''}
}

function nextTargetLabel(t){
  if(!t)return '';
  try{
    const u=new URL(t,location.origin);
    const p=u.pathname;
    if(p.includes('knowledge-detail'))return '知识点全集';
    if(p.includes('real-exams'))return '历年真题';
    if(p.includes('practice'))return '做题练习';
    if(p.includes('resources'))return '视频与讲义';
    if(p.includes('question-bank'))return '题库';
    return p==='/index-complete.html'||p==='/'?'首页':p;
  }catch(_){return ''}
}

function setLoginStatus(state,msg){
  const e=document.getElementById('loginStatus');
  if(!e)return;
  e.dataset.state=state||'idle';
  e.textContent=msg||'等待输入账户';
}

function setLoginInvalid(on){
  ['uname','pwd'].forEach(id=>{
    const e=document.getElementById(id);
    if(e)e.setAttribute('aria-invalid',on?'true':'false');
  });
}

function setLoginBusy(on,msg){
  const f=document.getElementById('loginForm');
  const b=document.getElementById('loginBtn');
  if(f)f.setAttribute('aria-busy',on?'true':'false');
  if(b){
    b.disabled=!!on;
    b.setAttribute('aria-busy',on?'true':'false');
    b.innerHTML=on
      ? '<span class="login-spinner" aria-hidden="true"></span> '+(msg||'正在验证...')
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> 登录进入学习';
  }
}

function rw(){
  const w=document.getElementById('rateW'),b=document.getElementById('loginBtn');
  if(!w||!b)return;
  if(FMSecurity.isLocked()){
    const m=Math.ceil(FMSecurity.lockoutRemaining()/60000);
    w.hidden=false;w.textContent='登录尝试过多，请在 '+m+' 分钟后重试。';b.disabled=true;
    setLoginStatus('error','登录已临时锁定，请稍后再试');
  }else{w.hidden=true;b.disabled=false}
}

function dash(u){
  document.getElementById('vGuest').hidden=true;
  document.getElementById('vAuthed').hidden=false;
  document.getElementById('gName').textContent=u.name||'同学';
  // 顶栏用户头像
  const ini=(u.name||'?').slice(0,1).toUpperCase();
  const pill=document.getElementById('userPill');
  if(pill){
    pill.hidden=false;
    document.getElementById('userPillName').textContent=u.name||u.username||'账户';
    document.getElementById('userPillAva').textContent=ini;
  }
  // 账户菜单填充
  const accAva=document.getElementById('accAva');if(accAva)accAva.textContent=ini;
  const accName=document.getElementById('accName');if(accName)accName.textContent=u.name||'同学';
  const accUser=document.getElementById('accUser');if(accUser)accUser.textContent='@'+(u.username||'visitor')+(u.role==='teacher'?' · 教师':' · 学生');
  const accT=document.getElementById('accTeacher');
  if(accT){
    if(u.role==='teacher'){accT.hidden=false}
    else{accT.hidden=true}
  }
  try{
    const a=FMAnalytics.aggregateByUser();
    const me=a[u.username]||a[u.name];
    if(me){
      document.getElementById('sV').textContent=me.visits||0;
      document.getElementById('sD').textContent=fd(me.totalDuration);
      document.getElementById('sA').textContent=me.avgScore!=null?(me.avgScore+' 分'):'—';
    }else{
      document.getElementById('sV').textContent='首次';
      document.getElementById('sD').textContent='刚开始';
      document.getElementById('sA').textContent='—';
    }
  }catch(e){}
  setTimeout(()=>{if(window.FMArmMathJax)window.FMArmMathJax()},120);
  loadUpd();
}

function guest(){
  document.getElementById('vAuthed').hidden=true;
  document.getElementById('vGuest').hidden=false;
  const label=nextTargetLabel(peekNextTarget());
  setLoginStatus('idle',label?'登录后返回：'+label:'等待输入账户');
  setLoginInvalid(false);
  setLoginBusy(false);
  rw();
}

const fmFrontJSON=(()=>{
  const inflight=new Map();
  const retryable=e=>!e||!e.status||e.status===408||e.status===429||e.status>=500;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function req(url,opt,attempt){
    const timeoutMs=opt.timeoutMs||5500;
    const ctrl=window.AbortController?new AbortController():null;
    const init={credentials:'same-origin',cache:opt.cache||'default',headers:{Accept:'application/json'}};
    let timer=null;
    if(ctrl){init.signal=ctrl.signal;timer=setTimeout(()=>ctrl.abort(),timeoutMs)}
    return fetch(url,init).then(r=>{
      if(timer)clearTimeout(timer);
      if(!r.ok){const e=new Error('HTTP '+r.status);e.status=r.status;throw e}
      return r.json();
    },e=>{
      if(timer)clearTimeout(timer);
      throw e;
    }).catch(e=>{
      const retries=opt.retries==null?1:opt.retries;
      if(attempt<retries&&retryable(e))return wait(160*(attempt+1)).then(()=>req(url,opt,attempt+1));
      throw e;
    });
  }
  return (url,opt={})=>{
    const key=(opt.key||url)+'|'+(opt.cache||'default');
    if(inflight.has(key))return inflight.get(key);
    const p=req(url,opt,0).catch(()=>null).finally(()=>inflight.delete(key));
    inflight.set(key,p);
    return p;
  };
})();
window.fmFrontJSON=fmFrontJSON;

async function loadUpd(){
  const l=document.getElementById('upsL');
  if(l){l.setAttribute('role','status');l.setAttribute('aria-live','polite');l.setAttribute('aria-busy','true')}
  const fb=[
    {time:'2026-05-11 23:40',title:'74 段自制动画删除画面内场景公式',summary:'所有动画画面里的场景公式卡已经移除，不再遮挡流线、边界和标注；公式统一留在下方核心公式区继续 MathJax 渲染。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 15:24',title:'74 段自制动画课继续精修基础描述方法',summary:'数量不变，集中把刚补的欧拉-拉格朗日映射、迹线方程、速度势与流函数、固壁边界条件四个场景做得更清楚：画面里把固定探针、物质线、迹线初值和固壁边界区分开来，下方核心公式继续渲染。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 14:26',title:'74 段自制动画课补入基础描述方法',summary:'按知识点缺口新增 4 段精讲动画：欧拉-拉格朗日映射、迹线方程、速度势与流函数、固壁边界条件。每段都直接进入动画画面，保留下方核心公式和看图核对。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 13:54',title:'70 段自制动画的公式排版曾做精修',summary:'数量不变，集中把刚补的旋转坐标系、圆柱坐标连续方程、小孔出流、非定常 Bernoulli、Rankine 半体和 Taylor-Couette 六段公式曾做分行排版；现在画面内公式层已删除，底部仍保留完整公式。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 13:29',title:'70 段自制流体力学动画课继续补知识点覆盖',summary:'按知识点缺口新增 6 段精讲动画：旋转坐标系与科氏加速度、圆柱坐标连续方程、小孔出流、非定常 Bernoulli、Rankine 半体和 Taylor-Couette 流。每段都直接进入动画画面，保留下方核心公式和看图核对。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 11:32',title:'60 段自制流体力学动画课新增场景精修',summary:'数量保持 60 段，集中精修刚补上的六个缺口：连续介质改为 REV 平台口径，物质导数拆出 local/convective，应力张量补 σ=-pI 特例，镜像法补 vn=0，Stokes 第一问题补壁面剪切，线性波补重力-毛细波频散式。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 11:10',title:'自制流体力学动画课补齐六个高价值缺口',summary:'按知识点全集缺口补齐 6 段精讲动画，总数到 60 段：连续介质尺度窗、物质导数、Cauchy 应力张量、镜像法与圆定理、Stokes 第一问题和线性重力波频散。每段都补了公式、边界条件、读图核对和知识点入口。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 02:43',title:'54 段自制流体力学动画课基础场景精修',summary:'数量仍保持 54 段，集中精修静水压强、圆管 Poiseuille、毛细升降、源汇流、涡量环量、兰金组合涡和自由涡压强：补出压力中心、dp/dx、umax=2Umean、Q∝R⁴、接触角、源强通量、Stokes 面积分、Γ=2πΩa² 和 dp/dr>0。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 02:07',title:'54 段自制流体力学动画课二次精修',summary:'数量仍保持 54 段，集中精修皮托/文丘里、浅水波、局部损失、边界层、分离、Moody 摩阻、动量积分和湍流对数律：补出取压口、静压/总压区别、kh<<1、能量线跌落、τw 变号、Darcy fD 和 y+ 分区。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 01:48',title:'54 段自制流体力学动画课精修',summary:'不新增数量，集中打磨现有 54 段：画布标注加浅底标签和物理标签，粒子与箭头更清楚；Rossby、Ekman、内波、斜压生涡、水力控制和雷诺应力六段重画关键力、边界条件和判据。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 01:20',title:'资源中心扩展 54 段自制流体力学动画课',summary:'自制动画课从 48 段扩为 54 段，新增 Rossby 数与地转平衡、Ekman 螺旋、分层内波、斜压生涡、水力控制和雷诺应力；继续逐段保留公式、图像、看图核对和章节入口。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 00:36',title:'资源中心扩展 48 段自制流体力学动画课',summary:'自制动画课从 42 段扩为 48 段，新增自由涡压强分布、Kelvin 环量定理、边界层动量积分、湍流对数律、缓变水面线和面积-Mach 关系；同时把皮托管改清楚为内管取总压、外管侧孔取静压，和文丘里收缩管分开。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-11 00:20',title:'资源中心扩展 42 段自制流体力学动画课',summary:'自制动画课从 36 段扩为 42 段，新增浮力与稳性、旋转液体自由面、Couette-Poiseuille 叠加、Stokes 阻力、水击压力波和 Buckingham π 量纲分析；继续逐段核对公式、图像和章节入口。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 23:48',title:'资源中心扩展 36 段自制流体力学动画课',summary:'自制动画课从 30 段扩为 36 段，新增雷诺输运定理、Navier-Stokes 项平衡、涡量拉伸、喷管阻塞、液滴拉普拉斯压差和泵-管路工作点；公式审计新增禁止 raw < >。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 23:02',title:'资源中心扩展 30 段自制流体力学动画课',summary:'自制动画课从 24 段扩为 30 段，新增连续方程、欧拉方程、流体微团运动分解、边界层分离、空化和 Moody 摩阻；继续保持公式、图像和核对项对应。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 22:33',title:'资源中心扩展 24 段自制流体力学动画课',summary:'自制动画课从 18 段扩为 24 段，新增控制体动量、相似准则、绕圆柱势流、管路局部损失、明渠临界流和剪切层失稳；每段都有公式、看图核对和对应入口。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 22:13',title:'资源中心扩展 18 段自制流体力学动画课',summary:'自制动画课从 12 段扩为 18 段，新增皮托管与压差计、毛细上升、源汇流、兰金组合涡、旋转圆柱马格努斯力和正激波；继续保留公式、看图核对和章节入口。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 21:51',title:'资源中心扩展 12 段自制流体力学动画课',summary:'自制动画课从 6 段扩为 12 段，新增静水压强、圆管层流、流线/迹线/脉线、涡量与环量、浅水波和水跃；每段保留公式、看图核对和章节入口。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 20:37',title:'资源中心新增自制流体力学动画课',summary:'参考前一轮筛选视频的选题方向，新增 6 段本站自制交互动画：伯努利管、黏性剪切、层流转湍流、卡门涡街、平板边界层和机翼升力；画面、文字、公式和交互均为本站自制。',links:[{label:'自制动画课',url:'/resources/fluid-original-animations.html'},{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 20:21',title:'资源中心接入B站流体力学动画精选',summary:'资源中心新增 11 个 B 站原站播放器入口，优先选动画、实验可视化和仿真：王洪伟基础课、MIT/NSF 经典影像、黏度、伯努利、层流湍流、卡门涡街和机翼绕流。',links:[{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'}]},
    {time:'2026-05-10 20:04',title:'流体力学集训补入完整答案展开',summary:'答案核对卡新增完整答案与解析展开区；默认保留答案摘录，展开后可查看分年真题数据中的完整答案、完整解析和公式核对。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 19:53',title:'流体力学集训补入答案核对队列',summary:'集训页新增“答案核对”：从分年真题数据读取真实答案和解析，按已核验章节映射接到真题起笔卡后，逐题显示答案摘录、解析、公式核对和原题入口。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-10 19:43',title:'流体力学集训补入真题起笔队列',summary:'集训页新增“真题起笔”：从 176 道已核验真题中按章节映射和题面信号匹配第一行方程，逐题给出先写方程、核对项和原题入口。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-10 19:33',title:'流体力学集训补入第一行方程队列',summary:'集训页新增“第一行方程”：每章按题面信号列出先写方程、核对项和已核验真题入口，公式仍走 MathJax 渲染。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-10 19:23',title:'流体力学集训补入核心公式适用核对',summary:'集训页新增 36 张核心公式适用核对卡，每章列公式、适用条件、误区、对应真题和知识点入口；公式默写区同名片段会合并显示。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-10 19:02',title:'流体力学集训补入小节练习队列',summary:'集训页继续细化到小节层：每章按小节列出公式核对、代表真题、作答核对和知识点入口，题目仍按已核验真题章节映射筛选。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-10 17:12',title:'新增流体力学集训入口',summary:'新增集训工作台：章节日程、公式默写、错因核对、题型专项、对应真题和两本教材入口放在同一页；题目队列按 176 道核验真题的章节映射筛选。',links:[{label:'流体力学集训',url:'/modules/fluid-intensive-training.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-10 16:46',title:'两本教材所有小节改为本节公式块',summary:'吴望一教材页 112/112 个小节、王洪伟教材页 120/120 个小节现在都有本节公式块；章级公式参照为 0，发布门禁会拦截任何回退。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 16:13',title:'两本教材页公式锚点改为本节直连',summary:'吴望一教材页 100 个带原书式号的小节、王洪伟教材页 53 个带原书式号的小节，现在全部为本节直接公式核对；本章公式参照降为 0，并新增裸公式命令残留审计。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 15:48',title:'两本教材页式号与公式对应加严',summary:'吴望一教材页 100 个带原书式号的小节、王洪伟教材页 53 个带原书式号的小节，公式块现在全部显示对应式号，并区分本节直接核对与本章公式参照。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-10 13:30',title:'知识点全库教材卡补齐式号公式',summary:'197 张生成教材卡中，152 张带原书式号；这 152 张现在全部带章节公式名称和 MathJax 公式，并新增发布门禁检查有式号缺公式、公式错配和包装化词。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'教材入口',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-10 04:01',title:'知识点全库教材卡补入原书页码式号',summary:'知识点全库的教材对应卡现在展示 OCR 页码、原书式号和图表编号；197 张生成教材卡全部有 OCR 页码，其中 152 张有式号、155 张有图表编号。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'}]},
    {time:'2026-05-10 03:35',title:'两本教材新增章节式号与图表索引',summary:'吴望一与王洪伟两本 HTML 教材整理稿每章顶部新增原书式号与图表索引，按小节列出 OCR 页码、式号和图表编号；王洪伟图1-1这类连字符图号也已识别。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 22:26',title:'两本教材页补入原书式号和图表线索',summary:'吴望一与王洪伟两本 HTML 教材整理稿继续按原书结构收口：每个小节保留 OCR 页码范围，并补入原书式号、图表编号和页内术语；知识点全库教材区块改为中性教材对应口径。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 21:57',title:'两本教材整理稿和知识全库继续收口',summary:'吴望一与王洪伟两本 HTML 书改为章节、小节、公式、推导、适用条件和页码线索为主；知识点全库教材补充更新为 88 个知识点、221 张卡，并收紧连续方程、自由面波动、Kelvin 定理等小节归属。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 17:10',title:'两本教材继续补充并写入知识点全库',summary:'吴望一和王洪伟两本HTML 教材整理稿继续补入小节材料，每个小节新增“小节材料”的物理图像、推导路线、例题线索和对应题型核对；知识点全库教材补充也扩为 59 个知识点、170 张卡，并跳到具体教材小节。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 16:20',title:'两本教材教材整理稿继续补充内容层',summary:'继续补充吴望一第二版和王洪伟两本HTML 教材整理稿：232 个小节全部新增问题对象、使用边界、相关题型、误区核对和本章核对任务，直接入口仍然落到实际书正文。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 14:50',title:'两本教材入口直达章节版网页 HTML 书',summary:'教材入口不再落到本机 PDF 对照页；吴望一和王洪伟两本网页 HTML 书已整理为全书覆盖、章节路线、逐小节连续正文、推导说明、真题线索和公式链。',links:[{label:'吴望一章节版',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟章节版',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 13:23',title:'两本教材改为HTML 教材整理稿',summary:'吴望一第二版和王洪伟《我所理解的流体力学》已生成整理 HTML 书，教材入口默认可直接网页阅读；本机原扫描 PDF 只保留为个人可选对照，不进入公开部署包。',links:[{label:'吴望一教材整理稿',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟教材整理稿',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 05:21',title:'两本教材完成 916 页从头到尾对照',summary:'吴望一《流体力学（第二版）》617 页和王洪伟《我所理解的流体力学》299 页已完成 916 页逐页 OCR 对照；网站教材线增至 232 个小节卡、60 条推导卡、120 组公式卡，知识点全库教材补充扩到 57 个知识点、163 张卡。',links:[{label:'吴望一第二版',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟现象分析',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-09 04:15',title:'两本流体力学教材入口与知识库补充上线',summary:'吴望一《流体力学（第二版）》617 页全册升级为 10 章章节整理；王洪伟《我所理解的流体力学》新增现象入口；知识点全库首轮加入 24 条教材补充。',links:[{label:'吴望一第二版',url:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html'},{label:'王洪伟现象分析',url:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-07 05:14',title:'知识点全库公式源与渲染继续收口',summary:'修正自由面与波动、边界层量级估计、2012 平面流动题等知识页的 OCR 拆公式和裸 psi/phi；全库 202 张知识卡、4311 个 MathJax 容器扫描错误和拆行残片均为 0。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-07 03:41',title:'分类题库镜像改为已核验真题自动生成',summary:'15 个分类练习 JSON 统一由 176 道已核验分年真题生成，分类镜像 957 条；旧 ocean-2022-137 碎片、generic 占位和缺题面镜像均为 0。',links:[{label:'分类练习',url:'/modules/practice-dynamic.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-07 01:02',title:'真题与知识点跳转按扫描源完成整轮对齐',summary:'重核 2000、2011、2022、2023 等遗留年份，分年真题收口为 176 道已核验真题；知识点全库 954 道强相关跳转低相关为 0，公式扫描错误和拆行残片均为 0。',links:[{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 20:05',title:'2010 第五题与知识点全库公式源同步修复',summary:'恢复 2010 年第五题真实三维速度场题；把 P78、P82、P114 的边界层与源汇叠加公式从复校源同步回网站，知识点全库 202 页 MathJax 扫描错误和拆行残片均为 0。',links:[{label:'2010 真题',url:'/modules/real-exams-dynamic.html?year=2010'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 18:11',title:'2003 年真题按扫描题面核验为 7 道整题',summary:'把 2003 年旧候选跳号碎片收口为扫描对应的 7 道整题，修正等压线题、压差计流量公式和复势 F(z)=-(m/2π)ln(z-1/z) 的源汇净流量口径，并重建知识点强相关真题跳转。',links:[{label:'2003 真题',url:'/modules/real-exams-dynamic.html?year=2003'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 16:37',title:'2002 年真题按扫描题面核验为 8 道整题',summary:'把 2002 年旧候选 14 条碎片收口为扫描对应的 8 道整题，修正自由涡、旋涡拉伸、速度势压力、两层 Poiseuille 与边界层/Bernoulli 综合题，并清掉知识点全库里的旧题号跳转。',links:[{label:'2002 真题',url:'/modules/real-exams-dynamic.html?year=2002'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 15:36',title:'2001 年真题按扫描题面核验为 8 道整题',summary:'按 mac_2T 当前真题 Word 与扫描源索引重核 2001 年分年包，修正第 3 题“流速与半径成反比”的自由涡答案，并让旧候选误读退出用户侧口径。',links:[{label:'2001 真题',url:'/modules/real-exams-dynamic.html?year=2001'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 15:00',title:'2004 年真题补为 6 道已核验整题',summary:'按 mac_2T 当前真题 Word 与扫描源索引，把 2004 年填空、名词解释、基本方程、小孔自由射流、流函数涡量方程和运动边界题整理成 6 道整题，并重建知识点强相关真题跳转。',links:[{label:'2004 真题',url:'/modules/real-exams-dynamic.html?year=2004'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 14:25',title:'2006 年真题补为 7 道已核验整题',summary:'按 mac_2T 当前真题 Word 与扫描源索引，把 2006 年选择题、点源、旋转圆柱耗散、肥皂泡、运动边界、点涡镜像和 Couette 流整理成 7 道整题，旧碎片退出知识点跳转。',links:[{label:'2006 真题',url:'/modules/real-exams-dynamic.html?year=2006'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 13:55',title:'2005 年真题补为 8 道已核验整题',summary:'按 mac_2T 当前真题 Word 同步 2005 年源题面，把收缩管、二维速度场、明渠连续方程、小孔出流、点源势流、两层 Couette 流和边界层/Reynolds 应力题补成已核验整题，并重建知识点强相关真题跳转。',links:[{label:'2005 真题',url:'/modules/real-exams-dynamic.html?year=2005'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 12:35',title:'2007 年真题补为 8 道已核验整题',summary:'把 2007 年扫描题面从旧碎片整理成 8 道整题，修正选择题、收缩管、非定常流线轨迹、文托利、Couette 和点源镜像题，并重建知识点强相关真题跳转。',links:[{label:'2007 真题',url:'/modules/real-exams-dynamic.html?year=2007'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 11:45',title:'2008 年真题补为 4 道已核验整题',summary:'把 2008 年扫描题面 4 个大题与笔记第 6、41、63、69-70、145、147 页及基础知识页逐题对齐，修正连续方程、扫描速度场和容器图示题错接，并重建知识点强相关真题跳转。',links:[{label:'2008 真题',url:'/modules/real-exams-dynamic.html?year=2008'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 09:30',title:'2009 年真题补为 8 道已核验整题',summary:'把 2009 年扫描题面 8 个大题与笔记第 4、8-9、57、69-70 页及基础知识页逐题对齐，补回 Helmholtz 分解题，修正点汇复势和等温理想气体圆锥管速度关系，并重建知识点强相关真题跳转。',links:[{label:'2009 真题',url:'/modules/real-exams-dynamic.html?year=2009'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 09:09',title:'2010 年真题补为 6 道已核验整题',summary:'把 2010 年扫描题面 6 个大题与笔记第 96-98 页及基础知识页逐题对齐，修正旧包里的非定常轨迹、单摆量纲和三维涡量题 OCR 残留，并重建知识点强相关真题跳转。',links:[{label:'2010 真题',url:'/modules/real-exams-dynamic.html?year=2010'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 08:52',title:'2012 年真题补为 7 道已核验整题',summary:'把 2012 年扫描题面 7 个大题与笔记第 91-93 页、Couette 基础页逐题对齐，修正平面流 OCR 残缺和运动边界平方项口径，并重建知识点强相关真题跳转。',links:[{label:'2012 真题',url:'/modules/real-exams-dynamic.html?year=2012'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 08:35',title:'2013 年真题补为 8 道已核验整题',summary:'把 2013 年扫描题面 8 个大题与笔记第 94-95 页及基础知识页逐题对齐，修正等压线题 OCR 差异，并重建知识点强相关真题跳转。',links:[{label:'2013 真题',url:'/modules/real-exams-dynamic.html?year=2013'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 08:10',title:'2014 年真题补为 6 道已核验整题',summary:'把 2014 年扫描题面 6 个大题与笔记第 96-99 页答案线索对齐，剔除附录误入题库、点涡 OCR 和同轴管层流旧错解，并重建知识点强相关真题跳转。',links:[{label:'2014 真题',url:'/modules/real-exams-dynamic.html?year=2014'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 07:40',title:'2015 年真题补为 5 道已核验整题',summary:'把 2015 年扫描题面 5 个大题与笔记第 100-103 页答案线索对齐，清掉旧候选题号和旧坐标残留，并重建知识点强相关真题跳转。',links:[{label:'2015 真题',url:'/modules/real-exams-dynamic.html?year=2015'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 07:10',title:'2016 年真题补为 9 道已核验整题',summary:'把 2016 年扫描题面 9 个大题与笔记第 104-107 页答案线索对齐，旧碎片题退场，并为 Froude 相似、流动分离和 Stokes 第一问题补准公式支撑。',links:[{label:'2016 真题',url:'/modules/real-exams-dynamic.html?year=2016'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 06:28',title:'2018 年真题补为 6 道已核验整题',summary:'把 2018 年扫描题面 6 个大题与笔记第 108-109 页答案线索对齐，并补强知识点全库 psi、vec、boldsymbol 等公式渲染。',links:[{label:'历年真题',url:'/modules/real-exams-dynamic.html?year=2018'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 06:12',title:'2019 年真题补为 5 道已核验整题',summary:'把 2019 年扫描题面 5 个大题与笔记第 110-111 页答案对齐，知识点跳转和分年真题包同步重建。',links:[{label:'历年真题',url:'/modules/real-exams-dynamic.html?year=2019'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 04:53',title:'真题源链改为已核验分年包',summary:'公开真题数据口径改为 real-exams-index 已核验索引与 real-exam-years 分年练习包；知识点跳转继续只保留强相关真题。',links:[{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 04:30',title:'笔记 Word 下载资源换成当前最新版',summary:'资源中心的 fluid-notes-current.docx 已换成逐页校录精修公式版当前最新版；构建器改为 mac_2T 优先、仓库资源兜底。',links:[{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 03:56',title:'真题路径与练习页再核验',summary:'真题列表和练习页已确认优先加载 real-exam-years 分年核验题；2024 复势公式题在练习页 MathJax 渲染正常，未加载旧候选兜底。',links:[{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'做题练习',url:'/modules/practice-dynamic.html?type=real&year=2024&q=ocean-2024-09'},{label:'知识点全集',url:'/modules/knowledge-detail.html'}]},
    {time:'2026-05-06 03:35',title:'知识点可见斜杠与嵌套分式继续收口',summary:'目录和卡片里的中文分隔斜杠改成分号；外层括号中的 (∂A)/(∂x) 这类嵌套分式也会递归转成 MathJax 分式。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'更新记录',url:'/site-updates.json'}]},
    {time:'2026-05-06 03:15',title:'知识点公式与真题链路按最终口径收口',summary:'继续修复 ψ、括号分式、导数斜杠和公式拆行问题；知识点真题链接收口为 110 道已核对真题、786 条强相关链接。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'},{label:'题库练习',url:'/modules/practice-dynamic.html?type=real'}]},
    {time:'2026-05-05 19:37',title:'修复知识点全库公式渲染',summary:'把知识点全库的数学公式入口统一做了 TeX 归一化；全库 202 张卡、3622 个公式容器严格扫描通过，MathJax 错误为 0。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'首页更新',url:'/site-updates.json'}]},
    {time:'2026-05-05 03:48',title:'边缘极速首页改成 round117 新口径并强制刷新',summary:'把 Cloudflare 边缘极速首页改成 round117 最新统计，并让 lghui.top 的公开跳转壳自动带刷新参数，避免继续命中旧缓存页面。',links:[{label:'极速首页',url:'/index-complete'},{label:'资源中心',url:'/resources.html'}]},
    {time:'2026-05-05 03:45',title:'题库首页主库数修正为 285 题',summary:'把 question-bank-home.html 的 289 题展示数收口为 285 题，与当前可练真题口径和站内统计保持一致。',links:[{label:'题库首页',url:'/question-bank-home.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-05 03:30',title:'资源中心置顶 round117 笔记与真题资料',summary:'把 round117 笔记 Markdown、精修公式版 DOCX 和 2000-2024 真题精修版在资源中心优先展示，并补上 round117 与 2000-2024 可搜索标签。',links:[{label:'资源中心',url:'/resources.html'},{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-05-05',title:'round117 笔记与真题正式同步到网站首页',summary:'把 round117 精修笔记 Markdown、精修公式版 DOCX 和 2000-2024 真题精修版统一写进站内学习索引，首页、知识点页和真题页的入口与统计已对齐。',links:[{label:'知识点全集',url:'/modules/knowledge-detail.html'},{label:'历年真题',url:'/modules/real-exams-dynamic.html'}]},
    {time:'2026-03-30 22:05',title:'2021 真题第 40–41 页与势流/粘性知识页已同步',summary:'首页只保留真正有更新的任务卡片，集中展示 2021 真题、复势积分、平板压差流。',links:[{label:'历年真题页',url:'/modules/real-exams-dynamic.html'},{label:'势流知识页',url:'/modules/potential-flow-dynamic.html'}]},
    {time:'2026-03-30 晚间',title:'2019–2020 真题链条与 Couette、驻点流模块补强',summary:'把 2019–2020 多道真题落回网站，包括圆周 Couette 流、V 形管振荡、点源、点涡、偶极子。',links:[{label:'真题页',url:'/modules/real-exams-dynamic.html'},{label:'流体动力学页',url:'/modules/fluid-dynamics-dynamic.html'}]}
  ];
  try{
    const d=await fmFrontJSON('/site-updates.json?ts='+Date.now(),{cache:'no-cache',key:'/site-updates.json',timeoutMs:4500,retries:1});
    if(!d)throw 0;
    const raw=(Array.isArray(d)?d:d.updates||[])
      .filter(x=>x&&x.active!==false)
      .sort((a,b)=>uTs(b)-uTs(a))
      .slice(0,3);
    const its=raw.map(nUpd).filter(Boolean);
    rUpd(its.length?its:fb);
  }catch(e){rUpd(fb)}
  finally{if(l)l.setAttribute('aria-busy','false')}
}

function uTs(it){
  if(!it)return 0;
  const v=it.updatedAt??it.timestamp??it.time??it.date;
  if(typeof v==='number')return v<1e12?v*1000:v;
  if(typeof v==='string'){
    const t=Date.parse(v.replace(/\./g,'-'));
    return Number.isFinite(t)?t:0;
  }
  return 0;
}

function nUpd(it){
  if(!it)return null;
  const rawLinks=[];
  if(Array.isArray(it.links))rawLinks.push(...it.links);
  else if(it.link||it.url)rawLinks.push({label:it.linkLabel||'查看更新',url:it.link||it.url});
  const rawTitle=(it.title||it.name||it.task||it.action||'').trim();
  const detailSummary=Array.isArray(it.details)
    ? it.details.filter(Boolean).join('；').trim()
    : (typeof it.details==='string'?it.details.trim():'');
  const rawSummary=(it.summary||it.description||it.note||it.validation||detailSummary).trim();
  const rawContent=(it.content||'').trim();
  const hasOnlyContent=!rawTitle&&!rawSummary&&rawContent;
  const parsed=hasOnlyContent?pUpdContent(rawContent,it.category):null;
  const parsedFromTitle=!hasOnlyContent&&rawTitle?pUpdContent(rawTitle,it.category):null;
  const useParsedTitle=!!(parsedFromTitle&&(parsedFromTitle.qid||parsedFromTitle.src)&&/^(收口|补齐|修正|重写|精修|校顺|规范|同步)/.test(rawTitle));
  const normalized=parsed||(useParsedTitle?parsedFromTitle:null);
  const title=hasOnlyContent
    ? ((normalized&&normalized.title)||it.category||'网站更新')
    : (useParsedTitle?normalized.title:(rawTitle||it.category||'网站更新'));
  const summary=rawSummary||((normalized&&normalized.summary)||rawContent)||title;
  const links=nUpdLinks(rawLinks,it,normalized,title,summary);
  if(!links.length&&summary)links.push({label:'更新记录',url:'/site-updates.json'});
  return {
    time:it.time||it.date||it.updatedAt||it.timestamp||'',
    title,
    summary,
    links
  };
}

function pUpdContent(content,category){
  const txt=(content||'').trim();
  if(!txt)return null;
  const rawSrc=(txt.match(/《([^》]+)》/)||txt.match(/question-banks\/([^\s，。]+)/)||txt.match(/在\s*((?:final_[A-Za-z0-9_-]+|分类_[^\s，。]+?))\s*(?:题库|镜像)?中/)||txt.match(/(分类_[^\s，。]+)/)||[])[1]||'';
  const qid=(txt.match(/\bocean-\d{4}-\d{2}\b/i)||[])[0]||'';
  const src=(rawSrc||'')
    .replace(/\.json$/,'')
    .replace(/^final_perfect$/,'真题题库')
    .replace(/_perfect$/,'')
    .replace(/_cleaned$/,'');
  const title=[src||category||'网站更新',qid].filter(Boolean).join(' · ');
  const summary=txt
    .replace(/^收口(?:同步)?/,'')
    .replace(/^补齐/,'补齐')
    .replace(/^重写/,'重写')
    .replace(/^修正/,'修正')
    .replace(/^精修/,'精修')
    .replace(/^校顺/,'校顺')
    .replace(/^规范/,'规范')
    .replace(/^同步/,'同步')
    .replace(new RegExp(`^${qid}[，、:\s]*`,'i'),'')
    .replace(/^在(?:final_[^\s，。]+|分类_[^\s，。]+)\S*?中/,'')
    .replace(/^\s*[《"]?[^》"\s]+[》"]?\s*/,'')
    .replace(/^中\s*/,'')
    .replace(/^analysis[，、；：:\s]*/i,'')
    .replace(/^[并且]\s*/,'')
    .replace(/^[，、；：:。\s-]+/,'')
    .trim();
  return {title:title||category||'网站更新',summary:summary||txt,src,qid};
}

function iUpdLinks(it,parsed,title,summary){
  const detailPath=it&&it.details&&typeof it.details==='object'&&!Array.isArray(it.details)?(it.details.path||it.details.file||''):'';
  const detailFocus=it&&it.details&&typeof it.details==='object'&&!Array.isArray(it.details)?(it.details.focus||''):'';
  const hint=[
    it&&it.category,
    title,
    summary,
    it&&it.url,
    it&&it.link,
    parsed&&parsed.src,
    parsed&&parsed.qid,
    detailPath,
    detailFocus
  ].filter(Boolean).join(' ');
  if(/旧题库页|题库首页|题库分组页|固定版题库分组页|收藏题库|question-bank-home(?:-fixed)?(?:\.html)?|question-bank-data\.js|question-bank-user\.js|(?:https?:\/\/lghui\.top)?\/?(?:\.\/)?modules\/(?:question-bank|question-bank-module(?:-fixed)?)(?:\.html)?|(?:https?:\/\/lghui\.top)?\/?(?:\.\/)?question-bank(?:\.html)?/i.test(hint))return [{label:'查看旧题库页',url:'/modules/question-bank.html'}];
  if(/分类_[^\s，。]+|分类题库|分类练习|分类页|practice-dynamic/i.test(hint))return [{label:'查看分类练习',url:'/modules/practice-dynamic.html'}];
  if(/question-banks|ocean-\d{4}-\d{2}|真题|题库精修|final_perfect|_perfect|real-exams-dynamic/i.test(hint))return [{label:'查看真题页',url:'/modules/real-exams-dynamic.html'}];
  if(/首页|recent updates/i.test(hint))return [{label:'查看首页',url:'/index-complete.html'}];
  return [];
}

function nUpdLinks(rawLinks,it,parsed,title,summary){
  const inferred=iUpdLinks(it,parsed,title,summary);
  const links=rawLinks.map(x=>typeof x==='string'?{label:'查看更新',url:x}:x).filter(x=>x&&x.url);
  if(!links.length)return inferred;
  return links.map(link=>{
    const generic=!link.label||link.label==='查看更新';
    const jsonLike=/\/site-updates\.json(?:$|[?#])|\/question-banks\//i.test(link.url||'');
    if(generic&&jsonLike&&inferred.length)return {...inferred[0]};
    if(generic&&/^\/?(?:index(?:-complete)?\.html)?(?:[?#].*)?$/i.test(link.url||''))return {label:'查看首页',url:'/index-complete.html'};
    if(generic&&/^(?:https?:\/\/lghui\.top)?\/?(?:\.\/)?(?:(?:modules\/)?question-bank(?:-module(?:-fixed)?)?(?:\.html)?|question-bank-home(?:-fixed)?(?:\.html)?|question-bank-data\.js|question-bank-user\.js)(?:[?#].*)?$/i.test(link.url||''))return {label:'查看旧题库页',url:'/modules/question-bank.html'};
    if(generic&&/^\/?(?:modules\/)?practice-dynamic\.html(?:[?#].*)?$/i.test(link.url||''))return {label:'查看分类练习',url:'/modules/practice-dynamic.html'};
    if(generic&&/^\/?(?:modules\/)?real-exams-dynamic\.html(?:[?#].*)?$/i.test(link.url||''))return {label:'查看真题页',url:'/modules/real-exams-dynamic.html'};
    return {label:link.label||'查看更新',url:link.url};
  });
}

function rUpd(its){
  const l=document.getElementById('upsL');
  if(!l)return;
  l.innerHTML='';
  its.forEach(it=>{
    const r=document.createElement('div');r.className='up';
    const ls=(it.links||[]).map(x=>{const a=typeof x==='string'?x:(x.label||x.url||'查看更新');const u=typeof x==='string'?x:x.url;return u?'<a class="up-l" href="'+u+'">↗ '+a+'</a>':''}).join('');
    r.innerHTML='<div class="up-d">'+(it.time||'')+'</div><div class="up-b"><h4>'+(it.title||'')+'</h4><p>'+(it.summary||'')+'</p>'+(ls?'<div class="up-ls">'+ls+'</div>':'')+'</div>';
    l.appendChild(r);
  });
}

document.addEventListener('submit',e=>{
  if(e.target.id!=='loginForm')return;
  const u=document.getElementById('uname').value.trim();
  const p=document.getElementById('pwd').value;
  if(!u||!p){e.preventDefault();setLoginInvalid(true);setLoginStatus('error','请补全用户名和密码');FMToast.warn('请输入用户名和密码');return}
  setLoginInvalid(false);
  const next=document.getElementById('loginNext');
  if(next)next.value=peekNextTarget()||'/index-complete?full=1';
  setLoginBusy(true,'正在进入...');
  setLoginStatus('loading','正在进入安全入口...');
});

document.addEventListener('click',e=>{
  if(e.target.closest('#tBtn')){
    if(!FMSecurity.isAuthenticated()){FMToast.info('请先通过安全入口登录');location.href='/_edge-login?next=%2Fmodules%2Fteacher-panel'}
    else if(FMSecurity.isTeacher())location.href='/modules/teacher-panel';
    else FMToast.warn('当前账户不是教师账户');
  }
  if(e.target.id==='logoutL'){
    e.preventDefault();
    FMSecurity.clearSession('user');
    location.href='/_edge-logout';
  }
});

async function ensureEdgeSession(){
  const e=window.__FM_EDGE_AUTH__;
  if(!window.FMSecurity)return null;
  if(!e||!e.username){
    try{FMSecurity.clearSession&&FMSecurity.clearSession('edge_required')}catch(_){}
    return null;
  }
  const role=e.role==='teacher'?'teacher':'student';
  const u={username:String(e.username),name:String(e.name||e.username),role};
  const c=FMSecurity.getUser&&FMSecurity.getUser();
  if(!c||c.username!==u.username||c.role!==u.role){
    try{FMSecurity.clearSession&&FMSecurity.clearSession('edge_sync')}catch(_){}
    await FMSecurity.saveSession(u);
  }
  return u;
}

function showBootError(){
  document.documentElement.removeAttribute('data-auth-pending');
  const e=document.getElementById('authAlert');
  if(e){
    e.dataset.authState='boot_error';
    e.textContent='页面初始化遇到问题。已保留登录入口；请刷新一次，或从下方入口重新进入学习。';
    e.hidden=false;
  }
  const g=document.getElementById('vGuest'),a=document.getElementById('vAuthed');
  if(a)a.hidden=true;
  if(g)g.hidden=false;
  setLoginStatus('error','页面初始化遇到问题，请刷新一次');
  setLoginBusy(false);
}

async function start(){
  try{
    await ensureEdgeSession();
    ab();
    document.documentElement.removeAttribute('data-auth-pending');
    const user=window.FMSecurity&&FMSecurity.isAuthenticated()?FMSecurity.getUser():null;
    if(user)dash(user);
    else guest();
    if(window.crypto&&crypto.subtle){
      const p=[navigator.userAgent,navigator.language,screen.width+'x'+screen.height].join('|');
      crypto.subtle.digest('SHA-256',new TextEncoder().encode(p)).then(b=>{
        const h=Array.from(new Uint8Array(b)).slice(0,4).map(x=>x.toString(16).padStart(2,'0')).join('');
        const e=document.getElementById('fpS');if(e)e.textContent='设备 '+h;
      });
    }
  }catch(err){
    try{console.warn('[FM] home boot failed',err)}catch(_){}
    showBootError();
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
else start();
})();

/* ============ Phase 2: 搜索索引 ============ */
const SEARCH_IDX=[
// ==== 主入口（4 大学习中心）====
{t:'入口',n:'公式回查表',u:'/index-complete.html#round264FormulaChecklist',d:'round264-formula-condition-checklist-20260522：首页第一屏复习路线，选出公式后核适用条件、边界条件、单位方向和常见错因，再回看对应例题和自制动画。',k:'round264 round264-formula-condition-checklist-20260522 公式回查表 适用条件 边界条件 单位方向 常见错因 自制动画 知识整理入口 连续方程 伯努利方程 动量方程 量纲分析 黏性近似'},
{t:'入口',n:'条件回查交互工作台',u:'/index-complete.html#formula-checklist',d:'首页学习工作台的 round264 条件回查标签：搜索公式，逐条核适用条件、边界条件、单位方向、常见错因和补救训练。',k:'round264 条件回查 交互工作台 公式条件 适用条件 边界条件 单位方向 常见错因 补救训练'},
{t:'入口',n:'题目选路图',u:'/index-complete.html#round263RouteMap',d:'round263-fluid-exam-route-map-20260522：先读题干条件和要求量，再分清边界条件，按题型选择公式路线。',k:'round263 round263-fluid-exam-route-map-20260522 题目选路图 题干条件 边界条件 公式选择'},
{t:'入口',n:'题目路线交互工作台',u:'/index-complete.html#exam-route',d:'首页学习工作台的题目路线标签：输入题目线索，先分条件和边界，再选公式路线。',k:'round263 题目路线 交互工作台 题干条件 边界条件 公式路线 选路'},
{t:'入口',n:'题库练习',u:'/modules/question-bank.html?from=home-search',d:'六章真题练习 · 分类题库 · 错题本与薄弱点提醒',k:'题库 练习 错题 题目 六章 真题'},
{t:'入口',n:'181103 资料题库与练习入口',u:'/modules/question-bank.html?focus=181103-material-extracted#questionBanksList',d:'Round373：首页搜索 181103 可直接进入 522 张来源 HTML 卡，其中 448 道独立题可刷、74 条源文线索只展示；同时保留 38/38 HTML 资料总表和 68 个真题复核任务；用户搜“181103去哪了、181103那些资源去哪了、181103里面还有别的题目、资料题库”也直达这里。',k:'181103 181103资料 181103资料题库 181103去哪了 181103那些资源去哪了 181103资源看不见 181103资料去哪了 181103里面的题目 181103里面还有别的题目 181103资料内题 181103题库 资料题库 448可刷题 74源文线索 522来源卡 522资料内题 522个题 38/38 HTML 68真题复核 题库 练习 搜索入口'},
{t:'入口',n:'181103 全资料 HTML 总表',u:'/resources/fluid-181103-html/index.html',d:'38/38 份 181103 资料已写成站内 HTML 正文；不走下载、viewer、raw 或原件壳；用户搜“181103资料在哪、181103不能下载、全部写成HTML”也直达这里。',k:'181103 181103资料在哪 181103去哪了 181103全资料 181103全部HTML 181103不能下载 不能下载 不许下载 不是viewer 不要viewer 全部写成HTML 全做成html格式 全资料 HTML 正文 38/38 站内阅读 资料总表 资料页'},
{t:'入口',n:'历年真题新版入口',u:'/modules/real-exams-dynamic.html?edge_refresh=round390-server-stable-progress-181103-html-sync-20260618&from=round342-home-search',d:'2000-2024 历年真题；325 原文小题和 68 个已拆组题 section，适合从题库、练习和搜索直接进入；用户搜“历年真题新版、round264不是当前真题、旧round264、简答题五题、本来五题别合并”也直达这里。',k:'历年真题 真题新版 历年真题新版 round264不是当前真题 不是round264 旧round264 不要旧版真题 325原文小题 68组题 简答题五题 本来五题 别合并 防合并 小题拆分 题数应该更多 2000-2024 803流体力学 搜索入口'},
{t:'入口',n:'错题订正入口',u:'/index-complete.html#tabsW',d:'首页错题本、收藏和笔记；先按错因订正，再回同类真题或公式条件继续练。',k:'错题 错题本 错题订正 错因回查 订正 收藏 笔记 搜索入口'},
{t:'入口',n:'私有课程状态入口',u:'/resources.html?from=round342-home-search-private-course#sourceStatus',d:'查看账号可见的专属课/私有课程状态；生产私有视频恢复仍以 FM_PRIVATE_MEDIA R2 binding 为边界；用户搜“无法删除视频、不能管理视频、私有视频管理不对”也直达状态页。',k:'私有课程 私有课程状态 专属课 专属课程状态 私有视频 私有视频管理 私有视频管理不对 无法删除视频 不能删除视频 不能管理视频 删除视频 视频管理 课程状态 账号状态 FM_PRIVATE_MEDIA R2 blocker 搜索入口'},
{t:'入口',n:'模拟章节题',u:'/modules/simulated-exams-dynamic.html?from=home-search',d:'72 道教材启发的模拟章节题；sourceKind=simulated，isRealExam=false，和正式真题隔离。',k:'模拟章节题 仿真题 mock 教材 吴望一 王洪伟 sourceKind simulated isRealExam false notRealExam 真题不混用'},
{t:'入口',n:'知识点全集',u:'/modules/knowledge-detail.html',d:'202 页已接章；共 202 页 · 1139 条课件小节 · 416 道真题练习 · 教材补充 221 张卡',k:'知识 章节 教材 真题 课程笔记 公式 吴望一 王洪伟'},
{t:'入口',n:'流体力学集训',u:'/modules/fluid-intensive-training.html',d:'章节日程、小节练习、真题起笔、答案核对、完整答案展开、题型专项、教材入口和对应真题放在同一页',k:'集训 冲刺 训练 复习 公式 真题起笔 答案核对 完整答案 第一行方程 适用条件 错因 真题 教材 小节 吴望一 王洪伟'},
{t:'入口',n:'做题练习',u:'/practice.html',d:'随机；章节；真题；错题；收藏 5 模式',k:'做题 练习 模式'},
{t:'入口',n:'视频与讲义',u:'/resources.html',d:'74 段精修本站自制动画课 · B站动画可视化精选 · 经典实验影像 · 讲义 · 受保护播放器',k:'视频 讲义 资源 课程 自制动画 精修 读图核对 B站 动画 可视化 仿真 湍流 伯努利 文丘里管 静水压 皮托管 内管总压 外管静压 压差计 毛细 源汇 兰金组合涡 马格努斯 正激波 控制体动量 射流冲击 相似准则 模型试验 圆柱绕流 局部损失 临界流 剪切层 连续方程 质量守恒 欧拉方程 压强梯度 微团变形 边界层分离 空化 Moody 沿程损失 雷诺输运定理 Navier-Stokes 涡量拉伸 喷管阻塞 拉普拉斯压差 泵管路工作点 浮力 稳性 强迫涡 Couette Stokes 水击 量纲分析 自由涡 涡心低压 Kelvin 环量 边界层动量积分 湍流对数律 壁面单位 缓变流 水面线 面积-Mach 等熵喷管 Rossby 数 地转平衡 Ekman 螺旋 Ekman 输运 内波 浮力频率 斜压项 水力控制 雷诺应力 连续介质 尺度窗 Knudsen 物质导数 对流加速度 Cauchy 应力张量 镜像法 圆定理 Stokes 第一问题 非定常扩散 线性重力波 频散关系 重力-毛细波 旋转坐标系 科氏加速度 圆柱坐标 托里拆利公式 小孔出流 非定常 Bernoulli Rankine 半体 Taylor-Couette 欧拉法 拉格朗日法 迹线方程 速度势 流函数 固壁 无穿透 无滑移 管流 水跃 浅水波 边界层 卡门涡街 机翼'},
{t:'模块',n:'自制流体力学动画课',u:'/resources/fluid-original-animations.html',d:'74 段站内自制动画已移除画面内场景公式遮挡，公式集中在下方核心公式区；新增欧拉-拉格朗日映射、迹线方程、速度势与流函数、固壁边界条件，并保留静水压、皮托管、文丘里管、边界层、浅水波、可压缩流、旋转流、分层内波、斜压生涡、水力控制和雷诺应力等主题。',k:'自制动画 流体力学 可视化 精修 读图核对 静水压 皮托管 内管总压 外管静压 压差计 文丘里管 伯努利 黏性 圆管层流 泊肃叶 毛细 表面张力 源汇流 流线 迹线 脉线 涡量 环量 兰金组合涡 层流 湍流 卡门涡街 边界层 浅水波 水跃 马格努斯 机翼 升力 正激波 马赫数 控制体动量 射流冲击 相似准则 模型试验 圆柱绕流 压强系数 局部损失 管路计算 临界流 比能曲线 剪切层 流动稳定性 连续方程 质量守恒 欧拉方程 速度梯度 变形率张量 边界层分离 逆压梯度 空化 蒸汽压 Moody 图 沿程损失 粗糙管湍流 雷诺输运定理 通量 Navier-Stokes 惯性项 黏性扩散 涡量方程 涡量拉伸 喷管阻塞 拉普拉斯压差 系统曲线 工作点 浮力 稳性 定倾中心 强迫涡 自由面 径向压强梯度 Couette Poiseuille 速度剖面 Stokes 阻力 低雷诺数 水击 压力波 量纲分析 Buckingham π 无量纲群 自由涡 涡心低压 Kelvin 环量定理 边界层动量积分 动量厚度 湍流对数律 壁面单位 缓变流 水面线 面积-Mach 关系 等熵喷管 Rossby 数 地转平衡 旋转流体 Ekman 螺旋 Ekman 输运 旋转边界层 稳定分层 浮力频率 内波 斜压项 涡量生成 密度梯度 水力控制 临界断面 雷诺分解 雷诺应力 湍流平均 连续介质 尺度窗 代表体元 Knudsen 数 物质导数 局部加速度 对流加速度 Cauchy 应力定理 应力张量 面力分解 镜像法 圆定理 复势 Stokes 第一问题 突然启动平板 非定常扩散 误差函数 线性重力波 频散关系 重力-毛细波 旋转坐标系 科氏加速度 离心项 圆柱坐标 连续方程 散度 托里拆利公式 小孔出流 非定常 Bernoulli 速度势 Lagrange 积分 Rankine 半体 点源均匀流 Taylor-Couette 同轴旋转圆柱 层流精确解 欧拉法 拉格朗日法 质点标签 迹线方程 速度势 流函数 正交网格 固壁边界条件 无穿透 无滑移'},
{t:'入口',n:'历年真题',u:'/modules/real-exams-dynamic.html',d:'2000-2024 真题完整解析',k:'真题 历年 考研'},

// ==== 流体知识点：动态索引从 data/fluid-home-search-index.json 加载 ====

// ==== 海赛专题 ====
{t:'海赛',n:'海赛总题库',u:'/modules/practice-dynamic.html?category=sea-contest',d:'17 专题 4096 题入口',k:'海赛 专题'},
{t:'海赛',n:'法律·权益·海岛',u:'/modules/ocean-competition-law-rights-islands.html',d:'UNCLOS · 海洋权益',k:'法律 unclos'},
{t:'海赛',n:'调查·极地·减灾',u:'/modules/ocean-competition-survey-polar-disaster.html',d:'仪器平台 · 极地',k:'调查 极地'},
{t:'海赛',n:'文化·合作·环保',u:'/modules/ocean-competition-culture-cooperation-environment.html',d:'制度公约 · 海丝',k:'文化 海丝'},
{t:'海赛',n:'气象·生态·资源',u:'/modules/ocean-competition-meteorology-ecology-resources.html',d:'海气耦合 · 生态',k:'气象 生态'},
{t:'海赛',n:'物理·化学·生物',u:'/modules/ocean-competition-physical-chemistry-biology.html',d:'动力过程 · 化学',k:'物化生'},
{t:'海赛',n:'地质·地理·时事',u:'/modules/ocean-competition-geology-current-affairs.html',d:'海底过程 · 通道',k:'地质 地理'},
{t:'海赛',n:'海洋科技',u:'/modules/ocean-competition-marine-technology.html',d:'深潜器 · Argo · 遥感',k:'科技 argo'},

// ==== 模块 / 资源 ====
{t:'模块',n:'流体静力学',u:'/modules/fluid-statics-dynamic.html',d:'静水压强、浮力、表面张力',k:'静力学 浮力'},
{t:'模块',n:'流体动力学',u:'/modules/fluid-dynamics-dynamic.html',d:'连续性、伯努利、动量',k:'动力学'},
{t:'模块',n:'流体力学集训',u:'/modules/fluid-intensive-training.html',d:'按章节读取复习计划、小节练习、真题起笔、答案核对、完整答案、第一行方程、核心公式适用核对、错因诊断和真题补救队列',k:'集训 章节日程 小节练习 真题起笔 答案核对 完整答案 第一行方程 公式适用 适用条件 题型专项 错因核对 真题补救'},
{t:'模块',n:'吴望一第二版教材整理',u:'/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html',d:'教材整理稿；617 页第二版全册线索，第 1-10 章、112 个小节、40 条推导、69 组公式、势流、波浪、黏性不可压缩流和气体动力学',k:'吴望一 第二版 全册 教材 HTML 章节整理 小节 场论 张量 连续介质 基本方程 涡旋 静力学 伯努利 动量 势流 波浪 黏性 边界层 湍流 气体动力学'},
{t:'模块',n:'我所理解的流体力学教材整理',u:'/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html',d:'教材整理稿；王洪伟教材线，299 页全书线索，第 1-9 章、120 个小节、20 条推导、51 组公式，生活流动现象连接基本方程、势流、边界层和可压缩流',k:'王洪伟 我所理解的流体力学 教材 HTML 章节整理 生活现象 流体概念 胶管 水火箭 雨滴 茶叶悖论 总压 可压缩 无量纲'},
{t:'模块',n:'粘性流动',u:'/modules/viscous-flow-dynamic.html',d:'N-S 方程、雷诺数、边界层',k:'粘性 N-S'},
{t:'模块',n:'涡量理论',u:'/modules/vorticity-theory-dynamic.html',d:'涡量、输运、Kelvin 定理',k:'涡量 环量'},
{t:'模块',n:'湍流理论',u:'/modules/turbulent-flow-dynamic.html',d:'RANS、雷诺应力、湍流模型',k:'湍流 rans'},
{t:'模块',n:'势流理论',u:'/modules/potential-flow-dynamic.html',d:'速度势、复势、点源点涡',k:'势流'},
{t:'模块',n:'数值模拟',u:'/modules/simulation-dynamic.html',d:'CFD 仿真、可视化',k:'cfd 仿真'},
{t:'模块',n:'推导问答',u:'/modules/ai-assistant-dynamic.html',d:'题目与公式答疑',k:'问答 推导 公式'},
{t:'物海',n:'物理海洋学专区',u:'/modules/physical-oceanography-home.html',d:'导论专区：核心+扩展共 436 题',k:'海洋'},
{t:'物海',n:'物理海洋学知识点',u:'/modules/physical-oceanography-knowledge.html',d:'按《导论》11 章整理',k:'海洋 导论'},
{t:'公式',n:'公式精排集',u:'/ultimate-beautiful-formulas.html',d:'公式速查与推导线索',k:'公式 速查'}
];
window.SEARCH_IDX=SEARCH_IDX;
let fluidHomeSearchIndexPromise=null;
function ensureFluidHomeSearchIndex(){
  if(fluidHomeSearchIndexPromise)return fluidHomeSearchIndexPromise;
  const loadJSON=window.fmFrontJSON||((url,opt={})=>fetch(url,{cache:opt.cache||'default',credentials:'same-origin',headers:{Accept:'application/json'}}).then(res=>res.ok?res.json():null).catch(()=>null));
  fluidHomeSearchIndexPromise=loadJSON('/data/fluid-home-search-index.json',{cache:'force-cache',timeoutMs:5500,retries:1})
    .then(payload=>{
      const entries=Array.isArray(payload&&payload.entries)?payload.entries:[];
      if(!entries.length)return SEARCH_IDX;
      const seen=new Set();
      const merged=SEARCH_IDX.concat(entries).filter(item=>{
        const key=[item.t,item.n,item.u].join('|');
        if(seen.has(key))return false;
        seen.add(key);
        return true;
      });
      SEARCH_IDX.splice(0,SEARCH_IDX.length,...merged);
      window.SEARCH_IDX=SEARCH_IDX;
      return SEARCH_IDX;
    })
    .catch(()=>SEARCH_IDX);
  return fluidHomeSearchIndexPromise;
}

/* ============ Phase 2: 主逻辑 ============ */
(function(){
'use strict';
const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={
 g:(k,f)=>{try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==='object'&&!Array.isArray(f)&&(v===null||typeof v!=='object'||Array.isArray(v)))return f;return v}catch(e){return f}},
 s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
function uk(){const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}

/* --- 搜索 --- */
	let sSel=0,sCur=[],lastSearchFocus=null,lastCmdFocus=null;
	function setExpanded(id,on){const el=$(id);if(el)el.setAttribute('aria-expanded',on?'true':'false')}
	function restoreFocus(el){try{if(el&&document.contains(el)&&typeof el.focus==='function')el.focus()}catch(_){}}
	function trapDialogTab(e,root){
	  const focusables=Array.from(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el=>el.offsetParent!==null||el===document.activeElement);
	  if(!focusables.length)return;
	  const first=focusables[0],last=focusables[focusables.length-1];
	  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
	  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
	}
	function openSearch(){lastSearchFocus=document.activeElement;const p=$('#searchP');if(p){p.classList.add('on');p.setAttribute('aria-hidden','false')}setExpanded('#searchT',true);ensureFluidHomeSearchIndex().then(()=>renderSearch($('#searchI')&&$('#searchI').value||''));setTimeout(()=>{const i=$('#searchI');if(i)i.focus()},60);renderSearch('')}
	function closeSearch(){const p=$('#searchP');if(p){p.classList.remove('on');p.setAttribute('aria-hidden','true')}setExpanded('#searchT',false);const i=$('#searchI');if(i)i.setAttribute('aria-activedescendant','');restoreFocus(lastSearchFocus||$('#searchT'));lastSearchFocus=null}
function renderSearch(q){
  const box=$('#searchR');
  q=(q||'').trim().toLowerCase();
  let list=SEARCH_IDX;
  if(q){
    list=SEARCH_IDX.map(i=>{
      const hay=(i.n+' '+i.d+' '+i.k+' '+i.t).toLowerCase();
      let sc=0;
      if(hay.includes(q))sc+=10;
      const parts=q.split(/\s+/);
      parts.forEach(p=>{if(p&&hay.includes(p))sc+=1});
      if(i.n.toLowerCase().includes(q))sc+=5;
      return{...i,sc};
    }).filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc);
  }
  sCur=list;sSel=0;
  const input=$('#searchI');
  if(!list.length){box.innerHTML='<div class="sp-emp">没有匹配结果</div>';if(input)input.setAttribute('aria-activedescendant','');return}
  const ICO={模块:'📘',题库:'🧩',知识:'📖',章节:'§',真题:'T',学习线索:'源',资料:'源',公式:'🔬',海赛:'🌊'};
  box.innerHTML=list.slice(0,18).map((it,i)=>`<div class="sp-r-i ${i===0?'on':''}" id="searchOpt${i}" role="option" aria-selected="${i===0?'true':'false'}" data-u="${esc(it.u)}" data-i="${i}"><div class="sp-r-ic">${ICO[it.t]||'•'}</div><div class="sp-r-b"><strong>${esc(it.n)}</strong><span>${esc(it.d)}</span></div><span class="sp-r-t">${esc(it.t)}</span></div>`).join('');
  if(input)input.setAttribute('aria-activedescendant','searchOpt0');
}
function moveSearch(d){
  const items=$$('#searchR .sp-r-i');if(!items.length)return;
  sSel=(sSel+d+items.length)%items.length;
  items.forEach((el,i)=>{const on=i===sSel;el.classList.toggle('on',on);el.setAttribute('aria-selected',on?'true':'false')});
  const input=$('#searchI');if(input)input.setAttribute('aria-activedescendant',items[sSel].id||'');
  items[sSel]&&items[sSel].scrollIntoView({block:'nearest'});
}
function goSearch(){
  const items=$$('#searchR .sp-r-i');if(!items[sSel])return;
  const u=items[sSel].dataset.u;closeSearch();
  if(window.FMTransitions)FMTransitions.navigate(u);else location.href=u;
}
document.addEventListener('click',e=>{
  if(e.target.closest('#searchT'))openSearch();
  const h=e.target.closest('.sp-r-i');if(h){sSel=+h.dataset.i;goSearch()}
  if(e.target===$('#searchP'))closeSearch();
});
document.addEventListener('input',e=>{if(e.target.id==='searchI')renderSearch(e.target.value)});

/* --- 快捷键 --- */
let keyBuf='',keyT=null;
document.addEventListener('keydown',e=>{
  const tag=(e.target.tagName||'').toLowerCase();
  const isIn=['input','textarea','select'].includes(tag)||e.target.isContentEditable;
	  const sp=$('#searchP');if(e.key==='Tab'&&sp&&sp.classList.contains('on')){trapDialogTab(e,sp);return}
	  if(e.key==='Escape'){closeSearch();closeKbd();return}
  if(isIn){if(e.target.id==='searchI'){if(e.key==='ArrowDown'){e.preventDefault();moveSearch(1)}else if(e.key==='ArrowUp'){e.preventDefault();moveSearch(-1)}else if(e.key==='Enter'){e.preventDefault();goSearch()}}return}
  if(e.key==='/'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();openSearch();return}
  if(e.key==='?'||(e.shiftKey&&e.key==='?')){e.preventDefault();openKbd();return}
  if(e.shiftKey&&(e.key==='T'||e.key==='t')){e.preventDefault();$('#themeT')&&$('#themeT').click();return}
  if(e.shiftKey&&(e.key==='F'||e.key==='f')){e.preventDefault();document.body.classList.toggle('focus');return}
  if(!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&/^[a-zA-Z]$/.test(e.key)){
    keyBuf+=e.key.toLowerCase();clearTimeout(keyT);keyT=setTimeout(()=>keyBuf='',800);
    if(keyBuf.endsWith('gg')){window.scrollTo({top:0,behavior:'smooth'});keyBuf=''}
    else if(keyBuf.endsWith('gq')){if(window.FMTransitions)FMTransitions.navigate('/modules/question-bank.html?from=home-shortcut');keyBuf=''}
    else if(keyBuf.endsWith('gt')){if(window.FMSecurity&&FMSecurity.isTeacher())location.href='/teacher-panel.html';keyBuf=''}
  }
});
function openKbd(){const p=$('#kbdP');if(p){p.classList.add('on');p.setAttribute('aria-hidden','false');p.focus({preventScroll:true})}setExpanded('#kbdT',true)}
function closeKbd(){const p=$('#kbdP');if(p){p.classList.remove('on');p.setAttribute('aria-hidden','true')}setExpanded('#kbdT',false)}
document.addEventListener('click',e=>{if(e.target.closest('#kbdT'))openKbd();if(e.target===$('#kbdP'))closeKbd()});

/* --- FAB 已移除 --- */

/* --- 热力图 --- */
function renderHeat(){
  const g=$('#heatG');if(!g)return;
  const days=91;const today=new Date();today.setHours(0,0,0,0);
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions())||[];const u=uk();
  const mine=ses.filter(s=>s.user===u);
  const cnt={};
  mine.forEach(s=>{const d=new Date(s.startedAt);d.setHours(0,0,0,0);const k=d.getTime();cnt[k]=(cnt[k]||0)+1});
  const max=Math.max(1,...Object.values(cnt));
  const start=new Date(today);start.setDate(today.getDate()-days+1);
  const dow=start.getDay()===0?6:start.getDay()-1;
  const cells=[];
  for(let i=0;i<dow;i++)cells.push('<div class="heat-c" style="visibility:hidden"></div>');
  let stk=0,stkRun=0,act30=0;const m30=today.getTime()-30*86400000;
  const monthSet=[];let lastM=-1;
  for(let i=0;i<days;i++){
    const d=new Date(start);d.setDate(start.getDate()+i);
    const k=d.getTime();const c=cnt[k]||0;
    if(lastM!==d.getMonth()){monthSet.push({i:cells.length,m:d.getMonth()+1});lastM=d.getMonth()}
    let lv=0;if(c>0)lv=Math.min(4,Math.ceil(c/(max/4)));
    const tip=(d.getMonth()+1)+'/'+d.getDate()+' · '+c+' 次访问';
    cells.push(`<div class="heat-c ${lv?'l'+lv:''}" data-tip="${tip}"></div>`);
    if(k>=m30&&c>0)act30++;
    if(c>0){stkRun++;stk=Math.max(stk,stkRun)}else stkRun=0;
  }
  g.innerHTML=cells.join('');
  const mo=$('#heatMo');if(mo){const cw=16;mo.innerHTML=monthSet.slice(0,6).map((x,i)=>{const wi=Math.floor(x.i/7);return `<span style="margin-left:${i===0?0:wi*cw-(i===0?0:monthSet[i-1]?(Math.floor(monthSet[i-1].i/7)+1)*cw:0)}px">${x.m}月</span>`}).join('')}
  $('#stkD').textContent=stk;$('#actD').textContent=act30;
}

/* --- 雷达图 --- */
function renderRadar(){
  const box=$('#radBox');if(!box)return;
  const scs=(window.FMAnalytics&&FMAnalytics.getScores())||[];const u=uk();
  const mine=scs.filter(s=>s.user===u);
  $('#stkT').textContent=mine.length;
  if(!mine.length){$('#stkAv').textContent='—';$('#stkM').textContent='—';return}
  const mods={};
  mine.forEach(s=>{if(!mods[s.module])mods[s.module]={t:0,c:0};mods[s.module].t+=s.score;mods[s.module].c++});
  const entries=Object.entries(mods).map(([k,v])=>[k,Math.round(v.t/v.c)]).slice(0,6);
  if(entries.length<3){box.innerHTML='<div style="padding:40px 0;text-align:center;color:var(--text-muted);font-size:.88rem">至少 3 个不同模块的测验才能绘制雷达图<br><small style="opacity:.7">当前 '+entries.length+' 个</small></div>';
  const avg=Math.round(mine.reduce((a,r)=>a+r.score,0)/mine.length);
  $('#stkAv').textContent=avg+' 分';$('#stkM').textContent=Math.max.apply(null,mine.map(r=>r.score))+' 分';return}
  const W=300,H=300,cx=W/2,cy=H/2,R=100;const n=entries.length;
  let rings='';for(let r=1;r<=4;r++){const rr=R*r/4;const pts=[];for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;pts.push((cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1))}rings+=`<polygon class="rad-grid" points="${pts.join(' ')}"/>`}
  let axes='';for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;axes+=`<line class="rad-ax" x1="${cx}" y1="${cy}" x2="${(cx+R*Math.cos(a)).toFixed(1)}" y2="${(cy+R*Math.sin(a)).toFixed(1)}"/>`}
  const polyPts=entries.map(([,v],i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const r=R*v/100;return(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)}).join(' ');
  const dots=entries.map(([k,v],i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const r=R*v/100;return`<circle class="rad-dot" cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy+r*Math.sin(a)).toFixed(1)}" r="3.5"><title>${esc(k)}: ${v}分</title></circle>`}).join('');
  const labs=entries.map(([k,v],i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const lr=R+18;const x=cx+lr*Math.cos(a);const y=cy+lr*Math.sin(a);const anc=Math.cos(a)>0.1?'start':Math.cos(a)<-0.1?'end':'middle';return`<text class="rad-lab" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anc}" dy="3">${esc(k.length>6?k.slice(0,6)+'…':k)}</text><text class="rad-val" x="${x.toFixed(1)}" y="${(y+12).toFixed(1)}" text-anchor="${anc}">${v}</text>`}).join('');
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}">${rings}${axes}<polygon class="rad-poly" points="${polyPts}"/>${dots}${labs}</svg>`;
  const avg=Math.round(mine.reduce((a,r)=>a+r.score,0)/mine.length);
  $('#stkAv').textContent=avg+' 分';$('#stkM').textContent=Math.max.apply(null,mine.map(r=>r.score))+' 分';
}

/* --- 每日任务 --- */
function renderTasks(){
  const g=$('#tasksG');if(!g)return;
  const today=new Date();const dk=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions())||[];const scs=(window.FMAnalytics&&FMAnalytics.getScores())||[];
  const u=uk();
  const dayStart=new Date();dayStart.setHours(0,0,0,0);
  const todayS=ses.filter(s=>s.user===u&&s.startedAt>=dayStart.getTime());
  const todayMin=Math.round(todayS.reduce((a,s)=>a+(s.duration||0),0)/60000);
  const todayScores=scs.filter(s=>s.user===u&&s.at>=dayStart.getTime());
  const todayPages=new Set();todayS.forEach(s=>(s.pages||[]).forEach(p=>todayPages.add(p.path)));
  const T=[
    {icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',title:'学习 30 分钟',desc:'每日保持专注时间',cur:todayMin,goal:30,unit:'分钟',bg:'rgba(20,184,166,.12)',fg:'var(--tide-600)'},
    {icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',title:'完成 1 次测验',desc:'保持做题手感',cur:todayScores.length,goal:1,unit:'次',bg:'rgba(249,115,22,.12)',fg:'var(--coral-600)'},
    {icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',title:'浏览 3 个模块',desc:'覆盖不同章节',cur:todayPages.size,goal:3,unit:'页',bg:'rgba(59,130,246,.12)',fg:'var(--info)'}
  ];
  g.innerHTML=T.map(t=>{const pc=Math.min(100,Math.round(t.cur/t.goal*100));const done=pc>=100;return `<div class="task ${done?'done':''}" style="--task-bg:${t.bg};--task-fg:${t.fg}"><div class="task-ic">${done?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':t.icon}</div><div class="task-b"><strong>${t.title}</strong><p>${t.desc}</p><div class="task-pg"><div class="task-pg-f" style="width:${pc}%"></div></div><div class="task-m"><span>已完成 ${t.cur} ${t.unit}；目标 ${t.goal} ${t.unit}</span><span>${pc}%</span></div></div></div>`}).join('');
}

/* --- 最近学习 --- */
function renderRecent(){
  const l=$('#recL');if(!l)return;
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions())||[];const u=uk();
  const mine=ses.filter(s=>s.user===u);
  const pages=[];const seen=new Set();
  for(let i=mine.length-1;i>=0;i--){const s=mine[i];for(let j=(s.pages||[]).length-1;j>=0;j--){const p=s.pages[j];if(seen.has(p.path))continue;if(p.path==='/index-complete.html'||p.path==='/'||p.path==='/index.html')continue;seen.add(p.path);pages.push({...p,ses:s.startedAt});if(pages.length>=6)break}if(pages.length>=6)break}
  if(!pages.length){l.innerHTML='<div style="padding:32px 0;text-align:center;color:var(--text-muted);font-size:.88rem">还没访问过其他页面，先从题库或知识点开始</div>';return}
  l.innerHTML=pages.map(p=>{const t=fdt(p.t||p.ses);return `<a class="r" href="${esc(p.path)}"><div class="rec-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="rec-b"><strong>${esc(p.title||p.path)}</strong><span>${esc(p.path)}</span></div><span class="rec-t">${esc(t)}</span></a>`}).join('');
}
function fdt(t){if(!t)return '';const n=Date.now(),g=n-t;if(g<60000)return'刚刚';if(g<3600000)return Math.round(g/60000)+'分钟前';if(g<86400000)return Math.round(g/3600000)+'小时前';if(g<604800000)return Math.round(g/86400000)+'天前';const d=new Date(t);return(d.getMonth()+1)+'/'+d.getDate()}

/* --- 推荐路径 --- */
function renderReco(){
  const l=$('#recoL');if(!l)return;
  const prog=(window.FMAnalytics&&FMAnalytics.getProgress())||{};const u=uk();
  const mine=prog[u]&&prog[u].modules||{};
  const MODS=[
    {k:'fluid-statics',n:'流体静力学',u:'/modules/fluid-statics-dynamic.html',order:1},
    {k:'fluid-dynamics',n:'流体动力学',u:'/modules/fluid-dynamics-dynamic.html',order:2},
    {k:'viscous-flow',n:'粘性流动',u:'/modules/viscous-flow-dynamic.html',order:3},
    {k:'vorticity-theory',n:'涡量理论',u:'/modules/vorticity-theory-dynamic.html',order:4},
    {k:'turbulent-flow',n:'湍流理论',u:'/modules/turbulent-flow-dynamic.html',order:5},
    {k:'physical-oceanography',n:'物理海洋学',u:'/modules/physical-oceanography-home.html',order:6}
  ];
  const reco=MODS.map(m=>{const p=(mine[m.k]&&mine[m.k].progress)||0;return{...m,pct:Math.round(p*100)}}).sort((a,b)=>{if(a.pct===100&&b.pct!==100)return 1;if(b.pct===100&&a.pct!==100)return -1;if(a.pct>0&&b.pct===0)return -1;if(b.pct>0&&a.pct===0)return 1;if(a.pct>0&&b.pct>0)return a.pct-b.pct;return a.order-b.order}).slice(0,5);
  l.innerHTML=reco.map(m=>{const label=m.pct===100?'已完成':m.pct>0?('进行中 '+m.pct+'%'):'未开始';const col=m.pct===100?'var(--ok)':m.pct>0?'var(--warn)':'var(--text-muted)';return `<a class="r" href="${esc(m.u)}"><div class="rec-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div><div class="rec-b"><strong>${esc(m.n)}</strong><span style="color:${col}">${label}</span></div><span class="rec-t">去学</span></a>`}).join('');
}

/* --- Tabs --- */
document.addEventListener('click',e=>{
  const b=e.target.closest('.tabs-b');if(!b)return;
  const tab=b.dataset.tab;
  $$('.tabs-b').forEach(x=>x.classList.toggle('on',x.dataset.tab===tab));
  $$('.tabs-p').forEach(x=>x.classList.toggle('on',x.dataset.tab===tab));
});

/* --- 笔记 --- */
const NK='fm_notes';
function getNotes(){return (LS.g(NK,{})||{})[uk()]||[]}
function setNotes(arr){const a=LS.g(NK,{})||{};a[uk()]=arr;LS.s(NK,a)}
function renderNotes(){
  const l=$('#noteL');if(!l)return;
  const ns=getNotes();$('#cntN').textContent=ns.length;
  if(!ns.length){l.innerHTML='<div style="padding:24px 0;text-align:center;color:var(--text-muted);font-size:.88rem">还没有笔记，写下第一条 ↑</div>';return}
  l.innerHTML=ns.slice().sort((a,b)=>b.t-a.t).map(n=>`<div class="note-i" data-id="${n.id}"><div><div class="t">${esc(n.text)}</div><div class="d">${esc(fdt(n.t))} · ${new Date(n.t).toLocaleTimeString('zh-CN').slice(0,5)}</div></div><button class="x" data-del="${n.id}">删</button></div>`).join('');
}
function addNote(){const i=$('#noteIn');const v=(i.value||'').trim();if(!v)return;const ns=getNotes();ns.push({id:'n_'+Date.now(),text:v,t:Date.now()});setNotes(ns);i.value='';renderNotes();if(window.FMToast)FMToast.ok('已保存')}
document.addEventListener('keydown',e=>{if(e.target.id==='noteIn'&&e.key==='Enter'){e.preventDefault();addNote()}});
document.addEventListener('click',e=>{
  if(e.target.id==='noteSave')addNote();
  const d=e.target.dataset.del;if(d){setNotes(getNotes().filter(n=>n.id!==d));renderNotes();if(window.FMToast)FMToast.info('已删除')}
});

/* --- 错题 / 收藏 --- */
function renderWrongFav(){
  const wk='fm_wrong',fk='fm_favs';
  const wAll=LS.g(wk,{})||{};const fAll=LS.g(fk,{})||{};const u=uk();
  const w=wAll[u]||[];const f=fAll[u]||[];
  $('#cntW').textContent=w.length;$('#cntF').textContent=f.length;
  const wl=$('#wrongL');if(wl){if(!w.length)wl.innerHTML='<div style="padding:28px 0;text-align:center;color:var(--text-muted);font-size:.9rem">做题时把错题加进错题本，这里会按订正顺序列出<br><small style="opacity:.7">调用 window.fmAddWrong({module, text, url})</small></div>';
  else wl.innerHTML=w.slice().sort((a,b)=>b.t-a.t).slice(0,50).map(x=>`<div class="note-i"><div><div class="t">${esc(x.text||'')}</div><div class="d">${esc(x.module||'')} · ${esc(fdt(x.t))}</div></div>${x.url?`<a class="btn btn-g btn-sm" href="${esc(x.url)}">去复习</a>`:''}</div>`).join('')}
  const fl=$('#favL');if(fl){if(!f.length)fl.innerHTML='<div style="padding:28px 0;text-align:center;color:var(--text-muted);font-size:.9rem">收藏的模块、公式、题目都会出现在这里<br><small style="opacity:.7">调用 window.fmAddFav({title, url, kind})</small></div>';
  else fl.innerHTML=f.slice().sort((a,b)=>b.t-a.t).map(x=>`<a class="note-i" href="${esc(x.url||'#')}"><div><div class="t">${esc(x.title||'')}</div><div class="d">${esc(x.kind||'收藏')} · ${esc(fdt(x.t))}</div></div><span class="rec-t">打开</span></a>`).join('')}
}
window.fmAddWrong=function(o){const k='fm_wrong';const a=LS.g(k,{})||{};const u=uk();if(!a[u])a[u]=[];a[u].push({id:'w_'+Date.now(),...o,t:Date.now()});LS.s(k,a);renderWrongFav()};
window.fmAddFav=function(o){const k='fm_favs';const a=LS.g(k,{})||{};const u=uk();if(!a[u])a[u]=[];a[u].push({id:'f_'+Date.now(),...o,t:Date.now()});LS.s(k,a);renderWrongFav()};

/* --- 公告（聚合教师发布 + 站点公告） --- */
function renderAnn(){
  const bar=$('#annBar');if(!bar)return;
  const dismissed=LS.g('fm_ann_dismissed',{})||{};const now=Date.now();
  // 兼容老格式（字符串）
  const dObj=typeof dismissed==='string'?{[dismissed]:true}:dismissed;
  // 教师公告（localStorage）
  const tAnns=(LS.g('fm_teacher_announcements',[])||[]).filter(a=>a.active&&(!a.expiresAt||a.expiresAt>now)&&!dObj['t_'+a.id]).sort((a,b)=>b.createdAt-a.createdAt);
  if(tAnns.length){
    const a=tAnns[0];
    const colors={info:'#3b82f6',default:'#14b8a6',warn:'#f59e0b',imp:'#ef4444'};
    const c=colors[a.level||'default'];
    bar.style.background=`linear-gradient(90deg,${c}22,${c}0a)`;
    bar.style.borderColor=c+'44';
    const dot=bar.querySelector('.d');if(dot)dot.style.background=c;
    $('#annBody').innerHTML='<strong>'+esc(a.title||'公告')+'</strong>'+(a.body?' · '+esc(a.body):'')+(a.author?' <span style="opacity:.6;font-size:.78rem">— '+esc(a.author)+'</span>':'');
    bar.hidden=false;
    $('#annX').onclick=()=>{const d2=LS.g('fm_ann_dismissed',{})||{};const o=typeof d2==='string'?{[d2]:true}:d2;o['t_'+a.id]=true;LS.s('fm_ann_dismissed',o);bar.hidden=true;setTimeout(renderAnn,100)};
    return;
  }
  // 站点公告
  const loadJSON=window.fmFrontJSON||((url,opt={})=>fetch(url,{cache:opt.cache||'default',credentials:'same-origin',headers:{Accept:'application/json'}}).then(res=>res.ok?res.json():null).catch(()=>null));
  loadJSON('/site-announcement.json?ts='+Date.now(),{cache:'no-cache',key:'/site-announcement.json',timeoutMs:3500,retries:0}).then(d=>{
    if(!d||!d.active)return;
    if(dObj[d.id])return;
    $('#annBody').innerHTML='<strong>'+esc(d.title||'')+'</strong> · '+esc(d.body||'');
    bar.hidden=false;
    $('#annX').onclick=()=>{const d2=LS.g('fm_ann_dismissed',{})||{};const o=typeof d2==='string'?{[d2]:true}:d2;o[d.id]=true;LS.s('fm_ann_dismissed',o);bar.hidden=true};
  }).catch(()=>{});
}

/* --- 延迟初始化（等主流程挂载） --- */
function initPhase2(){
  if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
  renderHeat();renderRadar();renderTasks();renderRecent();renderReco();renderNotes();renderWrongFav();renderAnn();
  // FAB 已移除
  window.addEventListener('fm:activity',()=>{renderHeat();renderRadar();renderTasks();renderRecent()});
}
setTimeout(initPhase2,500);
setInterval(()=>{if(document.visibilityState==='visible'&&window.FMSecurity&&FMSecurity.isAuthenticated()){renderHeat();renderTasks();renderRecent()}},60000);
})();

/* ============ Phase 3: 国际级增强 ============ */
(function(){
'use strict';
const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={
  g:(k,f)=>{try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==='object'&&!Array.isArray(f)&&(v===null||typeof v!=='object'||Array.isArray(v)))return f;return v}catch(e){return f}},
  s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){if(e.name==='QuotaExceededError'){console.warn('存储满了，清理旧数据');try{['fm_activity_log','fm_sessions'].forEach(k=>{const a=JSON.parse(localStorage.getItem(k)||'[]');if(Array.isArray(a)&&a.length>100)localStorage.setItem(k,JSON.stringify(a.slice(-100)))});localStorage.setItem(k,JSON.stringify(v));return true}catch(e2){return false}}return false}}
};
function uk(){const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}

/* --- 全局错误边界（静默捕获，仅 console） --- */
window.addEventListener('error',e=>{
  try{console.warn('[FM]',e.message||'error')}catch(_){}
  // 不打扰用户 UI，只在严重且首次时轻提示
});
window.addEventListener('unhandledrejection',e=>{try{console.warn('[FM] promise:',e.reason)}catch(_){}});

/* --- 数字滚动动画 --- */
function animNum(el,target,dur){
  dur=dur||900;const t0=parseFloat(el.textContent)||0;const dt=target-t0;const start=performance.now();
  function step(t){const p=Math.min(1,(t-start)/dur);const e=1-Math.pow(1-p,3);const v=Math.round(t0+dt*e);el.textContent=v;if(p<1)requestAnimationFrame(step)}
  if(Math.abs(dt)<1){el.textContent=target;return}requestAnimationFrame(step);
}
window.fmAnimNum=animNum;
// 在页面上自动识别 .num-roll
const numObs=new MutationObserver(()=>{});

/* --- 命令面板 --- */
const CMDS=[
  {g:'操作',n:'切换主题',d:'浅色；深色模式',i:'🎨',run:()=>$('#themeT')&&$('#themeT').click(),k:'⇧T'},
  {g:'操作',n:'专注模式',d:'隐藏装饰元素',i:'🧘',run:()=>document.body.classList.toggle('focus'),k:'⇧F'},
  {g:'操作',n:'打开快捷键面板',d:'查看所有快捷键',i:'⌨️',run:()=>$('#kbdT')&&$('#kbdT').click(),k:'?'},
  {g:'操作',n:'启动番茄钟',d:'25 分钟专注',i:'🍅',run:()=>{$('#pomoPnl').classList.add('on');setTimeout(()=>$('#pomoStart')&&$('#pomoStart').click(),300)},k:''},
  {g:'操作',n:'记一条笔记',d:'跳到笔记区',i:'📝',run:()=>{const el=$('#noteIn');el&&el.scrollIntoView({behavior:'smooth'});setTimeout(()=>el&&el.focus(),400)},k:''},
  {g:'操作',n:'回到顶部',d:'',i:'⬆️',run:()=>window.scrollTo({top:0,behavior:'smooth'}),k:'GG'},
  {g:'操作',n:'退出登录',d:'退出边缘安全会话',i:'🚪',run:()=>{if(confirm('确认退出？')){window.FMSecurity&&FMSecurity.clearSession('user');location.href='/_edge-logout'}},k:''},
  {g:'导航',n:'题库',d:'六章练习与分类题库',i:'🧩',run:()=>nav('/modules/question-bank.html?from=command-palette'),k:'GQ'},
  {g:'导航',n:'教师端',d:'完整教师后台',i:'🎓',run:()=>{if(window.FMSecurity&&FMSecurity.isTeacher())location.href='/teacher-panel.html';else FMToast.warn('需要教师账户')},k:'GT'},
  {g:'导航',n:'真题',d:'历年真题',i:'📄',run:()=>nav('/modules/real-exams-dynamic.html'),k:''},
  {g:'导航',n:'物理海洋学专区',d:'导论题库',i:'🌊',run:()=>nav('/modules/physical-oceanography-home.html'),k:''},
  {g:'导航',n:'公式精排集',d:'公式速查',i:'🔬',run:()=>nav('/ultimate-beautiful-formulas.html'),k:''},
  {g:'导航',n:'推导问答',d:'题目与公式答疑',i:'💬',run:()=>nav('/modules/ai-assistant-dynamic.html'),k:''}
];
function nav(u){if(window.FMTransitions)FMTransitions.navigate(u);else location.href=u}
let cSel=0,cFiltered=[];
	function openCmd(){lastCmdFocus=document.activeElement;const p=$('#cmdk');if(p){p.classList.add('on');p.setAttribute('aria-hidden','false')}setTimeout(()=>{const i=$('#cmdkIn');i.value='';i.focus();renderCmd('')},60)}
	function closeCmd(){const p=$('#cmdk');if(p){p.classList.remove('on');p.setAttribute('aria-hidden','true')}const i=$('#cmdkIn');if(i)i.setAttribute('aria-activedescendant','');restoreFocus(lastCmdFocus);lastCmdFocus=null}
function renderCmd(q){
  q=(q||'').trim().toLowerCase();
  const all=CMDS.concat((window.SEARCH_IDX||[]).map(s=>({g:'页面',n:s.n,d:s.d,i:'📘',run:()=>nav(s.u),k:''})));
  let list=all;
  if(q){list=all.map(c=>{const hay=(c.n+' '+c.d+' '+c.g).toLowerCase();let sc=0;if(hay.includes(q))sc+=10;q.split(/\s+/).forEach(p=>{if(p&&hay.includes(p))sc+=2});if(c.n.toLowerCase().includes(q))sc+=5;return{...c,sc}}).filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc)}
  cFiltered=list;cSel=0;
  const box=$('#cmdkR');
	  const input=$('#cmdkIn');
	  if(!list.length){box.innerHTML='<div style="padding:32px;text-align:center;color:var(--text-muted);font-size:.9rem">没有匹配的命令</div>';if(input)input.setAttribute('aria-activedescendant','');return}
	  const groups={};list.slice(0,24).forEach((c,i)=>{if(!groups[c.g])groups[c.g]=[];groups[c.g].push({...c,_i:i})});
	  let idx=0;box.innerHTML=Object.entries(groups).map(([g,items])=>{return '<div class="cmdk-sec">'+esc(g)+'</div>'+items.map(c=>{const my=idx++;return `<div class="cmdk-i ${my===0?'sel':''}" id="cmdkOpt${my}" role="option" aria-selected="${my===0?'true':'false'}" data-i="${c._i}"><div class="cmdk-ico">${esc(c.i)}</div><div class="cmdk-b"><strong>${esc(c.n)}</strong>${c.d?'<span>'+esc(c.d)+'</span>':''}</div>${c.k?'<span class="cmdk-k">'+esc(c.k)+'</span>':''}</div>`}).join('')}).join('');
	  if(input)input.setAttribute('aria-activedescendant','cmdkOpt0');
	}
	function moveCmd(d){const items=$$('#cmdkR .cmdk-i');if(!items.length)return;cSel=(cSel+d+items.length)%items.length;items.forEach((el,i)=>{const on=i===cSel;el.classList.toggle('sel',on);el.setAttribute('aria-selected',on?'true':'false')});const input=$('#cmdkIn');if(input)input.setAttribute('aria-activedescendant',items[cSel].id||'');items[cSel]&&items[cSel].scrollIntoView({block:'nearest'})}
function runCmd(){const items=$$('#cmdkR .cmdk-i');const el=items[cSel];if(!el)return;const i=+el.dataset.i;closeCmd();const c=cFiltered[i];c&&c.run&&setTimeout(c.run,180)}
document.addEventListener('click',e=>{const el=e.target.closest('.cmdk-i');if(el){cSel=$$('#cmdkR .cmdk-i').indexOf(el);runCmd();return}if(e.target===$('#cmdk'))closeCmd()});
document.addEventListener('input',e=>{if(e.target.id==='cmdkIn')renderCmd(e.target.value)});
	document.addEventListener('keydown',e=>{
	  const isMod=e.metaKey||e.ctrlKey;
	  if(isMod&&(e.key==='k'||e.key==='K')){e.preventDefault();openCmd();return}
	  const p=$('#cmdk');if(e.key==='Tab'&&p&&p.classList.contains('on')){trapDialogTab(e,p);return}
	  if(e.target.id==='cmdkIn'){if(e.key==='ArrowDown'){e.preventDefault();moveCmd(1)}else if(e.key==='ArrowUp'){e.preventDefault();moveCmd(-1)}else if(e.key==='Enter'){e.preventDefault();runCmd()}else if(e.key==='Escape'){e.preventDefault();closeCmd()}}
	});

/* --- 流体粒子背景 --- */
function initFluid(){
  const c=$('#fluidBg');if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;
  let W,H,blobs=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight}
  function init(){blobs=[];const n=Math.min(5,Math.floor(W/400));for(let i=0;i<n;i++)blobs.push({x:Math.random()*W,y:Math.random()*H,r:120+Math.random()*120,dx:(Math.random()-.5)*.3,dy:(Math.random()-.5)*.3,h:i%2?180:20})}
  function draw(){
    ctx.clearRect(0,0,W,H);
    blobs.forEach(b=>{
      b.x+=b.dx;b.y+=b.dy;
      if(b.x<-b.r||b.x>W+b.r)b.dx*=-1;
      if(b.y<-b.r||b.y>H+b.r)b.dy*=-1;
      const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
      const hue=b.h===180?'20,184,166':'249,115,22';
      g.addColorStop(0,`rgba(${hue},.14)`);g.addColorStop(.5,`rgba(${hue},.05)`);g.addColorStop(1,`rgba(${hue},0)`);
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();init();draw();addEventListener('resize',()=>{resize();init()},{passive:true});
}
// 仅在支持且用户未开启减少动画时启动
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setTimeout(initFluid,300);

/* --- 浮动目录 --- */
function initTOC(){
  const toc=$('#toc');if(!toc)return;
  const secs=[...document.querySelectorAll('.sec-t,.growth,.wk-rep,.goals,.tabs-w')].filter(el=>el.offsetParent);
  if(!secs.length){toc.style.display='none';return}
  const entries=secs.map((el,i)=>{
    let title=el.textContent.trim().split('\n')[0].slice(0,12);
    if(el.classList.contains('growth'))title='成长曲线';
    else if(el.classList.contains('wk-rep'))title='本周报告';
    else if(el.classList.contains('goals'))title='本周目标';
    else if(el.classList.contains('tabs-w'))title='笔记·错题';
    const id='sec-'+i;el.id=el.id||id;
    return{el,id:el.id,title}
  });
  toc.innerHTML=entries.map((e,i)=>`<a class="toc-i${i===0?' on':''}" href="#${e.id}" data-id="${e.id}"><span class="toc-lab">${esc(e.title)}</span></a>`).join('');
  toc.classList.add('on');
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(ent=>{if(ent.isIntersecting){$$('#toc .toc-i').forEach(a=>a.classList.toggle('on',a.dataset.id===ent.target.id))}});
  },{rootMargin:'-30% 0px -60% 0px'});
  entries.forEach(e=>io.observe(e.el));
}
setTimeout(initTOC,700);
})();

/* ============ Phase 3-B: 番茄钟 / 成长曲线 / 成就 ============ */
(function(){
'use strict';
const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={g:(k,f)=>{try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==="object"&&!Array.isArray(f)&&(v===null||typeof v!=="object"||Array.isArray(v)))return f;return v}catch(e){return f}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function uk(){const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}

/* --- 番茄钟 --- */
const POMO_KEY='fm_pomo_v2';
let pomoState={mode:25,remain:25*60,running:false,startedAt:null};let pomoTimer=null;
function pomoStats(){return LS.g(POMO_KEY,{records:[]})}
function pomoFmt(s){const m=Math.floor(s/60),ss=s%60;return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0')}
function pomoDraw(){
  const d=pomoFmt(pomoState.remain);
  const disp=$('#pomoDisp');if(disp)disp.textContent=d;
  const t=$('#pomoT');if(t){t.textContent=d;t.hidden=!pomoState.running}
  const b=$('#pomoB');if(b){b.classList.toggle('working',pomoState.running&&pomoState.mode!==5);b.classList.toggle('rest',pomoState.running&&pomoState.mode===5);const ic=$('#pomoB .pomo-ic');if(ic)ic.style.display=pomoState.running?'none':''}
  const s=pomoStats();const today=new Date();today.setHours(0,0,0,0);
  const todayN=(s.records||[]).filter(r=>r.at>=today.getTime()&&r.mode!==5).length;
  $('#pomoToday')&&($('#pomoToday').textContent=todayN);
  $('#pomoTotal')&&($('#pomoTotal').textContent=(s.records||[]).filter(r=>r.mode!==5).length);
}
function pomoStart(){if(pomoState.running)return;pomoState.running=true;pomoState.startedAt=Date.now();pomoTimer=setInterval(()=>{pomoState.remain--;if(pomoState.remain<=0){pomoFinish()}pomoDraw()},1000);const b=$('#pomoStart');if(b){b.textContent='暂停';b.classList.remove('pr')}pomoDraw()}
function pomoPause(){if(!pomoState.running)return;pomoState.running=false;clearInterval(pomoTimer);const b=$('#pomoStart');if(b){b.textContent='继续';b.classList.add('pr')}pomoDraw()}
function pomoReset(){pomoState.running=false;clearInterval(pomoTimer);pomoState.remain=pomoState.mode*60;const b=$('#pomoStart');if(b){b.textContent='开始';b.classList.add('pr')}pomoDraw()}
function pomoFinish(){
  pomoState.running=false;clearInterval(pomoTimer);
  const s=pomoStats();s.records=(s.records||[]);s.records.push({mode:pomoState.mode,at:Date.now()});if(s.records.length>500)s.records=s.records.slice(-500);LS.s(POMO_KEY,s);
  if(window.FMToast){const msg=pomoState.mode===5?'🎉 休息结束，回到专注吧':'🎉 一个番茄完成！休息 5 分钟';FMToast.ok(msg,{duration:6000})}
  try{if(window.Notification&&Notification.permission==='granted')new Notification('番茄钟完成',{body:pomoState.mode+' 分钟已结束'})}catch(e){}
  // 自动切换到休息/专注
  if(pomoState.mode===25||pomoState.mode===50){pomoState.mode=5;$$('.pomo-mode button').forEach(b=>b.classList.toggle('on',b.dataset.m==='5'))}else{pomoState.mode=25;$$('.pomo-mode button').forEach(b=>b.classList.toggle('on',b.dataset.m==='25'))}
  pomoState.remain=pomoState.mode*60;pomoDraw();
}
document.addEventListener('click',e=>{
  if(e.target.closest('#pomoB')){$('#pomoPnl').classList.toggle('on');return}
  const m=e.target.closest('.pomo-mode button');if(m){$$('.pomo-mode button').forEach(b=>b.classList.toggle('on',b===m));pomoState.mode=+m.dataset.m;pomoState.remain=pomoState.mode*60;pomoState.running=false;clearInterval(pomoTimer);const sb=$('#pomoStart');if(sb){sb.textContent='开始';sb.classList.add('pr')}pomoDraw()}
  if(e.target.id==='pomoStart'){pomoState.running?pomoPause():pomoStart()}
  if(e.target.id==='pomoReset')pomoReset();
});
// 首次启动时请求通知权限
if(window.Notification&&Notification.permission==='default'){document.addEventListener('click',function req(e){if(e.target.closest('#pomoB')){try{Notification.requestPermission()}catch(_){}document.removeEventListener('click',req)}},{once:false})}

/* --- 成长曲线 --- */
function renderGrowth(){
  const svg=$('#grSvg');if(!svg)return;
  const scs=(window.FMAnalytics&&FMAnalytics.getScores())||[];const u=uk();
  const mine=scs.filter(s=>s.user===u).sort((a,b)=>a.at-b.at);
  const ins=$('#grIns');const statBox=$('#grStats');
  if(mine.length<2){svg.innerHTML='<defs><linearGradient id="growthGrad"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs><text x="380" y="120" text-anchor="middle" font-size="14" fill="var(--text-muted)" font-family="var(--fb)">至少完成 2 次测验，曲线才会出现</text>';if(ins){ins.style.setProperty('--ins-bg','rgba(59,130,246,.12)');ins.style.setProperty('--ins-fg','var(--info)');ins.style.setProperty('--ins-br','rgba(59,130,246,.28)');ins.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg> 等待数据'}if(statBox)statBox.innerHTML='';return}
  const W=760,H=240,P={l:40,r:20,t:22,b:36};
  const cw=W-P.l-P.r,ch=H-P.t-P.b;
  const n=mine.length;const stepX=n>1?cw/(n-1):0;
  const pts=mine.map((s,i)=>{const x=P.l+i*stepX;const y=P.t+ch-(s.score/100)*ch;return[x,y,s]});
  // 网格
  let g='<defs><linearGradient id="growthGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#f97316"/></linearGradient><linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#14b8a6" stop-opacity=".35"/><stop offset="100%" stop-color="#14b8a6" stop-opacity="0"/></linearGradient></defs>';
  for(let i=0;i<=4;i++){const y=P.t+ch*i/4;const v=100-25*i;g+=`<line class="gr-grid" x1="${P.l}" y1="${y}" x2="${W-P.r}" y2="${y}"/><text class="gr-lab" x="${P.l-8}" y="${y+3}" text-anchor="end">${v}</text>`}
  // 平滑曲线 (Catmull-Rom to Bezier)
  function smooth(pts){if(pts.length<2)return '';let d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i];const p1=pts[i];const p2=pts[i+1];const p3=pts[i+2]||p2;const c1x=p1[0]+(p2[0]-p0[0])/6;const c1y=p1[1]+(p2[1]-p0[1])/6;const c2x=p2[0]-(p3[0]-p1[0])/6;const c2y=p2[1]-(p3[1]-p1[1])/6;d+=` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`}return d}
  const line=smooth(pts);
  const area=line+` L ${pts[pts.length-1][0].toFixed(1)} ${P.t+ch} L ${pts[0][0].toFixed(1)} ${P.t+ch} Z`;
  const dots=pts.map((p,i)=>{const s=p[2];const dt=new Date(s.at);const lab=`${s.module} · ${s.score}分 · ${(dt.getMonth()+1)}/${dt.getDate()}`;return `<circle class="gr-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5"><title>${esc(lab)}</title></circle>`}).join('');
  // 日期标签（每 ~5 个）
  const step=Math.max(1,Math.ceil(n/6));let labels='';for(let i=0;i<n;i+=step){const d=new Date(mine[i].at);labels+=`<text class="gr-lab" x="${(P.l+i*stepX).toFixed(1)}" y="${H-P.b+16}" text-anchor="middle">${d.getMonth()+1}/${d.getDate()}</text>`}
  svg.innerHTML=g+`<path class="gr-area" d="${area}"/><path class="gr-line" d="${line}"/>${dots}${labels}`;
  // 洞察
  const first=mine[0].score,last=mine[mine.length-1].score;
  const diff=last-first;const avg=Math.round(mine.reduce((a,r)=>a+r.score,0)/n);const max=Math.max.apply(null,mine.map(r=>r.score));
  if(ins){
    if(diff>0){ins.style.setProperty('--ins-bg','rgba(16,185,129,.12)');ins.style.setProperty('--ins-fg','var(--ok)');ins.style.setProperty('--ins-br','rgba(16,185,129,.28)');ins.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> 较首次 +'+diff+' 分'}
    else if(diff<0){ins.style.setProperty('--ins-bg','rgba(245,158,11,.12)');ins.style.setProperty('--ins-fg','var(--warn)');ins.style.setProperty('--ins-br','rgba(245,158,11,.28)');ins.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg> 较首次 '+diff+' 分 · 加油'}
    else{ins.style.setProperty('--ins-bg','rgba(59,130,246,.12)');ins.style.setProperty('--ins-fg','var(--info)');ins.style.setProperty('--ins-br','rgba(59,130,246,.28)');ins.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg> 保持稳定'}
  }
  if(statBox){
    const prev=mine[mine.length-2].score;const delta=last-prev;
    statBox.innerHTML=`<div class="it"><div class="n">${n}</div><div class="l">总测验</div></div>
      <div class="it"><div class="n">${avg}</div><div class="l">平均分</div></div>
      <div class="it"><div class="n">${max}</div><div class="l">最高分</div></div>
      <div class="it"><div class="n ${delta>0?'up':delta<0?'dn':''}">${delta>0?'+':''}${delta}</div><div class="l">较上次</div></div>`;
  }
}

/* --- 成就系统 --- */
const ACHIEVEMENTS=[
  {k:'first_login',n:'首次登录',d:'开启学习之旅',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',c:'#14b8a6',c2:'#0b6b57',chk:a=>a.visits>=1},
  {k:'first_quiz',n:'初次作答',d:'完成首次测验',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',c:'#f97316',c2:'#ea580c',chk:a=>a.quizzes>=1},
  {k:'quiz_10',n:'练习达人',d:'累计完成 10 次测验',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',c:'#f59e0b',c2:'#d97706',chk:a=>a.quizzes>=10},
  {k:'quiz_50',n:'百炼成钢',d:'累计完成 50 次测验',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',c:'#8b5cf6',c2:'#7c3aed',chk:a=>a.quizzes>=50},
  {k:'score_80',n:'优秀评价',d:'某次测验 ≥ 80 分',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',c:'#10b981',c2:'#059669',chk:a=>a.maxScore>=80},
  {k:'score_100',n:'完美满分',d:'某次测验拿到 100 分',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',c:'#fbbf24',c2:'#f59e0b',chk:a=>a.maxScore>=100},
  {k:'streak_3',n:'三日不辍',d:'连续打卡 3 天',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',c:'#ef4444',c2:'#dc2626',chk:a=>a.streak>=3},
  {k:'streak_7',n:'一周全勤',d:'连续打卡 7 天',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="3"/></svg>',c:'#f97316',c2:'#ea580c',chk:a=>a.streak>=7},
  {k:'mods_5',n:'博采众长',d:'涉猎 5 个不同模块',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',c:'#3b82f6',c2:'#2563eb',chk:a=>a.modules>=5},
  {k:'hour_5',n:'持之以恒',d:'累计学习 5 小时',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',c:'#14b8a6',c2:'#0b6b57',chk:a=>a.totalMin>=300},
  {k:'note_10',n:'笔耕不辍',d:'记录 10 条笔记',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',c:'#6366f1',c2:'#4f46e5',chk:a=>a.notes>=10},
  {k:'pomo_5',n:'专注之心',d:'完成 5 个番茄钟',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 8v5l3 2"/></svg>',c:'#ef4444',c2:'#dc2626',chk:a=>a.pomos>=5}
];
function achStats(){
  const u=uk();
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions()||[]).filter(s=>s.user===u);
  const scs=(window.FMAnalytics&&FMAnalytics.getScores()||[]).filter(s=>s.user===u);
  const prog=(window.FMAnalytics&&FMAnalytics.getProgress()||{})[u]||{};
  const notes=(LS.g('fm_notes',{})||{})[u]||[];
  const pomos=((LS.g(POMO_KEY,{records:[]})||{}).records||[]).filter(r=>r&&r.mode!==5).length;
  const visits=ses.length;
  const totalMin=Math.round(ses.reduce((a,s)=>a+(s.duration||0),0)/60000);
  const quizzes=scs.length;
  const maxScore=scs.length?Math.max.apply(null,scs.map(r=>r.score)):0;
  const modules=new Set([...scs.map(s=>s.module),...Object.keys(prog.modules||{})]).size;
  // streak
  const dSet=new Set();ses.forEach(s=>{const d=new Date(s.startedAt);d.setHours(0,0,0,0);dSet.add(d.getTime())});
  const sorted=Array.from(dSet).sort((a,b)=>a-b);
  let streak=0,curStk=0,prev=null;sorted.forEach(t=>{if(prev!=null&&t-prev===86400000){curStk++}else{curStk=1}streak=Math.max(streak,curStk);prev=t});
  return{visits,totalMin,quizzes,maxScore,modules,notes:notes.length,pomos,streak};
}
function renderAch(){
  const box=$('#achG');if(!box)return;const a=achStats();let cnt=0;
  box.innerHTML=ACHIEVEMENTS.map(ac=>{const done=!!ac.chk(a);if(done)cnt++;return `<div class="ach ${done?'on':'off'}" style="--ach-fg:${ac.c};--ach-fg2:${ac.c2};--ach-bg:${ac.c}22;--ach-br:${ac.c}48;--ach-sh:${ac.c}60"><div class="ach-ic">${ac.ic}</div><div class="ach-t">${esc(ac.n)}</div><div class="ach-d">${esc(ac.d)}</div>${!done?'<span class="ach-lk">🔒</span>':''}</div>`}).join('');
  $('#achCnt').textContent=cnt;$('#achTot').textContent=ACHIEVEMENTS.length;
}

/* --- 初始化 --- */
function initPhase3B(){
  try{
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    const b=$('#pomoB');if(b)b.hidden=false;
    pomoDraw();
    renderGrowth();renderAch();
    window.addEventListener('fm:activity',()=>{try{renderGrowth();renderAch()}catch(_){}});
  }catch(_){}
}
setTimeout(initPhase3B,600);
setInterval(()=>{try{if(document.visibilityState==='visible'&&window.FMSecurity&&FMSecurity.isAuthenticated()){renderAch()}}catch(_){}},90000);
})();

/* ============ Phase 3-C: 每周报告 / 本周目标 ============ */
(function(){
'use strict';
const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={g:(k,f)=>{try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==="object"&&!Array.isArray(f)&&(v===null||typeof v!=="object"||Array.isArray(v)))return f;return v}catch(e){return f}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function uk(){const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}
function fmt(m){if(m<60)return m+' 分';const h=m/60;return(h<10?h.toFixed(1):Math.round(h))+' 小时'}

/* --- 每周报告 --- */
function weekRange(){
  // 本周周一 0:00 到下一个周一 0:00
  const now=new Date();const d=new Date(now);d.setHours(0,0,0,0);
  const dow=d.getDay()===0?7:d.getDay();
  const monThis=new Date(d);monThis.setDate(d.getDate()-(dow-1));
  const monNext=new Date(monThis);monNext.setDate(monThis.getDate()+7);
  const monLast=new Date(monThis);monLast.setDate(monThis.getDate()-7);
  return{thisStart:monThis.getTime(),thisEnd:monNext.getTime(),lastStart:monLast.getTime(),lastEnd:monThis.getTime(),thisDate:monThis};
}
function renderWeekReport(){
  const u=uk();
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions()||[]).filter(s=>s.user===u);
  const scs=(window.FMAnalytics&&FMAnalytics.getScores()||[]).filter(s=>s.user===u);
  const r=weekRange();
  const thisSes=ses.filter(s=>s.startedAt>=r.thisStart&&s.startedAt<r.thisEnd);
  const lastSes=ses.filter(s=>s.startedAt>=r.lastStart&&s.startedAt<r.lastEnd);
  const thisScs=scs.filter(s=>s.at>=r.thisStart&&s.at<r.thisEnd);
  const lastScs=scs.filter(s=>s.at>=r.lastStart&&s.at<r.lastEnd);
  const thisMin=Math.round(thisSes.reduce((a,s)=>a+(s.duration||0),0)/60000);
  const lastMin=Math.round(lastSes.reduce((a,s)=>a+(s.duration||0),0)/60000);
  const thisDays=new Set(thisSes.map(s=>{const d=new Date(s.startedAt);d.setHours(0,0,0,0);return d.getTime()})).size;
  const lastDays=new Set(lastSes.map(s=>{const d=new Date(s.startedAt);d.setHours(0,0,0,0);return d.getTime()})).size;
  const thisAvg=thisScs.length?Math.round(thisScs.reduce((a,s)=>a+s.score,0)/thisScs.length):null;
  const lastAvg=lastScs.length?Math.round(lastScs.reduce((a,s)=>a+s.score,0)/lastScs.length):null;
  const rngEl=$('#wkRange');if(rngEl){const e=new Date(r.thisEnd-86400000);rngEl.textContent=(r.thisDate.getMonth()+1)+'月'+r.thisDate.getDate()+'日 — '+(e.getMonth()+1)+'月'+e.getDate()+'日'}
  const tag=$('#wkTag');
  const overall=thisMin-lastMin;
  if(tag){if(overall>0){tag.style.setProperty('--tag-bg','rgba(16,185,129,.12)');tag.style.setProperty('--tag-fg','var(--ok)');tag.style.setProperty('--tag-br','rgba(16,185,129,.28)');tag.textContent='↑ 比上周多学 '+(overall)+' 分钟'}else if(overall<0){tag.style.setProperty('--tag-bg','rgba(245,158,11,.12)');tag.style.setProperty('--tag-fg','var(--warn)');tag.style.setProperty('--tag-br','rgba(245,158,11,.28)');tag.textContent='↓ 比上周少学 '+Math.abs(overall)+' 分钟'}else{tag.style.setProperty('--tag-bg','rgba(59,130,246,.12)');tag.style.setProperty('--tag-fg','var(--info)');tag.style.setProperty('--tag-br','rgba(59,130,246,.28)');tag.textContent='持平上周'}}
  function delta(a,b){if(a==null&&b==null)return '';if(b==null)return '<small class="up">新</small>';const d=a-b;if(d>0)return '<small class="up">↑'+d+'</small>';if(d<0)return '<small class="dn">↓'+Math.abs(d)+'</small>';return ''}
  const grid=$('#wkGrid');
  if(grid){
    grid.innerHTML=`<div class="wk-it"><div class="n">${fmt(thisMin)} ${delta(thisMin,lastMin)}</div><div class="l">本周学习</div></div>
      <div class="wk-it"><div class="n">${thisDays} 天 ${delta(thisDays,lastDays)}</div><div class="l">活跃天数</div></div>
      <div class="wk-it"><div class="n">${thisScs.length} 次 ${delta(thisScs.length,lastScs.length)}</div><div class="l">完成测验</div></div>
      <div class="wk-it"><div class="n">${thisAvg!=null?thisAvg+'分':'—'} ${thisAvg!=null&&lastAvg!=null?delta(thisAvg,lastAvg):''}</div><div class="l">平均分</div></div>`;
  }
  // 生成洞察
  const ins=$('#wkIns');if(!ins)return;
  const insights=[];
  if(thisMin===0&&lastMin===0)insights.push('本周还没开始学习。把第一个番茄钟点起来，<em>25 分钟</em> 就好。');
  else if(thisMin>lastMin*1.3&&lastMin>0)insights.push('本周学习时间比上周多 <em>'+Math.round((thisMin/lastMin-1)*100)+'%</em>，势头很好。');
  else if(thisMin<lastMin*0.7&&lastMin>20)insights.push('这周节奏放缓了一些，设一个番茄钟找回状态吧。');
  if(thisDays>=5)insights.push('连续 <em>'+thisDays+'</em> 天学习 · 习惯开始养成。');
  else if(thisDays===1&&r.thisStart<Date.now()-86400000)insights.push('本周仅 <em>1</em> 天来过，加把劲。');
  if(thisAvg!=null&&lastAvg!=null&&thisAvg>lastAvg+5)insights.push('平均分提高了 <em>'+(thisAvg-lastAvg)+'</em> 分，状态在变好。');
  if(thisAvg!=null&&thisAvg>=85)insights.push('本周平均 <em>'+thisAvg+' 分</em>，已经进入优秀档。');
  else if(thisAvg!=null&&thisAvg<60)insights.push('本周平均 <em>'+thisAvg+' 分</em>，建议先过一遍知识点再练。');
  if(thisScs.length>lastScs.length+3)insights.push('做题量比上周多 <em>'+(thisScs.length-lastScs.length)+'</em> 次 · 熟练度在积累。');
  if(!insights.length)insights.push('保持这个节奏，下周继续。');
  ins.innerHTML='<strong>本周看点 · </strong>'+insights.slice(0,3).join(' ');
}

/* --- 本周目标 --- */
const GK='fm_goals_v1';
const GDEF={min:180,quiz:3,mod:5};
function getGoals(){const all=LS.g(GK,{})||{};return all[uk()]||{...GDEF}}
function saveGoals(g){const all=LS.g(GK,{})||{};all[uk()]=g;LS.s(GK,all)}
function renderGoals(){
  const L=$('#goalsL');if(!L)return;
  const g=getGoals();const u=uk();
  const r=weekRange();
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions()||[]).filter(s=>s.user===u&&s.startedAt>=r.thisStart&&s.startedAt<r.thisEnd);
  const scs=(window.FMAnalytics&&FMAnalytics.getScores()||[]).filter(s=>s.user===u&&s.at>=r.thisStart&&s.at<r.thisEnd);
  const thisMin=Math.round(ses.reduce((a,s)=>a+(s.duration||0),0)/60000);
  const visitedMods=new Set();ses.forEach(s=>(s.pages||[]).forEach(p=>{const m=(p.path||'').match(/modules\/([^.\/?#]+)/);if(m)visitedMods.add(m[1])}));
  const items=[
    {k:'min',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',n:'本周学习时长',cur:thisMin,goal:g.min,unit:'分钟',bg:'rgba(20,184,166,.12)',fg:'var(--tide-600)'},
    {k:'quiz',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',n:'完成测验次数',cur:scs.length,goal:g.quiz,unit:'次',bg:'rgba(249,115,22,.12)',fg:'var(--coral-600)'},
    {k:'mod',ic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',n:'涉猎不同模块',cur:visitedMods.size,goal:g.mod,unit:'个',bg:'rgba(59,130,246,.12)',fg:'var(--info)'}
  ];
  L.innerHTML=items.map(it=>{const pc=it.goal>0?Math.min(100,Math.round(it.cur/it.goal*100)):0;const done=pc>=100;return `<div class="goal-r" style="--goal-bg:${it.bg};--goal-fg:${it.fg}"><div class="ic">${it.ic}</div><div class="b"><strong>${esc(it.n)}</strong><div class="bar"><div class="bar-f" style="width:${pc}%"></div></div></div><div class="v">已完成 ${it.cur} ${it.unit}；目标 ${it.goal} ${it.unit}</div><div class="s ${done?'done':''}">${done?'已达成 ✓':pc+'%'}</div></div>`}).join('');
}
// 编辑目标
document.addEventListener('click',e=>{
  if(e.target.id==='goalsEdit'){const g=getGoals();$('#gMin').value=g.min;$('#gQuiz').value=g.quiz;$('#gMod').value=g.mod;$('#goalsIn').hidden=false;$('#goalsInAct').hidden=false}
  if(e.target.id==='goalsCancel'){$('#goalsIn').hidden=true;$('#goalsInAct').hidden=true}
  if(e.target.id==='goalsSave'){const g={min:Math.max(0,+$('#gMin').value||0),quiz:Math.max(0,+$('#gQuiz').value||0),mod:Math.max(0,+$('#gMod').value||0)};saveGoals(g);$('#goalsIn').hidden=true;$('#goalsInAct').hidden=true;renderGoals();if(window.FMToast)FMToast.ok('目标已保存')}
});

/* --- 初始化 --- */
function initPhase3C(){
  try{
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    renderWeekReport();renderGoals();
    window.addEventListener('fm:activity',()=>{try{renderWeekReport();renderGoals()}catch(_){}});
  }catch(_){}
}
setTimeout(initPhase3C,700);
setInterval(()=>{try{if(document.visibilityState==='visible'&&window.FMSecurity&&FMSecurity.isAuthenticated()){renderWeekReport();renderGoals()}}catch(_){}},120000);
})();

/* ============ Phase 4: 励志语 / 消息中心 / 学习路径 ============ */
(function(){
'use strict';
const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={g:(k,f)=>{try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==="object"&&!Array.isArray(f)&&(v===null||typeof v!=="object"||Array.isArray(v)))return f;return v}catch(e){return f}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function uk(){const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}

/* ---- 励志语（中英混合，理工+海洋学情怀） ---- */
const QUOTES=[
  {t:'物理学的本质是：用最少的假设，解释最多的现象。',a:'理查德 · 费曼'},
  {t:'海洋研究不是为了征服自然，而是为了更好地理解我们身处的系统。',a:'雅克 · 库斯托'},
  {t:'What we know is a drop, what we don\'t know is an ocean.',a:'艾萨克 · 牛顿'},
  {t:'湍流是经典物理中最后一个未解决的大问题。',a:'理查德 · 费曼'},
  {t:'数学是流体运动的语言，而观察是读它的眼睛。',a:'— 流体力学研究传统'},
  {t:'做学问最怕的不是错，而是不认真对待每一次错。',a:'— 学习心得'},
  {t:'在两个看似无关的概念之间找到联系，是理解的开始。',a:'亨利 · 庞加莱'},
  {t:'Everything should be made as simple as possible, but not simpler.',a:'阿尔伯特 · 爱因斯坦'},
  {t:'工程师解决问题，科学家提出问题。两者都离不开反复练习。',a:'— 学习格言'},
  {t:'流动中的秩序，来自看似混乱的无数偶然。',a:'— 海洋物理'},
  {t:'雷诺数告诉你何时该线性思考，何时该拥抱非线性。',a:'— 流体力学课堂'},
  {t:'The best way to predict the future is to invent it.',a:'艾伦 · 凯'},
  {t:'积跬步以至千里，积小流以成江海。',a:'荀子'},
  {t:'学而不思则罔，思而不学则殆。',a:'孔子'},
  {t:'业精于勤，荒于嬉；行成于思，毁于随。',a:'韩愈'},
  {t:'Success is walking from failure to failure with no loss of enthusiasm.',a:'温斯顿 · 丘吉尔'},
  {t:'一天练一小时，一年就是 365 小时。这就是复利。',a:'— 学习心得'},
  {t:'Simplicity is the ultimate sophistication.',a:'莱昂纳多 · 达芬奇'},
  {t:'海的深邃不在于它的水，而在于它承载的不确定。',a:'— 海洋学家笔记'},
  {t:'不要混淆"理解"和"记住"。前者需要时间，后者只需要重复。',a:'— 复习方法'},
  {t:'If you can\'t explain it simply, you don\'t understand it well enough.',a:'阿尔伯特 · 爱因斯坦'},
  {t:'每一条公式背后，都是一代又一代人对现象的追问。',a:'— 物理学史'},
  {t:'潮汐虽有涨落，学习不能间断。',a:'— 海大校训改编'},
  {t:'Practice isn\'t the thing you do once you\'re good. It\'s the thing you do that makes you good.',a:'马尔科姆 · 格拉德威尔'}
];
function todayQuote(){
  const d=new Date();const doy=Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);
  return QUOTES[doy%QUOTES.length];
}
function renderQuote(){
  const box=$('#quoteBox');if(!box)return;
  const q=todayQuote();
  $('#qText').textContent=q.t;$('#qAuthor').textContent=q.a;
  const d=new Date();
  $('#qDate').textContent=(d.getMonth()+1)+'月'+d.getDate()+'日';
}

/* ---- 消息中心 ---- */
const MSG_READ_KEY='fm_msg_read';
function getMsgs(){
  const u=uk();const readSet=new Set((LS.g(MSG_READ_KEY,{})||{})[u]||[]);
  const items=[];
  // 1. 教师公告
  const tAnns=(LS.g('fm_teacher_announcements',[])||[]).filter(a=>a.active&&(!a.expiresAt||a.expiresAt>Date.now()));
  tAnns.forEach(a=>{
    items.push({
      id:'ann_'+a.id,kind:'ann',lvl:a.level||'default',
      title:a.title,body:a.body||'',t:a.createdAt,
      from:a.author||'教师',read:readSet.has('ann_'+a.id)
    });
  });
  // 2. 系统消息：成就解锁
  const ses=(window.FMAnalytics&&FMAnalytics.getSessions()||[]).filter(s=>s.user===u);
  const scs=(window.FMAnalytics&&FMAnalytics.getScores()||[]).filter(s=>s.user===u);
  if(scs.length>=1){
    items.push({id:'s_first_quiz',kind:'sys',lvl:'default',title:'🎉 完成首次测验',body:'你完成了第一次测验 · 继续加油！',t:scs[0].at,from:'系统',read:readSet.has('s_first_quiz')});
  }
  if(scs.some(s=>s.score>=90)){
    const topS=scs.find(s=>s.score>=90);
    items.push({id:'s_high_'+topS.at,kind:'sys',lvl:'info',title:'🏅 高分达成',body:'《'+topS.module+'》拿到了 '+topS.score+' 分',t:topS.at,from:'系统',read:readSet.has('s_high_'+topS.at)});
  }
  if(ses.length>=3){
    items.push({id:'s_streak',kind:'sys',lvl:'default',title:'📚 坚持有成',body:'累计访问 '+ses.length+' 次 · 习惯在养成',t:ses[ses.length-1].startedAt,from:'系统',read:readSet.has('s_streak')});
  }
  // 3. 活动日志重要事件
  const log=LS.g('fm_activity_log',[])||[];
  const failLog=log.filter(l=>l.type==='login_fail'&&l.data&&l.data.user===u).slice(-3);
  if(failLog.length>=2){
    const last=failLog[failLog.length-1];
    items.push({id:'s_fail_'+last.t,kind:'sys',lvl:'warn',title:'🔒 登录失败记录',body:'近期有 '+failLog.length+' 次登录失败 · 如非本人请留意账号安全',t:last.t,from:'安全中心',read:readSet.has('s_fail_'+last.t)});
  }
  return items.sort((a,b)=>b.t-a.t).slice(0,30);
}
function renderMsgs(){
  const msgs=getMsgs();
  const unread=msgs.filter(m=>!m.read).length;
  const bdg=$('#bellBdg');if(bdg){bdg.textContent=unread>9?'9+':unread;bdg.hidden=unread===0}
  const L=$('#msgL');if(!L)return;
  if(!msgs.length){
    L.innerHTML='<div class="msg-emp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>还没有消息</div>';
    return;
  }
  const ICONS={ann:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',sys:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'};
  L.innerHTML=msgs.map(m=>{const dt=new Date(m.t);const tStr=(dt.getMonth()+1)+'/'+dt.getDate()+' '+String(dt.getHours()).padStart(2,'0')+':'+String(dt.getMinutes()).padStart(2,'0');return `<div class="msg-i ${m.read?'':'unread'}" data-id="${esc(m.id)}"><div class="ic ${m.lvl||''}">${ICONS[m.kind]||ICONS.sys}</div><div class="b"><strong>${esc(m.title)}</strong><p>${esc(m.body)}</p><div class="t">${esc(m.from)} · ${tStr}</div></div></div>`}).join('');
}
function markRead(id){
  const u=uk();const all=LS.g(MSG_READ_KEY,{})||{};if(!all[u])all[u]=[];if(!all[u].includes(id))all[u].push(id);LS.s(MSG_READ_KEY,all);renderMsgs();
}
function markAllRead(){
  const u=uk();const all=LS.g(MSG_READ_KEY,{})||{};all[u]=getMsgs().map(m=>m.id);LS.s(MSG_READ_KEY,all);renderMsgs();
}
	document.addEventListener('click',e=>{
	  if(e.target.closest('#bellBtn')){
	    const p=$('#msgPnl');const b=$('#bellBtn');const will=!(p&&p.classList.contains('on'));
	    if(p){p.classList.toggle('on',will);p.setAttribute('aria-hidden',will?'false':'true');if(will)setTimeout(()=>p.focus(),30)}
	    if(b)b.setAttribute('aria-expanded',will?'true':'false');
	    renderMsgs();return
	  }
	  const mi=e.target.closest('.msg-i');if(mi){markRead(mi.dataset.id);return}
	  if(e.target.id==='msgAllRead'){markAllRead();return}
	  if(!e.target.closest('.msg-pnl')&&!e.target.closest('#bellBtn')){const p=$('#msgPnl');if(p){p.classList.remove('on');p.setAttribute('aria-hidden','true')}const b=$('#bellBtn');if(b)b.setAttribute('aria-expanded','false')}
	});
document.addEventListener('keydown',e=>{
  if((e.key==='m'||e.key==='M')&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)){const b=$('#bellBtn');if(b&&!b.hidden){e.preventDefault();b.click()}}
});

/* ---- 学习路径节点图 ---- */
const PATH_NODES=[
  {k:'fluid-properties',keys:['fluid-properties','fluid-basics','流体的物理性质'],n:'第1章 物性',ic:'①',desc:'连续介质、密度、压缩性、黏度与表面张力',u:'/modules/knowledge-detail.html?query=流体的物理性质',p:'/modules/practice-dynamic.html?type=real&chapter=1&mode=normal&from=student-path',m:'/modules/simulated-exams-dynamic.html?chapter=1&from=student-path#questions'},
  {k:'fluid-dynamics',keys:['fluid-dynamics','streamline','理想流体流动'],n:'第2章 理想流',ic:'②',desc:'连续方程、Euler、Bernoulli',u:'/modules/fluid-dynamics-dynamic.html',p:'/modules/practice-dynamic.html?type=real&chapter=2&mode=normal&from=student-path',m:'/modules/simulated-exams-dynamic.html?chapter=2&from=student-path#questions'},
  {k:'energy-equation',keys:['energy-equation','momentum-equation','流体运动的基本方程组'],n:'第3章 控制体',ic:'③',desc:'雷诺输运、动量与能量方程',u:'/modules/energy-equation-dynamic.html',p:'/modules/practice-dynamic.html?type=real&chapter=3&mode=normal&from=student-path',m:'/modules/simulated-exams-dynamic.html?chapter=3&from=student-path#questions'},
  {k:'vorticity',keys:['vorticity','涡量','环量'],n:'第5章 涡量',ic:'④',desc:'涡量、环量与 Kelvin 定理',u:'/modules/vorticity-theory-dynamic.html',p:'/modules/practice-dynamic.html?type=real&chapter=5&mode=normal&from=student-path',m:'/modules/simulated-exams-dynamic.html?chapter=5&from=student-path#questions'},
  {k:'potential-flow',keys:['potential-flow','势流','复势'],n:'第6章 势流',ic:'⑤',desc:'速度势、流函数、复势与圆柱绕流',u:'/modules/potential-flow-dynamic.html',p:'/modules/practice-dynamic.html?type=real&chapter=6&mode=normal&from=student-path',m:'/modules/simulated-exams-dynamic.html?chapter=6&from=student-path#questions'},
  {k:'viscous-flow',keys:['viscous-flow','boundary-layer','粘性不可压缩流动'],n:'第8章 黏性',ic:'⑥',desc:'N-S 简化、相似、边界层与湍流',u:'/modules/viscous-flow-dynamic.html',p:'/modules/practice-dynamic.html?type=real&chapter=8&mode=normal&from=student-path',m:'/modules/simulated-exams-dynamic.html?chapter=8&from=student-path#questions'}
];
function pathMatchKeys(node){return (node.keys&&node.keys.length?node.keys:[node.k,node.n]).map(x=>String(x||'').toLowerCase())}
function renderChapterPracticeLinks(nodes){
  return '<div class="path-links" aria-label="六章全部真题练习入口与独立模拟章节题入口">'+nodes.map(n=>'<a href="'+esc(n.p||'/modules/real-exams-dynamic.html?edge_refresh=round390-server-stable-progress-181103-html-sync-20260618&from=round287-student-path')+'">'+esc(n.n)+'做全部真题练习</a><a href="'+esc(n.m||'/modules/simulated-exams-dynamic.html?from=student-path')+'">'+esc(n.n)+'模拟题（非真题）</a>').join('')+'<span class="path-note">模拟章节题来自教材主题启发，独立题包，不混入正式真题。</span></div>';
}
function renderPathNext(nodeStatus,doneCount,total){
  const box=$('#pathNext');if(!box)return;
  if(doneCount>=total){
    box.innerHTML='<strong>六章主线已完成。</strong> 下一步进入 <a href="/modules/real-exams-dynamic.html?edge_refresh=round390-server-stable-progress-181103-html-sync-20260618&from=round287-student-path-complete">历年真题</a> 做一套限时回顾。'+renderChapterPracticeLinks(nodeStatus);
    return;
  }
  const current=nodeStatus.find(n=>n.cur)||nodeStatus.find(n=>!n.done)||nodeStatus[0];
  const idx=nodeStatus.indexOf(current)+1;
  box.innerHTML='<strong>继续学习 '+idx+'/'+total+'：'+esc(current.n)+'</strong> · '+esc(current.desc)+'。<a href="'+esc(current.u||'/modules/knowledge-detail.html')+'">学本章</a> · <a href="'+esc(current.p||'/modules/real-exams-dynamic.html?from=student-path')+'">做全部真题练习</a>，做完后回这里进入下一章。'+renderChapterPracticeLinks(nodeStatus);
}
function renderPath(){
  const svg=$('#pathSvg');if(!svg)return;
  const u=uk();
  const prog=(window.FMAnalytics&&FMAnalytics.getProgress()||{})[u]||{modules:{}};
  const scs=(window.FMAnalytics&&FMAnalytics.getScores()||[]).filter(s=>s.user===u);
  // 模块完成度估算
  const nodeStatus=PATH_NODES.map(n=>{
    const keys=pathMatchKeys(n);
    const hasScore=scs.some(s=>keys.some(k=>(s.module||'').toLowerCase().includes(k))||(s.module||'').includes(n.n));
    const pct=prog.modules?Object.entries(prog.modules).filter(([k])=>keys.some(x=>String(k).toLowerCase().includes(x))).reduce((a,[_,v])=>Math.max(a,v),0):0;
    const done=hasScore||pct>=.9;
    return{...n,done,pct:done?1:pct};
  });
  // 第一个未完成的是当前
  let curIdx=nodeStatus.findIndex(n=>!n.done);if(curIdx<0)curIdx=nodeStatus.length-1;
  nodeStatus.forEach((n,i)=>{if(i===curIdx&&!n.done)n.cur=true});
  // 画线+节点
  const W=760,H=220;
  const n=PATH_NODES.length;
  const gap=(W-80)/(n-1);
  const pts=nodeStatus.map((node,i)=>({x:40+i*gap,y:H/2,...node}));
  let html='<defs><linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs>';
  // 线
  for(let i=0;i<pts.length-1;i++){
    const p1=pts[i],p2=pts[i+1];
    const cls=p1.done&&p2.done?'done':(p1.done||p2.cur||p1.cur?'cur':'');
    html+=`<path class="pn-link ${cls}" d="M ${p1.x} ${p1.y} Q ${(p1.x+p2.x)/2} ${p1.y-18} ${p2.x} ${p2.y}"/>`;
  }
  // 节点
  pts.forEach((p,i)=>{
    const cls=p.done?'done':(p.cur?'cur':'');
    html+=`<g class="pn-node" data-i="${i}"><circle class="pn-circle ${cls}" cx="${p.x}" cy="${p.y}" r="26"/><text class="pn-ico ${cls}" x="${p.x}" y="${p.y+6}" text-anchor="middle" font-size="16">${p.ic}</text><text class="pn-lab" x="${p.x}" y="${p.y-40}">${esc(p.n)}</text><text class="pn-pct" x="${p.x}" y="${p.y+48}">${p.done?'已掌握 ✓':p.cur?'进行中…':'未开始'}</text></g>`;
  });
  svg.innerHTML=html;
  const doneCount=nodeStatus.filter(n=>n.done).length;
  const pctEl=$('#pathPct');if(pctEl)pctEl.textContent='已完成 '+doneCount+' 章；共 '+n+' 章';
  renderPathNext(nodeStatus,doneCount,n);
}

function round273ReadJSON(key,fallback){
  try{
    const raw=localStorage.getItem(key);
    if(!raw)return fallback;
    const value=JSON.parse(raw);
    if(Array.isArray(fallback)&&!Array.isArray(value))return fallback;
    return value||fallback;
  }catch(_){return fallback}
}
function round273PathStatus(){
  const u=uk();
  const prog=(window.FMAnalytics&&FMAnalytics.getProgress&&FMAnalytics.getProgress()||{})[u]||{modules:{}};
  const scores=(window.FMAnalytics&&FMAnalytics.getScores&&FMAnalytics.getScores()||round273ReadJSON('fm_scores',[])).filter(s=>s&&s.user===u);
  const status=PATH_NODES.map(n=>{
    const keys=pathMatchKeys(n);
    const hasScore=scores.some(s=>keys.some(k=>(s.module||'').toLowerCase().includes(k))||(s.module||'').includes(n.n));
    const pct=prog.modules?Object.entries(prog.modules).filter(([k])=>keys.some(x=>String(k).toLowerCase().includes(x))).reduce((a,[_,v])=>Math.max(a,v),0):0;
    const done=hasScore||pct>=.9;
    return {...n,done,pct:done?1:pct};
  });
  let current=status.find(n=>!n.done)||status[status.length-1]||PATH_NODES[0];
  return {status,current,doneCount:status.filter(n=>n.done).length,total:status.length};
}
function renderRound273Radar(){
  const grid=$('#round273RadarGrid');if(!grid)return;
  try{
    const path=round273PathStatus();
    const u=uk();
    const sessions=(window.FMAnalytics&&FMAnalytics.getSessions&&FMAnalytics.getSessions()||round273ReadJSON('fm_sessions',[])).filter(s=>s&&s.user===u);
    const scores=(window.FMAnalytics&&FMAnalytics.getScores&&FMAnalytics.getScores()||round273ReadJSON('fm_scores',[])).filter(s=>s&&s.user===u);
    const wrong=round273ReadJSON('fm_wrong',{});
    const wrongList=Array.isArray(wrong[u])?wrong[u]:[];
    const lastScore=scores.length?scores[scores.length-1]:null;
    const next=path.current||PATH_NODES[0];
    const cards=[
      {
        step:'01',
        tag:'下一项练习',
        title:path.doneCount>=path.total?'做一套限时真题回顾':'继续 '+next.n,
        desc:path.doneCount>=path.total?'六章主线已走完，下一步用整套真题检查速度、单位和方向。':next.desc+'；先看题干条件，再做本章真题。',
        href:path.doneCount>=path.total?'/modules/real-exams-dynamic.html?from=round273-radar-complete':(next.p||'/modules/real-exams-dynamic.html?from=round273-radar'),
        meta:'已完成 '+path.doneCount+'/'+path.total+' 章'
      },
      {
        step:'02',
        tag:'公式适用回查',
        title:'先核边界和单位',
        desc:'定常、不可压、无损失、无旋、壁面条件和单位方向，少一项就先别套公式。',
        href:'/modules/knowledge-upgrade-2026.html#formula-condition-checklist',
        meta:'五步检查'
      },
      {
        step:'03',
        tag:'看资源补画面',
        title:'把控制体和流线看清',
        desc:sessions.length?'最近有 '+sessions.length+' 段学习记录，卡住时回资源中心看对应动画。':'记录还少，先用动画和课件补控制体画面。',
        href:'/resources.html?from=round273-radar',
        meta:'动画 / 课件 / 真题档案'
      },
      {
        step:'04',
        tag:'错因订正',
        title:wrongList.length?'先改 '+wrongList.length+' 道旧错题':'先留一条错因记录',
        desc:lastScore?'最近一次测验 '+Math.round(lastScore.score||0)+' 分；订正时写清错在条件、边界、单位还是方向。':'没有测验记录时，从题库练习开始，做完再回这里订正。',
        href:wrongList.length?'#tabsW':'/modules/question-bank.html?from=round273-radar',
        meta:wrongList.length?'错题本待处理':'建立回查线'
      }
    ];
    grid.innerHTML=cards.map(card=>
      '<a class="closure-card" data-round274-radar-step="'+esc(card.step)+'" href="'+esc(card.href)+'" aria-label="'+esc(card.step+' '+card.tag+'：'+card.title)+'">'+
        '<i aria-hidden="true">'+esc(card.step)+'</i>'+
        '<span>'+esc(card.tag)+'</span><b>'+esc(card.title)+'</b><em>'+esc(card.desc)+'</em><small>'+esc(card.meta)+'</small>'+
      '</a>'
    ).join('');
  }catch(e){console.warn('[round273-radar]',e)}
}

/* ---- 初始化 ---- */
function initPhase4(){
  try{
    renderRound273Radar();
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    renderQuote();renderPath();renderRound273Radar();renderMsgs();
    const b=$('#bellBtn');if(b)b.hidden=false;
    window.addEventListener('fm:activity',()=>{try{renderMsgs();renderPath();renderRound273Radar()}catch(_){}});
  }catch(_){}
}
setTimeout(initPhase4,750);
setInterval(()=>{try{if(document.visibilityState==='visible'&&window.FMSecurity&&FMSecurity.isAuthenticated()){renderMsgs();renderPath();renderRound273Radar()}}catch(_){}},60000);
})();

/* ══════════════════════════════════════════════════════════════
   ░  HOME INTERACTION JS  ░
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const $=s=>document.querySelector(s);const $$=s=>Array.from(document.querySelectorAll(s));
const prefersReduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;

/* --- 入场 splash --- */
(function splash(){
  const el=$('#splash');if(!el){document.documentElement.setAttribute('data-intro','0');return}
  // 已经看过的用户跳过
  const seen=sessionStorage.getItem('fm_splash_seen');
  if(seen||prefersReduce){el.remove();document.documentElement.setAttribute('data-intro','0');return}
  document.documentElement.setAttribute('data-intro','1');
  setTimeout(()=>{
    document.documentElement.setAttribute('data-intro','0');
  },300);
  setTimeout(()=>{el.remove();sessionStorage.setItem('fm_splash_seen','1')},1700);
})();

/* --- 顶部滚动进度条 --- */
(function progress(){
  const bar=$('#scPg');if(!bar)return;
  let ticking=false;
  function update(){
    const st=window.scrollY;
    const sh=document.documentElement.scrollHeight-innerHeight;
    const p=sh>0?Math.min(1,Math.max(0,st/sh)):0;
    bar.style.transform='scaleX('+p+')';
    ticking=false;
  }
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});
  update();
})();

/* --- 顶栏滚动状态 --- */
(function topBar(){
  const h=document.querySelector('header.top');if(!h)return;
  let ticking=false;
  function upd(){h.classList.toggle('scrolled',window.scrollY>12);ticking=false}
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(upd);ticking=true}},{passive:true});
  upd();
})();

/* --- 登录页流线生成：可视化的流体秩序 --- */
(function flowLines(){
  const svg=$('#pitchFlow');if(!svg)return;
  const g=svg.querySelector('.flow-lines');if(!g)return;
  // 生成 14 条流线：正弦叠加模拟海洋流场
  const lines=[];const W=600,H=800;
  for(let i=0;i<14;i++){
    const y0=40+i*55+(Math.random()-.5)*12;
    let d='M -20 '+y0.toFixed(0);
    const phase=i*.3,amp=18+Math.random()*16,freq=.012+Math.random()*.004;
    for(let x=0;x<=W+20;x+=12){
      const y=y0+Math.sin(x*freq+phase)*amp+Math.sin(x*freq*2.3+phase*.7)*amp*.35;
      d+=' L '+x+' '+y.toFixed(1);
    }
    lines.push('<path d="'+d+'" style="animation-delay:-'+(i*.4).toFixed(1)+'s"/>');
  }
  g.innerHTML=lines.join('');
})();
(function cursorGlow(){
  if(prefersReduce||!matchMedia('(pointer:fine)').matches)return;
  const g=$('#curGlow');if(!g)return;
  let tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty,raf=null;
  function loop(){
    cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;
    g.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';
    if(Math.abs(tx-cx)>.3||Math.abs(ty-cy)>.3)raf=requestAnimationFrame(loop);else raf=null;
  }
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.body.classList.add('cur-on');if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
  addEventListener('pointerleave',()=>document.body.classList.remove('cur-on'));
})();

/* --- Scroll reveal（替代旧的 .rv 立即显示逻辑） --- */
(function reveal(){
  if(prefersReduce||!('IntersectionObserver' in window)){$$('.rv,[data-rv]').forEach(el=>el.classList.add('in'));return}
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('in');
        io.unobserve(ent.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  function scan(){
    $$('.rv:not(.in),[data-rv]:not(.in)').forEach((el,i)=>{
      if(!el.style.getPropertyValue('--stg'))el.style.setProperty('--stg',Math.min(i%6,5));
      io.observe(el);
    });
  }
  scan();
  // DOM 变化时再扫一次
  const mo=new MutationObserver(()=>{clearTimeout(window._rvTo);window._rvTo=setTimeout(scan,200)});
  mo.observe(document.body,{childList:true,subtree:true});
})();

/* --- 所有 KPI、hero、greet、section 自动加 data-rv --- */
(function autoReveal(){
  const sels=['.greet','.hero','.pnl','.mod','.wk-rep','.goals','.growth','.path','.quote','.tabs-w','.ach','.kpi','.sec-t','.sec-s','.bullets li'];
  sels.forEach(s=>{$$(s).forEach(el=>{if(!el.hasAttribute('data-rv')&&!el.classList.contains('in'))el.setAttribute('data-rv','')})});
})();

/* --- Magnetic 按钮（鼠标靠近时轻微偏移） --- */
(function magnetic(){
  if(prefersReduce||!matchMedia('(pointer:fine)').matches)return;
  function attach(el){
    if(el._mag)return;el._mag=true;
    el.classList.add('btn-mag');
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const mx=e.clientX-r.left-r.width/2;
      const my=e.clientY-r.top-r.height/2;
      const s=.22;
      el.style.transform='translate('+(mx*s).toFixed(1)+'px,'+(my*s).toFixed(1)+'px)';
    });
    el.addEventListener('pointerleave',()=>{el.style.transform=''});
    // 也驱动 ::before 涟漪中心
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty('--rx',((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--ry',((e.clientY-r.top)/r.height*100)+'%');
    });
  }
  function scan(){$$('.btn-p, .btn-l, .btn-c, #loginBtn, #tBtn').forEach(attach)}
  scan();
  const mo=new MutationObserver(()=>{clearTimeout(window._mgTo);window._mgTo=setTimeout(scan,300)});
  mo.observe(document.body,{childList:true,subtree:true});
})();

/* --- 3D Tilt 卡片（鼠标悬停视差） --- */
(function tilt3D(){
  if(prefersReduce||!matchMedia('(pointer:fine)').matches)return;
  function attach(el){
    if(el._tilt)return;el._tilt=true;
    el.style.transformStyle='preserve-3d';
    const max=6;let raf=null,tx=0,ty=0;
    function apply(){
      el.style.transform='perspective(1000px) rotateX('+ty.toFixed(2)+'deg) rotateY('+tx.toFixed(2)+'deg) translateZ(0)';
      raf=null;
    }
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-.5;
      const py=(e.clientY-r.top)/r.height-.5;
      tx=px*max;ty=-py*max;
      if(!raf)raf=requestAnimationFrame(apply);
      // 光标光晕也跟着
      el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
    el.addEventListener('pointerleave',()=>{tx=0;ty=0;el.style.transform=''});
  }
  function scan(){$$('.kpi, .ach, .wk-it, .mod').forEach(attach)}
  scan();
  const mo=new MutationObserver(()=>{clearTimeout(window._tlTo);window._tlTo=setTimeout(scan,300)});
  mo.observe(document.body,{childList:true,subtree:true});
})();

/* --- 数字自动滚动（登录后 KPI 和统计数值） --- */
(function autoNumRoll(){
  if(!window.fmAnimNum||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target;
      const t=parseFloat(el.textContent);
      if(!isNaN(t)&&el.textContent.trim()===String(t)&&t>0&&t<10000){
        el.textContent='0';
        window.fmAnimNum(el,t,1100);
      }
      io.unobserve(el);
    });
  },{threshold:.6});
  setTimeout(()=>{
    $$('.metric .n,.greet .stat .v').forEach(el=>{
      if(/^\d+$/.test((el.textContent||'').trim()))io.observe(el);
    });
  },1200);
})();

/* --- 平滑锚点跳转（已由 CSS scroll-behavior:smooth 接管，这里增强） --- */
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a||a.getAttribute('href').length<2)return;
  const id=a.getAttribute('href').slice(1);
  const t=document.getElementById(id);
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#'+id)}
});

/* --- 输入时轻微高亮 label --- */
document.addEventListener('focusin',e=>{if(e.target.matches('.inp,textarea,select')){e.target.closest('.field')?.classList.add('focused')}});
document.addEventListener('focusout',e=>{if(e.target.matches('.inp,textarea,select')){e.target.closest('.field')?.classList.remove('focused')}});

/* --- 错误状态短暂震动 --- */
window.addEventListener('fm:login-failed',()=>{
  const f=$('#loginForm');if(!f)return;
  f.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:360,easing:'cubic-bezier(.36,.07,.19,.97)'});
});
})();

/* ══════════════════════════════════════════════════════════════
   账户菜单 + 今日推荐 v9
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const $=s=>{try{return document.querySelector(s)}catch(_){return null}};

/* --- 账户菜单 --- */
	function toggleAccPnl(force){
	  const p=$('#accPnl');if(!p)return;
	  const willOn=force===undefined?!p.classList.contains('on'):force;
	  p.classList.toggle('on',willOn);
	  p.setAttribute('aria-hidden',willOn?'false':'true');
	  const pill=$('#userPill');if(pill)pill.setAttribute('aria-expanded',willOn?'true':'false');
	  if(willOn)setTimeout(()=>p.focus(),30);
	}
document.addEventListener('click',e=>{
  const pill=e.target.closest&&e.target.closest('#userPill');
  if(pill){e.stopPropagation();toggleAccPnl();return}
  const p=$('#accPnl');
  if(!p||!p.classList.contains('on'))return;
  if(e.target.closest('#accPnl')){
    const it=e.target.closest('.acc-i');if(!it)return;
    const act=it.dataset.act;
    if(act==='theme'){const t=$('#themeT');if(t)t.click();toggleAccPnl(false);return}
    if(act==='cmd'){toggleAccPnl(false);setTimeout(()=>{const k=new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true});document.dispatchEvent(k)},100);return}
    if(act==='kbd'){const k=$('#kbdT');if(k)k.click();toggleAccPnl(false);return}
    if(act==='teacher'){location.href='/teacher-panel.html';toggleAccPnl(false);return}
    if(act==='logout'){
      if(confirm('确认退出登录？')){
        try{if(window.FMSecurity&&FMSecurity.clearSession)FMSecurity.clearSession('user')}catch(_){}
        location.href='/_edge-logout';
      }
      toggleAccPnl(false);return;
    }
    // 其他链接默认跳转后关闭
    setTimeout(()=>toggleAccPnl(false),300);
    return;
  }
  toggleAccPnl(false);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#accPnl')&&$('#accPnl').classList.contains('on'))toggleAccPnl(false)});

/* --- 今日推荐 spotlight --- */
function uk(){
  try{const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}catch(_){return '_anon'}
}
function loadJSON(k,f){try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;return v}catch(_){return f}}

const MODULE_LIST=[
  {k:'fluid-statics',n:'流体静力学',u:'/modules/fluid-statics-dynamic.html',ord:1},
  {k:'kinematics',n:'流体运动学',u:'/modules/knowledge-detail.html?query=流体运动学',ord:2},
  {k:'dynamics',n:'流体动力学',u:'/modules/fluid-dynamics-dynamic.html',ord:3},
  {k:'viscous',n:'粘性流动',u:'/modules/viscous-flow-dynamic.html',ord:4},
  {k:'boundary',n:'边界层',u:'/modules/boundary-layer-dynamic.html',ord:5},
  {k:'compress',n:'可压缩流',u:'/modules/knowledge-detail.html?query=可压缩流',ord:6},
  {k:'potential',n:'势流',u:'/modules/potential-flow-dynamic.html',ord:7},
  {k:'oceanography',n:'物理海洋学',u:'/modules/physical-oceanography-home.html',ord:8}
];

function renderSpotlight(){
  try{
    const u=uk();
    const ses=loadJSON('fm_sessions',[]).filter(s=>s&&s.user===u);
    const scs=loadJSON('fm_scores',[]).filter(s=>s&&s.user===u);
    const wrong=loadJSON('fm_wrong',{})||{};
    const wrongList=Array.isArray(wrong[u])?wrong[u]:[];

    // 按模块统计访问 + 平均分
    const modStats={};
    MODULE_LIST.forEach(m=>{modStats[m.k]={visits:0,scoreSum:0,scoreCnt:0}});
    ses.forEach(s=>{
      (s.pages||[]).forEach(p=>{
        const path=(p.path||'').toLowerCase();
        MODULE_LIST.forEach(m=>{if(path.includes(m.k))modStats[m.k].visits++});
      });
    });
    scs.forEach(s=>{
      MODULE_LIST.forEach(m=>{
        if((s.module||'').toLowerCase().includes(m.k)||(s.module||'').includes(m.n)){
          modStats[m.k].scoreSum+=s.score||0;modStats[m.k].scoreCnt++;
        }
      });
    });

    // 选下一步：优先未学的最早 ord，否则均分最低的
    const unlearned=MODULE_LIST.filter(m=>modStats[m.k].visits===0);
    let nextMod;let nextReason;
    if(unlearned.length){
      nextMod=unlearned[0];
      nextReason='第 '+nextMod.ord+' 章 · 你还没开始';
    }else{
      // 均分最低的
      const ranked=MODULE_LIST.map(m=>{
        const st=modStats[m.k];
        return{m:m,avg:st.scoreCnt>0?st.scoreSum/st.scoreCnt:100};
      }).sort((a,b)=>a.avg-b.avg);
      nextMod=ranked[0].m;
      const avg=Math.round(ranked[0].avg);
      nextReason=avg<60?'平均 '+avg+' 分 · 该巩固了':'最弱模块';
    }

    // 写入 spotlight 1（next）
    const t1=$('#spotNextTitle');const d1=$('#spotNextDesc');const m1=$('#spotNextMeta');const c1=$('#spotNextCta');
    if(t1)t1.textContent='继续学《'+nextMod.n+'》';
    if(d1){
      const reasons=['基于你的进度和测验数据，这是最该跟进的内容。'];
      if(modStats[nextMod.k].scoreCnt>0)reasons.push('该模块共做过 '+modStats[nextMod.k].scoreCnt+' 次测验。');
      d1.textContent=reasons.join(' ');
    }
    if(m1){
      m1.innerHTML='<span>📍 '+nextReason+'</span>'+(modStats[nextMod.k].visits>0?'<span>👁 已访问 '+modStats[nextMod.k].visits+' 次</span>':'<span>未访问章节</span>');
    }
    if(c1){c1.href=nextMod.u;c1.textContent='进入'+nextMod.n}

    // 写入 spotlight 2（review）
    const t2=$('#spotReviewTitle');const d2=$('#spotReviewDesc');const m2=$('#spotReviewMeta');const c2=$('#spotReviewCta');
    if(wrongList.length>0){
      if(t2)t2.textContent='错题本里有 '+wrongList.length+' 道题等你';
      if(d2)d2.textContent='间隔重练比直接做新题效率高 3 倍。错题里藏着真正的理解断层。';
      if(m2)m2.innerHTML='<span>❌ '+wrongList.length+' 道错题</span>'+(scs.length>0?'<span>📊 已做 '+scs.length+' 次测验</span>':'');
      if(c2){c2.textContent='查看错题本';c2.href='#tabsW'}
    }else if(scs.length>0){
      if(t2)t2.textContent='测验得分曲线';
      const avg=Math.round(scs.reduce((a,s)=>a+(s.score||0),0)/scs.length);
      if(d2)d2.textContent='你已完成 '+scs.length+' 次测验，平均 '+avg+' 分。趋势比单次更说明问题。';
      if(m2)m2.innerHTML='<span>📈 平均 '+avg+' 分</span><span>🎯 '+scs.length+' 次测验</span>';
      if(c2){c2.textContent='查看曲线';c2.href='#growth'}
    }else{
      if(t2)t2.textContent='把错题变成会做的题';
      if(d2)d2.textContent='你的错题本；收藏；笔记保存在右下角"标签栏"。错题间隔重练，比新做 10 题更有效。';
      if(m2)m2.innerHTML='<span>📝 还没开始记录</span>';
      if(c2){c2.textContent='开始练习';c2.href='/modules/question-bank.html?from=spotlight-start'}
    }
  }catch(e){console.warn('[spotlight]',e)}
}
function initSpot(){
  try{if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;renderSpotlight()}catch(_){}
}
setTimeout(initSpot,800);
window.addEventListener('fm:activity',()=>{try{renderSpotlight()}catch(_){}});
setInterval(()=>{try{if(document.visibilityState==='visible'&&window.FMSecurity&&FMSecurity.isAuthenticated())renderSpotlight()}catch(_){}},120000);
})();

/* ══════════════════════════════════════════════════════════════
   v11 · FMState 全局状态层 + 统一 ESC + 跨页面同步
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ---- FMState ---- */
const subs={};
const FMState={
  get(k,f){
    try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);return v}catch(_){return f}
  },
  set(k,v){
    try{
      localStorage.setItem(k,JSON.stringify(v));
      (subs[k]||[]).forEach(fn=>{try{fn(v)}catch(_){}});
      // 跨标签同步通知
      try{window.dispatchEvent(new CustomEvent('fm:state',{detail:{key:k,value:v}}))}catch(_){}
      return true;
    }catch(_){return false}
  },
  on(k,fn){
    if(!subs[k])subs[k]=[];
    subs[k].push(fn);
    return ()=>{subs[k]=subs[k].filter(x=>x!==fn)};
  },
  // 跨页面通信：任何页面 set 时其他页面收到 storage event
  init(){
    window.addEventListener('storage',e=>{
      if(!e.key||!e.key.startsWith('fm_'))return;
      try{
        const v=e.newValue?JSON.parse(e.newValue):null;
        (subs[e.key]||[]).forEach(fn=>{try{fn(v)}catch(_){}});
      }catch(_){}
    });
  }
};
FMState.init();
window.FMState=FMState;

/* ---- 统一 ESC 关闭所有面板 ---- */
const PANELS=[
  {sel:'#cmdk',cls:'on',label:'命令面板'},
  {sel:'#accPnl',cls:'on',label:'账户菜单'},
  {sel:'#msgPnl',cls:'on',label:'消息中心'},
  {sel:'#pomoPnl',cls:'on',label:'番茄钟'},
  {sel:'#kbdPnl',cls:'on',label:'快捷键'},
  {sel:'.drw.on',cls:'on',label:'抽屉'}
];
function anyOpen(){
  return PANELS.some(p=>{const e=document.querySelector(p.sel);return e&&e.classList&&e.classList.contains(p.cls)});
}
function syncBodyState(){
  document.body.classList.toggle('has-open-panel',anyOpen());
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    let closed=false;
    PANELS.forEach(p=>{
      const el=document.querySelector(p.sel);
      if(el&&el.classList&&el.classList.contains(p.cls)){
        el.classList.remove(p.cls);closed=true;
      }
    });
    if(closed)setTimeout(syncBodyState,50);
  }
});
// 监听任何 panel 状态变化
const obsBody=new MutationObserver(()=>setTimeout(syncBodyState,30));
PANELS.forEach(p=>{
  const el=document.querySelector(p.sel);
  if(el)obsBody.observe(el,{attributes:true,attributeFilter:['class']});
});

/* ---- 全局学习数据 reactive 同步：当某 key 变化时自动重渲 ---- */
['fm_scores','fm_sessions','fm_wrong','fm_favs'].forEach(k=>{
  FMState.on(k,()=>{
    try{window.dispatchEvent(new CustomEvent('fm:activity'))}catch(_){}
  });
});

/* ---- 数字面板小动画（hub-card 显示完成度） ---- */
(function fillHubStats(){
  setTimeout(()=>{
    try{
      const u=(()=>{try{const x=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return x?(x.username||x.name):'_'}catch(_){return '_'}})();
      const ses=FMState.get('fm_sessions',[]);if(!Array.isArray(ses))return;
      const scs=FMState.get('fm_scores',[]);if(!Array.isArray(scs))return;
      const myS=ses.filter(s=>s&&s.user===u);
      const myQ=scs.filter(s=>s&&s.user===u);
      // 题库练习：测验数量
      const card1=document.querySelector('.hub-card[data-tone="practice"]');
      if(card1&&myQ.length>0){
        const exist=card1.querySelector('.hub-stat-mini');
        if(!exist){
          const s=document.createElement('span');s.className='hub-stat-mini';s.textContent=myQ.length+' 次测验';
          card1.appendChild(s);card1.setAttribute('data-stat','1');
        }
      }
      // 知识点：访问过的章节数
      const card2=document.querySelector('.hub-card[data-tone="knowledge"]');
      if(card2){
        const visited=new Set();
        myS.forEach(s=>{(s.pages||[]).forEach(p=>{if((p.path||'').includes('knowledge'))visited.add(p.path)})});
        if(visited.size>0){
          const exist=card2.querySelector('.hub-stat-mini');
          if(!exist){
            const s=document.createElement('span');s.className='hub-stat-mini';s.textContent=visited.size+' 个章节';
            card2.appendChild(s);card2.setAttribute('data-stat','1');
          }
        }
      }
    }catch(_){}
  },1200);
})();

})();

/* ══════════════════════════════════════════════════════════════
   v10 · 学习进度环 + 段落导航 scrollspy + 焦点条
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const $=s=>{try{return document.querySelector(s)}catch(_){return null}};
const $$=s=>{try{return Array.prototype.slice.call(document.querySelectorAll(s))}catch(_){return []}};

function uk(){try{const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}catch(_){return '_anon'}}
function loadJSON(k,f){try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;return v}catch(_){return f}}

/* --- 学习进度环：按访问过的模块数 / 总模块数 计算 --- */
const ALL_MODS=['fluid-statics','kinematics','dynamics','viscous','boundary','compress','potential','oceanography'];
const MOD_NAMES={'fluid-statics':'流体静力学','kinematics':'运动学','dynamics':'动力学','viscous':'粘性流动','boundary':'边界层','compress':'可压缩流','potential':'势流','oceanography':'物理海洋学'};

function calcProgress(){
  try{
    const u=uk();
    const ses=loadJSON('fm_sessions',[]).filter(s=>s&&s.user===u);
    const scs=loadJSON('fm_scores',[]).filter(s=>s&&s.user===u);
    const visited=new Set();
    ses.forEach(s=>{
      (s.pages||[]).forEach(p=>{
        const path=(p.path||'').toLowerCase();
        ALL_MODS.forEach(m=>{if(path.includes(m))visited.add(m)});
      });
    });
    scs.forEach(s=>{
      ALL_MODS.forEach(m=>{
        const sm=(s.module||'').toLowerCase();
        if(sm.includes(m)||sm.includes(MOD_NAMES[m]))visited.add(m);
      });
    });
    const pct=Math.round(visited.size/ALL_MODS.length*100);
    const avg=scs.length?Math.round(scs.reduce((a,s)=>a+(s.score||0),0)/scs.length):null;
    return {pct,visited:visited.size,total:ALL_MODS.length,quizzes:scs.length,avgScore:avg};
  }catch(_){return {pct:0,visited:0,total:8,quizzes:0,avgScore:null}}
}

function renderGauge(){
  try{
    const p=calcProgress();
    // 进度环：周长 = 2 * π * r = 2 * π * 54 ≈ 339.292
    const dasharray=339.292;
    const offset=dasharray*(1-p.pct/100);
    const fill=$('#gaugeFill');if(fill)fill.style.strokeDashoffset=offset;
    const pctEl=$('#gaugePct');if(pctEl)pctEl.innerHTML=p.pct+'<sup>%</sup>';
    const mods=$('#gMods');if(mods)mods.textContent=p.visited;
    const qz=$('#gQz');if(qz)qz.textContent=p.quizzes;
    const avg=$('#gAvg');if(avg)avg.textContent=p.avgScore!=null?p.avgScore:'—';
    return p;
  }catch(_){return null}
}

/* --- 焦点条：根据数据动态显示 --- */
function renderFocus(){
  try{
    const fb=$('#focusBar');if(!fb)return;
    const p=calcProgress();
    const u=uk();
    const wrong=loadJSON('fm_wrong',{})||{};
    const wrongList=Array.isArray(wrong[u])?wrong[u]:[];
    const goals=loadJSON('fm_goals_v1',{})||{};
    const myGoals=goals[u]||{min:0,quiz:0,mod:0};

    const tEl=$('#focusTitle'),dEl=$('#focusDesc'),cEl=$('#focusCta');
    let title,desc,cta,href;

    if(p.visited===0){
      title='欢迎来到流体力学学习';
      desc='从「流体静力学」开始你的旅程，最多 3 步就能进入核心知识。';
      cta='开始第 1 章';href='/modules/fluid-statics-dynamic.html';
    }else if(wrongList.length>=5){
      title='你有 '+wrongList.length+' 道错题等回顾';
      desc='间隔重练比直接做新题效率高 3 倍。先把错题清掉，再开新章节更高效。';
      cta='查看错题本';href='#tabsW';
    }else if(p.quizzes===0){
      title='做一次测验，校准学习节奏';
      desc='你已经访问 '+p.visited+' 个模块。做一次测验能清晰看到自己掌握程度。';
      cta='进入题库';href='/modules/question-bank.html?from=focus-card';
    }else if(p.avgScore!=null&&p.avgScore<60){
      title='平均 '+p.avgScore+' 分 · 该回炉了';
      desc='当前测验平均分偏低。建议先复习薄弱环节，再做新题。';
      cta='查看错题';href='#tabsW';
    }else if(p.visited<p.total){
      const next=ALL_MODS.find(m=>!loadJSON('fm_sessions',[]).some(s=>(s.pages||[]).some(p=>(p.path||'').toLowerCase().includes(m))));
      const nm=MOD_NAMES[next]||'下一章节';
      title='继续学《'+nm+'》';
      desc='你已学 '+p.visited+'/'+p.total+' 个模块，正确率 '+(p.avgScore||0)+' 分。保持节奏，下一章见。';
      cta='进入'+nm;href='/modules/'+next+'-dynamic.html';
    }else{
      title='8 大模块全部访问 ✓';
      desc='你已经访问了所有核心模块。现在开始系统复习与真题精练吧。';
      cta='做真题';href='/modules/real-exams-dynamic.html';
    }
    if(tEl)tEl.textContent=title;
    if(dEl)dEl.textContent=desc;
    if(cEl){cEl.textContent=cta;cEl.href=href}
    fb.style.display='';
  }catch(_){}
}

/* --- 段落导航 scrollspy --- */
(function subnav(){
  if(!('IntersectionObserver' in window))return;
  const items=$$('.subnav-i');
  const map={};items.forEach(it=>{const k=it.dataset.sec;if(k)map[k]=it});
  const targets=Object.keys(map).map(k=>{
    const map2={tasks:'sec-tasks',report:'sec-report',goals:'sec-goals',growth:'sec-growth',path:'sec-path',modules:'sec-modules'};
    const id=map2[k];if(!id)return null;
    const el=document.getElementById(id);if(!el)return null;
    return {key:k,el:el};
  }).filter(Boolean);
  if(!targets.length)return;

  const visible=new Set();
  const io=new IntersectionObserver(ents=>{
    ents.forEach(e=>{
      const k=e.target.dataset.subnavKey;
      if(e.isIntersecting)visible.add(k);else visible.delete(k);
    });
    // 高亮第一个可见
    items.forEach(i=>i.classList.remove('on'));
    for(const t of targets){
      if(visible.has(t.key)){map[t.key].classList.add('on');break}
    }
  },{rootMargin:'-100px 0px -55% 0px'});
  targets.forEach(t=>{t.el.dataset.subnavKey=t.key;io.observe(t.el)});

  // 平滑滚动
  items.forEach(it=>{
    it.addEventListener('click',e=>{
      const href=it.getAttribute('href');if(!href||!href.startsWith('#'))return;
      e.preventDefault();
      const id=href.slice(1);const el=document.getElementById(id);
      if(el){const y=el.getBoundingClientRect().top+window.scrollY-130;window.scrollTo({top:y,behavior:'smooth'})}
    });
  });
})();

/* --- 入口 --- */
function initV10(){
  try{
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    renderGauge();
    renderFocus();
  }catch(_){}
}
setTimeout(initV10,900);
window.addEventListener('fm:activity',()=>{try{renderGauge();renderFocus()}catch(_){}});
setInterval(()=>{try{if(document.visibilityState==='visible'&&window.FMSecurity&&FMSecurity.isAuthenticated()){renderGauge();renderFocus()}}catch(_){}},120000);
})();

/* ══════════════════════════════════════════════════════════════
   FMStore · 统一学习数据中心 v11
   架构强化：所有 UI 组件从这里取数据，缓存 1.5s
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const ALL_MODS=[
  {k:'fluid-statics',n:'流体静力学',u:'/modules/fluid-statics-dynamic.html',ord:1,disc:'classical'},
  {k:'kinematics',n:'流体运动学',u:'/modules/knowledge-detail.html?query=流体运动学',ord:2,disc:'classical'},
  {k:'dynamics',n:'流体动力学',u:'/modules/fluid-dynamics-dynamic.html',ord:3,disc:'classical'},
  {k:'viscous',n:'粘性流动',u:'/modules/viscous-flow-dynamic.html',ord:4,disc:'advanced'},
  {k:'boundary',n:'边界层',u:'/modules/boundary-layer-dynamic.html',ord:5,disc:'advanced'},
  {k:'compress',n:'可压缩流',u:'/modules/knowledge-detail.html?query=可压缩流',ord:6,disc:'advanced'},
  {k:'potential',n:'势流',u:'/modules/potential-flow-dynamic.html',ord:7,disc:'advanced'},
  {k:'oceanography',n:'物理海洋学',u:'/modules/physical-oceanography-home.html',ord:8,disc:'ocean'}
];

function uk(){try{const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}catch(_){return '_anon'}}
function loadJSON(k,f){try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==='object'&&!Array.isArray(f)&&(v===null||typeof v!=='object'||Array.isArray(v)))return f;return v}catch(_){return f}}

let _cache=null;let _cacheT=0;const TTL=1500;
function getStore(force){
  const now=Date.now();
  if(!force&&_cache&&now-_cacheT<TTL)return _cache;
  try{
    const u=uk();
    const ses=loadJSON('fm_sessions',[]).filter(s=>s&&s.user===u);
    const scs=loadJSON('fm_scores',[]).filter(s=>s&&s.user===u);
    const wrong=loadJSON('fm_wrong',{})||{};
    const favs=loadJSON('fm_favs',{})||{};
    const notes=loadJSON('fm_notes',{})||{};
    const pomo=loadJSON('fm_pomo_v2',{})||{};
    const goals=loadJSON('fm_goals_v1',{})||{};
    const visited=new Set();
    const modScores={};
    ALL_MODS.forEach(m=>{modScores[m.k]={sum:0,cnt:0}});
    ses.forEach(s=>{(s.pages||[]).forEach(p=>{const path=(p.path||'').toLowerCase();ALL_MODS.forEach(m=>{if(path.includes(m.k))visited.add(m.k)})})});
    scs.forEach(s=>{
      const sm=(s.module||'').toLowerCase();
      ALL_MODS.forEach(m=>{
        if(sm.includes(m.k)||sm.includes(m.n)){
          modScores[m.k].sum+=s.score||0;modScores[m.k].cnt++;visited.add(m.k);
        }
      });
    });
    const avgScore=scs.length?Math.round(scs.reduce((a,s)=>a+(s.score||0),0)/scs.length):null;
    const wk=Date.now()-7*86400000;
    const recentScores=scs.filter(s=>s.at>wk);
    const modList=ALL_MODS.map(m=>{
      const ms=modScores[m.k];
      return Object.assign({},m,{visited:visited.has(m.k),avg:ms.cnt?Math.round(ms.sum/ms.cnt):null,quizzes:ms.cnt});
    });
    const weakest=modList.filter(m=>m.avg!=null).sort((a,b)=>a.avg-b.avg)[0]||null;
    const next=modList.find(m=>!m.visited)||weakest||modList[0];
    const wrongList=Array.isArray(wrong[u])?wrong[u]:[];
    const favList=Array.isArray(favs[u])?favs[u]:[];
    const noteList=Array.isArray(notes[u])?notes[u]:[];
    const pomoR=Array.isArray(pomo.records)?pomo.records:[];
    const today=new Date();today.setHours(0,0,0,0);
    const todayPomos=pomoR.filter(r=>r&&r.at>=today.getTime()&&r.mode!==5).length;
    _cache={
      user:u,modules:modList,visitedCount:visited.size,totalModules:ALL_MODS.length,
      progressPct:Math.round(visited.size/ALL_MODS.length*100),
      sessions:ses.length,quizzes:scs.length,avgScore:avgScore,recentQuizzes:recentScores.length,
      weakest:weakest,next:next,
      wrongCount:wrongList.length,favCount:favList.length,noteCount:noteList.length,
      todayPomos:todayPomos,goals:goals[u]||{min:180,quiz:3,mod:5}
    };
    _cacheT=now;
  }catch(e){
    _cache={user:'_anon',modules:ALL_MODS.map(m=>Object.assign({},m,{visited:false,avg:null,quizzes:0})),visitedCount:0,totalModules:8,progressPct:0,sessions:0,quizzes:0,avgScore:null,recentQuizzes:0,weakest:null,next:ALL_MODS[0],wrongCount:0,favCount:0,noteCount:0,todayPomos:0,goals:{min:180,quiz:3,mod:5}};
    _cacheT=now;
  }
  return _cache;
}
function clearCache(){_cache=null;_cacheT=0}
window.FMStore={get:getStore,refresh:function(){clearCache();return getStore(true)},modules:ALL_MODS};
window.addEventListener('fm:activity',clearCache);
window.addEventListener('fm:store-update',clearCache);
})();

/* ══════════════════════════════════════════════════════════════
   v11 · 配色主题 + 镜面光 + 微动效
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const $=s=>{try{return document.querySelector(s)}catch(_){return null}};
const $$=s=>{try{return Array.prototype.slice.call(document.querySelectorAll(s))}catch(_){return []}};

/* --- mood 切换 --- */
function getMood(){try{return localStorage.getItem('fm_mood')||'ocean'}catch(_){return 'ocean'}}
function applyMood(m){
  document.documentElement.setAttribute('data-mood',m);
  $$('#moodRow .mood-dot').forEach(d=>d.classList.toggle('on',d.dataset.m===m));
  try{localStorage.setItem('fm_mood',m)}catch(_){}
}
applyMood(getMood());
document.addEventListener('click',e=>{
  const dot=e.target.closest&&e.target.closest('.mood-dot');
  if(!dot||!dot.dataset.m)return;
  applyMood(dot.dataset.m);
  if(window.FMToast)FMToast.ok('已切换配色 · '+({ocean:'海洋',sunset:'日落',aurora:'极光',violet:'紫罗兰',rosegold:'玫瑰金'}[dot.dataset.m]));
});

/* --- 镜面光 reflect（hub 卡 mouse-aware） --- */
function ensureReflect(){
  $$('.hub-card').forEach(c=>{
    if(c.querySelector('.reflect'))return;
    const r=document.createElement('div');r.className='reflect';
    c.insertBefore(r,c.firstChild);
  });
}
ensureReflect();
setTimeout(ensureReflect,800);
document.addEventListener('pointermove',e=>{
  const c=e.target.closest&&e.target.closest('.hub-card');
  if(!c)return;
  const rect=c.getBoundingClientRect();
  c.style.setProperty('--mx',((e.clientX-rect.left)/rect.width*100)+'%');
  c.style.setProperty('--my',((e.clientY-rect.top)/rect.height*100)+'%');
},{passive:true});

})();

/* ══════════════════════════════════════════════════════════════
   v13 · PWA 离线 + 数据导出/导入 + 离线状态指示
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const $=s=>{try{return document.querySelector(s)}catch(_){return null}};

/* ---- 1. Service Worker 已禁用 ---- */
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.getRegistrations()
      .then(registrations=>Promise.all(registrations.map(registration=>registration.unregister())))
      .catch(()=>{});
  });
}

/* ---- 2. 离线状态指示 ---- */
const offBar=document.createElement('div');
offBar.className='off-bar';
offBar.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>离线模式 · 部分功能可用';
document.body.appendChild(offBar);

function syncOnline(){
  if(navigator.onLine){
    offBar.classList.remove('on');
  }else{
    offBar.classList.add('on');
  }
}
window.addEventListener('online',syncOnline);
window.addEventListener('offline',syncOnline);
syncOnline();

/* ---- 3. 数据导出/导入（带签名校验） ---- */
const FM_KEYS=['fm_session_v2','fm_auth_session_v2','fluidMechanicsUser','fm_sessions','fm_scores','fm_learning_data_v2','fm_activity_log','fm_theme','fm_pomo_v2','fm_goals_v1','fm_msg_read','fm_notes','fm_wrong','fm_favs','fm_resources','fm_video_progress','fm_kn_progress'];

async function sha256(text){
  try{
    const enc=new TextEncoder().encode(text);
    const buf=await crypto.subtle.digest('SHA-256',enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }catch(_){return 'no-hash'}
}

async function exportData(){
  try{
    const data={};
    FM_KEYS.forEach(k=>{
      try{const v=localStorage.getItem(k);if(v!==null)data[k]=v}catch(_){}
    });
    const payload={
      v:1,
      exportedAt:new Date().toISOString(),
      app:'fluid-mechanics-platform',
      data:data
    };
    const json=JSON.stringify(payload);
    const sig=await sha256(json);
    const out={...payload,sig};
    const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const ts=new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
    a.href=url;a.download='fm-backup-'+ts+'.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    try{window.FMToast&&FMToast.ok('已导出 '+Object.keys(data).length+' 项数据')}catch(_){}
  }catch(err){
    try{window.FMToast&&FMToast.err('导出失败：'+err.message)}catch(_){}
  }
}

async function importData(file){
  try{
    const text=await file.text();
    const payload=JSON.parse(text);
    if(!payload||!payload.data||payload.app!=='fluid-mechanics-platform'){
      throw new Error('不是有效的备份文件');
    }
    // 校验签名
    if(payload.sig){
      const {sig,...rest}=payload;
      const json=JSON.stringify(rest);
      const calculated=await sha256(json);
      if(calculated!==sig){
        if(!confirm('⚠️ 备份文件签名校验失败（可能被篡改）。是否仍要导入？')){return}
      }
    }
    if(!confirm('将合并 '+Object.keys(payload.data).length+' 项数据到本地。是否继续？\n\n注意：现有同名数据会被覆盖。')){return}
    let count=0;
    Object.entries(payload.data).forEach(([k,v])=>{
      if(FM_KEYS.includes(k)){
        try{localStorage.setItem(k,v);count++}catch(_){}
      }
    });
    try{window.FMToast&&FMToast.ok('已导入 '+count+' 项数据，刷新页面查看效果')}catch(_){}
    setTimeout(()=>location.reload(),1500);
  }catch(err){
    try{window.FMToast&&FMToast.err('导入失败：'+err.message)}catch(_){}
  }
}

window.FMSync={export:exportData,import:importData};

/* ---- 4. 在账户菜单加导出/导入入口 ---- */
function injectAccMenu(){
  const accL=document.querySelector('.acc-l');if(!accL)return;
  if(accL.querySelector('[data-act="export"]'))return;
  const sep=document.createElement('div');sep.className='acc-sep';
  const exp=document.createElement('button');exp.type='button';exp.className='acc-i';exp.dataset.act='export';
  exp.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>导出我的学习数据';
  const imp=document.createElement('button');imp.type='button';imp.className='acc-i';imp.dataset.act='import';
  imp.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>从备份导入';
  // 插入到退出登录之前
  const logout=accL.querySelector('[data-act="logout"]');
  if(logout){
    accL.insertBefore(sep,logout.previousElementSibling||logout);
    accL.insertBefore(exp,logout.previousElementSibling||logout);
    accL.insertBefore(imp,logout);
  }
}
setTimeout(injectAccMenu,1500);

document.addEventListener('click',e=>{
  const it=e.target.closest&&e.target.closest('.acc-i');if(!it)return;
  if(it.dataset.act==='export'){
    e.preventDefault();
    exportData();
    const p=document.getElementById('accPnl');if(p)p.classList.remove('on');
  }else if(it.dataset.act==='import'){
    e.preventDefault();
    const inp=document.createElement('input');
    inp.type='file';inp.accept='.json,application/json';
    inp.onchange=ev=>{const f=ev.target.files[0];if(f)importData(f)};
    inp.click();
    const p=document.getElementById('accPnl');if(p)p.classList.remove('on');
  }
});

/* ---- 5. PWA 安装提示（仅当浏览器支持） ---- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  // 添加"安装到桌面"按钮
  setTimeout(()=>{
    const accL=document.querySelector('.acc-l');if(!accL)return;
    if(accL.querySelector('[data-act="install"]'))return;
    const inst=document.createElement('button');inst.type='button';inst.className='acc-i';inst.dataset.act='install';
    inst.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>安装到桌面';
    accL.insertBefore(inst,accL.firstChild);
    inst.addEventListener('click',async ev=>{
      ev.preventDefault();
      if(!deferredPrompt)return;
      deferredPrompt.prompt();
      const choice=await deferredPrompt.userChoice;
      if(choice.outcome==='accepted'){
        try{window.FMToast&&FMToast.ok('已添加到桌面')}catch(_){}
      }
      deferredPrompt=null;
      inst.remove();
    });
  },1800);
});

window.addEventListener('appinstalled',()=>{
  deferredPrompt=null;
  try{window.FMToast&&FMToast.ok('安装成功，可以从桌面打开')}catch(_){}
});

})();

/* ══════════════════════════════════════════════════════════════
   v14 · Constellation+ · 间隔重复 SM-2 + 学习日志时间线
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const $=s=>{try{return document.querySelector(s)}catch(_){return null}};

function uk(){try{const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}catch(_){return '_anon'}}
function LS(k,f){try{const x=localStorage.getItem(k);if(!x)return f;const v=JSON.parse(x);if(Array.isArray(f)&&!Array.isArray(v))return f;if(f&&typeof f==='object'&&!Array.isArray(f)&&(v===null||typeof v!=='object'||Array.isArray(v)))return f;return v}catch(_){return f}}
function LSS(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}}

/* ───────────────────────────────────────
   1. SuperMemo SM-2 间隔重复算法
   ───────────────────────────────────────
   每个错题/记忆项有：
   - ef (easiness factor): 难度因子 1.3 ~ 2.5
   - rep: 连续答对次数
   - ivl: 距离下次复习的天数
   - due: 下次复习的时间戳

   评级 q ∈ {0,1,2,3,4,5}：
     0-2 = 没记住 → rep=0, 重新开始
     3   = 记住但很难
     4   = 记住正常
     5   = 完美

   算法：
     if q < 3: rep = 0; ivl = 1
     else: rep++
       if rep == 1: ivl = 1
       elif rep == 2: ivl = 6
       else: ivl = round(prev_ivl * ef)
     ef = max(1.3, ef + (0.1 - (5-q)*(0.08 + (5-q)*0.02)))
*/
window.FMSpacedRep={
  // 应用 SM-2 计算下次复习
  apply(item,q){
    if(!item)return null;
    item=Object.assign({ef:2.5,rep:0,ivl:0},item);
    q=Math.max(0,Math.min(5,Number(q)||0));
    if(q<3){item.rep=0;item.ivl=1}
    else{
      item.rep=(item.rep||0)+1;
      if(item.rep===1)item.ivl=1;
      else if(item.rep===2)item.ivl=6;
      else item.ivl=Math.round((item.ivl||1)*item.ef);
    }
    item.ef=Math.max(1.3,(item.ef||2.5)+(0.1-(5-q)*(0.08+(5-q)*0.02)));
    item.lastReview=Date.now();
    item.due=Date.now()+item.ivl*86400000;
    item.reviews=(item.reviews||0)+1;
    return item;
  },
  // 查询今日待复习
  dueToday(){
    try{
      const u=uk();
      const all=LS('fm_wrong',{})||{};
      const list=Array.isArray(all[u])?all[u]:[];
      const now=Date.now();
      return list.filter(it=>it&&(!it.due||it.due<=now));
    }catch(_){return []}
  },
  // 查询未来 N 天的复习量分布
  forecast(days){
    try{
      const u=uk();
      const all=LS('fm_wrong',{})||{};
      const list=Array.isArray(all[u])?all[u]:[];
      const now=Date.now();
      const buckets=new Array(days||7).fill(0);
      list.forEach(it=>{
        if(!it||!it.due)return;
        const d=Math.floor((it.due-now)/86400000);
        if(d>=0&&d<buckets.length)buckets[d]++;
      });
      return buckets;
    }catch(_){return []}
  },
  // 标记复习结果
  rate(itemId,q){
    try{
      const u=uk();
      const all=LS('fm_wrong',{})||{};
      const list=Array.isArray(all[u])?all[u]:[];
      const idx=list.findIndex(x=>x&&x.id===itemId);
      if(idx<0)return false;
      list[idx]=Object.assign({},list[idx],FMSpacedRep.apply(list[idx],q));
      all[u]=list;
      LSS('fm_wrong',all);
      // 派发事件
      try{window.dispatchEvent(new CustomEvent('fm:activity'))}catch(_){}
      return true;
    }catch(_){return false}
  }
};

// 升级 fmAddWrong 加入 SM-2 初始字段
const _origAddWrong=window.fmAddWrong;
if(typeof _origAddWrong==='function'){
  window.fmAddWrong=function(o){
    const enriched=Object.assign({ef:2.5,rep:0,ivl:0,due:Date.now(),reviews:0},o||{});
    return _origAddWrong(enriched);
  };
}

/* ───────────────────────────────────────
   2. 学习日志（时间序列）
   ───────────────────────────────────────
   每个动作记一条：浏览页面 / 完成测验 / 标记错题 / 复习错题
*/
window.FMLog={
  add(action,payload){
    try{
      const u=uk();
      const all=LS('fm_log',{})||{};
      if(!Array.isArray(all[u]))all[u]=[];
      all[u].push({a:action,t:Date.now(),...payload||{}});
      // 最多保留 1000 条
      if(all[u].length>1000)all[u]=all[u].slice(-1000);
      LSS('fm_log',all);
      return true;
    }catch(_){return false}
  },
  recent(n){
    try{
      const u=uk();
      const all=LS('fm_log',{})||{};
      const list=Array.isArray(all[u])?all[u]:[];
      return list.slice(-(n||30)).reverse();
    }catch(_){return []}
  },
  // 获取按天统计的活动密度（最近 28 天）
  density(days){
    try{
      const u=uk();
      const all=LS('fm_log',{})||{};
      const list=Array.isArray(all[u])?all[u]:[];
      const now=new Date();now.setHours(0,0,0,0);
      const buckets=new Array(days||28).fill(0);
      list.forEach(e=>{
        if(!e||!e.t)return;
        const dayDiff=Math.floor((now.getTime()-e.t)/86400000);
        const idx=buckets.length-1-dayDiff;
        if(idx>=0&&idx<buckets.length)buckets[idx]++;
      });
      return buckets;
    }catch(_){return []}
  },
  clear(){const u=uk();const all=LS('fm_log',{})||{};delete all[u];LSS('fm_log',all)}
};

// 自动记录页面访问
try{
  if(window.FMSecurity&&FMSecurity.isAuthenticated()){
    setTimeout(()=>FMLog.add('view',{path:location.pathname,title:document.title}),500);
  }
}catch(_){}

/* ───────────────────────────────────────
   3. 间隔重复仪表盘 (UI 注入)
   ───────────────────────────────────────
*/
function buildSrPanel(){
  const tabsW=document.querySelector('.tabs-w');
  if(!tabsW)return;
  if(document.getElementById('srPanel'))return;

  const wrap=document.createElement('div');
  wrap.id='srPanel';wrap.className='sr-panel rv';
  wrap.dataset.rv='1';
  wrap.innerHTML='<div class="sr-hd">'+
    '<div class="sr-hd-l">'+
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'+
      '<div><h3>间隔重复 · 复习安排</h3><p>基于 SuperMemo SM-2 算法，按遗忘间隔排复习</p></div>'+
    '</div>'+
    '<div class="sr-stats" id="srStats"></div>'+
  '</div>'+
  '<div class="sr-forecast"><div class="sr-fc-l">未来 14 天复习量预测</div><div class="sr-fc-bars" id="srBars"></div></div>'+
  '<div class="sr-list" id="srList"></div>';
  tabsW.parentNode.insertBefore(wrap,tabsW);
}

function renderSrPanel(){
  try{
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    buildSrPanel();
    const due=window.FMSpacedRep.dueToday();
    const forecast=window.FMSpacedRep.forecast(14);
    const u=uk();
    const all=LS('fm_wrong',{})||{};
    const total=Array.isArray(all[u])?all[u].length:0;

    // stats（带 sparkline 迷你图，使用 FMChart）
    const st=$('#srStats');
    if(st){
      // 计算最近 7 天日活动密度作为 sparkline 数据
      const density7=window.FMLog?window.FMLog.density(7):[0,0,0,0,0,0,0];
      const sparkSvg=window.FMChart?window.FMChart.line(density7,{width:64,height:22,smooth:true,fill:true,dots:false,color:'var(--tide-500)',padding:{t:3,r:2,b:3,l:2}}):'';
      st.innerHTML=
        '<div class="sr-st"><b>'+due.length+'</b><span>今天待复习</span></div>'+
        '<div class="sr-st"><b>'+total+'</b><span>错题总数</span></div>'+
        '<div class="sr-st sr-st-spark"><div class="sr-st-l"><b>'+forecast.reduce((a,b)=>a+b,0)+'</b><span>14 天累计</span></div><div class="sr-st-spk" aria-hidden="true">'+sparkSvg+'</div></div>';
    }

    // forecast bars (使用 FMChart.bar)
    const bars=$('#srBars');
    if(bars){
      const today=new Date();
      const labels=forecast.map((n,i)=>{
        const d=new Date(today);d.setDate(d.getDate()+i);
        return (d.getMonth()+1)+'/'+d.getDate()+' · '+n+' 题';
      });
      if(window.FMChart){
        // 用 SDK 渲染主体柱形图
        const chartSvg=window.FMChart.bar(forecast,{
          width:560,height:90,
          color:'var(--tide-500)',color2:'var(--coral-500)',
          highlight:0,labels:labels,gap:4,radius:4
        });
        // 加上日期标签行（独立 div 不在 SVG 里方便适配）
        const dayRow=forecast.map((n,i)=>{
          const d=new Date(today);d.setDate(d.getDate()+i);
          return '<span class="sr-day'+(i===0?' on':'')+'">'+(i===0?'今':d.getDate())+'</span>';
        }).join('');
        bars.innerHTML='<div class="sr-bars-svg">'+chartSvg+'</div><div class="sr-days">'+dayRow+'</div>';
      }else{
        // fallback：原始手写实现
        const max=Math.max(1,...forecast);
        bars.innerHTML=forecast.map((n,i)=>{
          const d=new Date(today);d.setDate(d.getDate()+i);
          const pct=n/max*100;
          return '<div class="sr-bar" title="'+(d.getMonth()+1)+'/'+d.getDate()+' · '+n+' 题"><div class="sr-bar-f" style="height:'+pct+'%"></div><span class="sr-bar-l">'+(i===0?'今':d.getDate())+'</span><span class="sr-bar-n">'+(n>0?n:'')+'</span></div>';
        }).join('');
      }
    }

    // due list (最多 5 条)
    const list=$('#srList');
    if(list){
      if(!due.length){
        list.innerHTML='<div class="sr-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><strong>今天的复习已完成</strong><span>'+(total>0?'下次到期：明天':'尚未添加错题')+'</span></div>';
      }else{
        list.innerHTML='<div class="sr-list-h">'+due.length+' 道题等你复习</div>'+
        due.slice(0,5).map((it,i)=>{
          const mod=it.module||'未分类';
          const txt=(it.text||'(未填写题目内容)').slice(0,80);
          const ef=(it.ef||2.5).toFixed(1);
          return '<div class="sr-item"><div class="sr-it-tag">'+esc(mod)+'</div>'+
          '<div class="sr-it-txt">'+esc(txt)+'</div>'+
          '<div class="sr-it-rate" data-id="'+esc(it.id||'')+'">'+
            '<button data-q="0" title="完全忘了">😵</button>'+
            '<button data-q="2" title="想不起来">😣</button>'+
            '<button data-q="3" title="勉强记得">🤔</button>'+
            '<button data-q="4" title="顺利答对">😊</button>'+
            '<button data-q="5" title="完美记住">🎯</button>'+
          '</div>'+
          '<div class="sr-it-meta">EF '+ef+' · 复习 '+(it.reviews||0)+' 次</div></div>';
        }).join('')+(due.length>5?'<div class="sr-more">+ 还有 '+(due.length-5)+' 题</div>':'');
      }
    }
  }catch(_){}
}

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

// 评级点击
document.addEventListener('click',e=>{
  const btn=e.target.closest&&e.target.closest('.sr-it-rate button');
  if(!btn)return;
  const wrap=btn.closest('.sr-it-rate');
  const id=wrap.dataset.id;
  const q=parseInt(btn.dataset.q,10);
  if(!id||isNaN(q))return;
  // 动画反馈
  btn.style.transform='scale(1.4)';btn.style.transition='transform 220ms cubic-bezier(.34,1.56,.64,1)';
  setTimeout(()=>{btn.style.transform=''},240);
  if(window.FMSpacedRep.rate(id,q)){
    FMLog.add('review',{id:id,q:q});
    setTimeout(renderSrPanel,300);
    try{
      const labels=['回去重学吧 💪','再多看看 ✋','加油加油 🌱','棒 ✨','满分 🎯'];
      window.FMToast&&FMToast.ok(labels[Math.min(4,Math.floor(q*4/5))]||'已记录');
    }catch(_){}
  }
});

setTimeout(renderSrPanel,1500);
window.addEventListener('fm:activity',()=>{try{renderSrPanel()}catch(_){}});

/* ───────────────────────────────────────
   4. 学习日志时间线（精简版 · 仅在有日志时显示）
   ───────────────────────────────────────
*/
function buildTimeline(){
  if(document.getElementById('logTimeline'))return;
  const sr=document.getElementById('srPanel');if(!sr)return;
  const wrap=document.createElement('div');
  wrap.id='logTimeline';wrap.className='log-timeline rv';wrap.dataset.rv='1';
  wrap.innerHTML='<div class="log-hd"><h3>学习足迹 · 最近 28 天</h3><p>每个方块代表一天的活动量</p></div><div class="log-grid" id="logGrid"></div><div class="log-recent" id="logRecent"></div>';
  sr.parentNode.insertBefore(wrap,sr.nextSibling);
}

function renderTimeline(){
  try{
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    const recent=FMLog.recent(20);
    if(!recent.length)return;
    buildTimeline();

    const density=FMLog.density(28);
    const max=Math.max(1,...density);
    const today=new Date();
    const grid=$('#logGrid');
    if(grid){
      // 优先用 FMChart.heatmap（SDK 方式）
      if(window.FMChart&&window.FMChart.heatmap){
        const labels=density.map((n,i)=>{
          const d=new Date(today);d.setDate(d.getDate()-(density.length-1-i));
          return (d.getMonth()+1)+'/'+d.getDate()+' · '+n+' 次活动';
        });
        grid.innerHTML='<div class="log-grid-svg">'+window.FMChart.heatmap(density,{
          cols:28,cellSize:14,gap:3,levels:5,color:'#14b8a6',labels:labels
        })+'</div>';
      }else{
        // fallback
        grid.innerHTML=density.map((n,i)=>{
          const d=new Date(today);d.setDate(d.getDate()-(density.length-1-i));
          const intensity=n>0?Math.min(4,Math.ceil(n/max*4)):0;
          const label=(d.getMonth()+1)+'/'+d.getDate()+' · '+n+' 次活动';
          return '<div class="log-cell" data-l="'+intensity+'" title="'+label+'"></div>';
        }).join('');
      }
    }

    const list=$('#logRecent');
    if(list){
      const ICONS={view:'👁',quiz:'🎯',wrong:'❌',review:'🔄',fav:'⭐'};
      list.innerHTML=recent.slice(0,8).map(e=>{
        const dt=new Date(e.t);
        const t=Math.floor((Date.now()-e.t)/60000);
        const tStr=t<1?'刚刚':t<60?t+'分钟前':t<1440?Math.floor(t/60)+'小时前':Math.floor(t/1440)+'天前';
        let desc='';
        if(e.a==='view')desc='浏览了 '+(e.title||e.path||'页面');
        else if(e.a==='review'){const lab=['没记住','勉强','记住','顺利','完美'];desc='复习错题 · '+lab[Math.min(4,Math.floor((e.q||0)*4/5))]}
        else if(e.a==='quiz')desc='完成测验 '+(e.module||'')+' '+(e.score!=null?e.score+'分':'');
        else if(e.a==='wrong')desc='标记错题 · '+(e.module||'未分类');
        else desc=e.a;
        return '<div class="log-row"><span class="log-ic">'+(ICONS[e.a]||'•')+'</span><span class="log-desc">'+esc(desc)+'</span><span class="log-t">'+tStr+'</span></div>';
      }).join('');
    }
  }catch(_){}
}

setTimeout(renderTimeline,2000);
window.addEventListener('fm:activity',()=>{try{renderTimeline()}catch(_){}});

/* ───────────────────────────────────────
   v18 · 学习节奏 streak 徽章
   ─────────────────────────────────────── */
function renderStreak(){
  try{
    if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
    if(!window.FMLog||!window.FMLog.streak)return;
    const days=FMLog.streak();
    const pill=document.getElementById('streakPill');
    if(!pill)return;
    if(days>=2){
      pill.hidden=false;
      const num=document.getElementById('streakNum');
      if(num)num.textContent=days;
    }else{
      pill.hidden=true;
    }
  }catch(_){}
}
setTimeout(renderStreak,1200);
window.addEventListener('fm:activity',()=>{try{renderStreak()}catch(_){}});

/* ───────────────────────────────────────
   v15 · 键盘面板开关 + FMA11y 全站快捷键
   ─────────────────────────────────────── */
(function(){
  const k=document.getElementById('kbdPnl');
  if(!k)return;
  function open(){k.classList.add('on');k.setAttribute('aria-hidden','false');document.body.classList.add('has-open-panel')}
  function close(){k.classList.remove('on');k.setAttribute('aria-hidden','true');document.body.classList.remove('has-open-panel')}
  document.getElementById('kbdClose').addEventListener('click',close);
  k.addEventListener('click',e=>{if(e.target===k)close()});

  // 注册快捷键到 FMA11y（如已加载）
  function registerShortcuts(){
    if(!window.FMA11y)return;
    window.FMA11y.shortcut('?',()=>{
      if(k.classList.contains('on'))close();else open();
    },{description:'显示快捷键',scope:'global'});
    window.FMA11y.shortcut('shift+/',()=>{
      if(k.classList.contains('on'))close();else open();
    },{description:'显示快捷键',scope:'global'});
    // ESC 已经被全局 ESC 处理
  }
  if(window.FMA11y)registerShortcuts();
  else window.addEventListener('load',()=>{setTimeout(registerShortcuts,300)});

  // 兼容老的快捷键监听
  document.addEventListener('keydown',e=>{
    if(e.key==='?'&&!e.ctrlKey&&!e.metaKey){
      const tag=(e.target.tagName||'').toLowerCase();
      if(tag==='input'||tag==='textarea'||e.target.isContentEditable)return;
      e.preventDefault();
      if(k.classList.contains('on'))close();else open();
    }
    if(e.key==='Escape'&&k.classList.contains('on')){close()}
  });
})();

/* ══════════════════════════════════════════════════════════════
   v17 · 登录页 3D Parallax + 鼠标跟随光晕
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const pitch=document.getElementById('pitchBox');
if(!pitch)return;
const isTouch=window.matchMedia&&matchMedia('(hover:none),(pointer:coarse)').matches;
const reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
if(isTouch||reduced)return;

let raf=null;
let targetRX=0,targetRY=0,targetMX=50,targetMY=50;
let curRX=0,curRY=0,curMX=50,curMY=50;
const MAX_TILT=4;

function update(){
  curRX+=(targetRX-curRX)*0.12;
  curRY+=(targetRY-curRY)*0.12;
  curMX+=(targetMX-curMX)*0.18;
  curMY+=(targetMY-curMY)*0.18;
  pitch.style.setProperty('--rx',curRX.toFixed(2)+'deg');
  pitch.style.setProperty('--ry',curRY.toFixed(2)+'deg');
  pitch.style.setProperty('--mx',curMX.toFixed(1)+'%');
  pitch.style.setProperty('--my',curMY.toFixed(1)+'%');
  if(Math.abs(curRX-targetRX)>0.05||Math.abs(curRY-targetRY)>0.05||
     Math.abs(curMX-targetMX)>0.5||Math.abs(curMY-targetMY)>0.5){
    raf=requestAnimationFrame(update);
  }else{raf=null}
}
function onMove(e){
  const rect=pitch.getBoundingClientRect();
  const x=(e.clientX-rect.left)/rect.width;
  const y=(e.clientY-rect.top)/rect.height;
  targetRY=(x-0.5)*MAX_TILT*2;
  targetRX=-(y-0.5)*MAX_TILT*2;
  targetMX=x*100;targetMY=y*100;
  pitch.classList.add('tilted');
  pitch.style.setProperty('--mh','1');
  if(!raf)raf=requestAnimationFrame(update);
}
function onLeave(){
  targetRX=0;targetRY=0;
  pitch.classList.remove('tilted');
  pitch.style.setProperty('--mh','0');
  if(!raf)raf=requestAnimationFrame(update);
}
pitch.addEventListener('mousemove',onMove,{passive:true});
pitch.addEventListener('mouseleave',onLeave,{passive:true});

// v21 · 启动流体粒子动画（在 SDK 加载后）
function tryStartFluid(){
  if(!window.FMFluid){setTimeout(tryStartFluid,300);return}
  // 仅在登录页显示时启动
  const guest=document.getElementById('vGuest');
  if(!guest||guest.hidden)return;
  if(window.__pitchFluidInst)return;
  window.__pitchFluidInst=window.FMFluid.attach('#pitchFluid',{
    particleCount:90,
    hue:'mixed',
    speed:.9,
    trail:.04,
    particleSize:1.3
  });
}
setTimeout(tryStartFluid,500);
})();

/* ══════════════════════════════════════════════════════════════
   v18 · FMChart 演示应用 · 周报区每项加 sparkline 趋势
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const $=s=>{try{return document.querySelector(s)}catch(_){return null}};
function uk(){try{const u=window.FMSecurity&&FMSecurity.getUser&&FMSecurity.getUser();return u?(u.username||u.name):'_anon'}catch(_){return '_anon'}}

// 计算最近 6 周每周的数据
function compute6WeekTrend(){
  try{
    const u=uk();
    const ses=(window.FMAnalytics&&FMAnalytics.getSessions()||[]).filter(s=>s&&s.user===u);
    const scs=(window.FMAnalytics&&FMAnalytics.getScores()||[]).filter(s=>s&&s.user===u);
    const now=new Date();
    const day=now.getDay();
    const monday=new Date(now);monday.setDate(now.getDate()-(day===0?6:day-1));monday.setHours(0,0,0,0);
    const minutes=[],days=[],quizzes=[],avgs=[];
    for(let i=5;i>=0;i--){
      const ws=monday.getTime()-i*7*86400000;
      const we=ws+7*86400000;
      const wkSes=ses.filter(s=>s.startedAt>=ws&&s.startedAt<we);
      const wkScs=scs.filter(s=>s.at>=ws&&s.at<we);
      minutes.push(Math.round(wkSes.reduce((a,s)=>a+(s.duration||0),0)/60000));
      const dset=new Set(wkSes.map(s=>{const d=new Date(s.startedAt);d.setHours(0,0,0,0);return d.getTime()}));
      days.push(dset.size);
      quizzes.push(wkScs.length);
      avgs.push(wkScs.length?Math.round(wkScs.reduce((a,s)=>a+s.score,0)/wkScs.length):0);
    }
    return {minutes,days,quizzes,avgs};
  }catch(_){return {minutes:[],days:[],quizzes:[],avgs:[]}}
}

function injectSparklines(){
  if(!window.FMChart)return;
  const grid=$('#wkGrid');if(!grid)return;
  const t=compute6WeekTrend();
  const items=grid.querySelectorAll('.wk-it');
  if(items.length<4)return;
  const series=[
    {data:t.minutes,label:'最近 6 周学习时长'},
    {data:t.days,label:'最近 6 周活跃天数'},
    {data:t.quizzes,label:'最近 6 周测验次数'},
    {data:t.avgs.filter(x=>x>0),label:'最近 6 周平均分'}
  ];
  items.forEach((it,i)=>{
    if(!series[i]||!series[i].data.length)return;
    if(it.querySelector('.wk-spark'))return;
    const wrap=document.createElement('div');wrap.className='wk-spark';
    wrap.innerHTML=window.FMChart.sparkline(series[i].data,{
      width:120,height:28,
      smooth:true,fill:true,dots:false,
      strokeWidth:1.6,
      ariaLabel:series[i].label
    });
    it.appendChild(wrap);
  });
}

// 初次进入 + 每次活动后重新注入
function tryInject(){if(document.body.contains(document.getElementById('wkGrid')))injectSparklines()}
setTimeout(tryInject,2000);
setTimeout(tryInject,3500);
window.addEventListener('fm:activity',()=>{setTimeout(tryInject,200)});
})();

/* ══════════════════════════════════════════════════════════════
   v20 · 推导问答浮动按钮
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
function injectAiFab(){
  if(document.getElementById('fmAiFab'))return;
  if(!window.FMSecurity||!FMSecurity.isAuthenticated())return;
  const fab=document.createElement('button');
  fab.id='fmAiFab';
  fab.className='fm-ai-fab';
  fab.setAttribute('aria-label','流体力学推导问答');
  fab.title='流体力学推导问答 (Shift+A)';
  fab.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span class="fm-ai-fab-pulse"></span>';
  document.body.appendChild(fab);
  fab.addEventListener('click',()=>{
    if(window.FMAI)FMAI.openPanel();
    else if(window.FMUI)FMUI.warn('问答面板未加载');
  });
  // 注册快捷键
  if(window.FMA11y){
    FMA11y.shortcut('shift+a',()=>{if(window.FMAI)FMAI.openPanel()},{description:'推导问答 (Shift+A)'});
  }
}
function ensureAiFab(){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{setTimeout(injectAiFab,2000)});
  }else{
    setTimeout(injectAiFab,2000);
  }
}
ensureAiFab();
window.addEventListener('fm:activity',()=>{setTimeout(injectAiFab,200)});
})();

})();
