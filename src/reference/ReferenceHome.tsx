import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight, Code2, Download, GitFork, BriefcaseBusiness, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { projectCards, skills } from '../content';
import Globe from './WebGLGlobe';
import FooterParticles from './FooterParticles';
import methodMarkup from './method.html?raw';
import './captured.css';
import './faithful.css';

// Keep the captured subtree intact when the active phase updates.
const methodHTML = { __html: methodMarkup };

function skipIntro() { try { return sessionStorage.getItem('keith_reference_intro')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches||innerWidth<768; } catch { return true; } }
function ReferenceIntro({complete}:{complete:()=>void}) {
  const [progress,setProgress]=useState(0);
  useEffect(()=>{
    sessionStorage.setItem('keith_reference_intro','1');document.documentElement.dataset.referenceIntro='true';
    const start=performance.now();let frame=0,timer=0;
    const tick=(now:number)=>{const p=Math.min(1,(now-start)/4500);setProgress(Math.round((1-(1-p)**2)*100));if(p<1)frame=requestAnimationFrame(tick);else timer=window.setTimeout(complete,600)};
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')complete()};window.addEventListener('keydown',escape);frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);clearTimeout(timer);delete document.documentElement.dataset.referenceIntro;window.removeEventListener('keydown',escape)};
  },[complete]);
  return <div className="reference-intro" aria-label="Loading portfolio"><div className="reference-intro-count">{String(progress).padStart(3,'0')}<span>%</span></div><div className="reference-intro-phases">{['Discover','Diagnose','Design','Deliver','Evolve'].map((phase,i)=><span className={progress>=i*20?'complete':''} key={phase}><i/>{phase}</span>)}</div></div>;
}

function InkTransition({children}:{children:React.ReactNode[]}) {
  const next=useRef<HTMLDivElement>(null),ink=useRef<HTMLDivElement>(null);
  useEffect(()=>{let frame=0;const update=()=>{if(!next.current||!ink.current)return;const p=Math.max(0,Math.min(1,(innerHeight-next.current.getBoundingClientRect().top)/(innerHeight*1.25)));const scale=p<.02?p/.02*.18:.18+(p-.02)/.98*.82;ink.current.style.transform='scaleY('+scale+')'};const scroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)};window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)}},[]);
  return <div style={{position:'relative'}}><svg width="0" height="0" aria-hidden="true" style={{position:'absolute',pointerEvents:'none'}}><defs><filter id="ink-edge" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="220" xChannelSelector="R" yChannelSelector="G" result="displaced"/><feGaussianBlur in="displaced" stdDeviation="1.8" result="presmooth"/><feComponentTransfer in="presmooth" result="cut"><feFuncA type="discrete" tableValues="0 0 0 0 0 1 1 1 1 1"/></feComponentTransfer><feGaussianBlur in="cut" stdDeviation="0.4"/></filter></defs></svg><div style={{position:'relative'}}>{children[0]}<div aria-hidden="true" className="reference-ink-overlay"><div className="reference-ink-filter"><div ref={ink} className="reference-ink-fill"/></div></div></div><div ref={next} style={{position:'relative'}}>{children[1]}</div></div>;
}

function ReferenceStats() {
  return <div data-hero-stats="true" className="relative mx-auto mt-12 flex w-full flex-col items-center justify-center gap-6 px-4 sm:mt-20 sm:flex-row sm:gap-0 sm:px-0 reference-stats"><div className="reference-tech-marquee" aria-hidden="true"><div>{[0,1,2,3].map(copy=><span key={copy}>{skills.join(' · ')} · </span>)}</div></div><div className="relative z-10"><div className="reference-stats-copy flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-lg bg-bg px-6 py-3 font-mono text-label-l uppercase text-fg"><span>Building since 2026</span><i>·</i><span>6+ projects</span><i>·</i><span>Full stack</span><i>·</i><span className="reference-status-label"><span className="reference-pink-dot"/>Open to work</span></div><svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="spark-halo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter></defs><rect x="0" y="0" width="100%" height="100%" rx="8" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1" vectorEffect="non-scaling-stroke"/>{[0,1].map(i=><rect key={i} x="0" y="0" width="100%" height="100%" rx="8" fill="none" stroke="#f0f0f8" strokeWidth=".5" strokeLinecap="round" pathLength="100" strokeDasharray="7.5 92.5" vectorEffect="non-scaling-stroke" filter="url(#spark-halo)" className={i?'spark-trail-head spark-trail-mirror':'spark-trail-head'}/>)}</svg></div></div>;
}

function ReferenceMethod() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');const change = () => setReduced(media.matches);media.addEventListener('change',change);
    const root = ref.current;
    if(!root)return;
    const method = root.querySelector<HTMLElement>('[data-method]')!;
    const rail = root.querySelector<HTMLElement>('[data-method-rail]')!;
    const track = root.querySelector<HTMLElement>('[data-method-track]')!;
    const intro = root.querySelector<HTMLElement>('[data-method-intro]')!;
    const indicator = root.querySelector<HTMLElement>('[data-method-track] + div');
    const phases = [.25,.43,.59,.76,.92];
    const groups=Array.from(track.querySelectorAll<HTMLElement>('[data-method-slide]')).map((slide,index)=>{
      const name=slide.querySelector<HTMLElement>('[data-method-name]')!;const original=name.textContent||'';
      const visible=reduced||index===0;
      const chars=Array.from(original).map(character=>{const span=document.createElement('span');span.textContent=character;span.style.display='inline-block';span.style.opacity=visible?'1':'0';span.style.transform=visible?'translateY(0)':'translateY(24px)';return span});
      name.replaceChildren(...chars);name.style.opacity='1';
      const body=Array.from(slide.querySelectorAll<HTMLElement>('[data-method-tagline],[data-method-bullet]'));
      body.forEach(el=>{el.style.opacity=visible?'1':'0';el.style.transform=visible?'translateY(0)':'translateY(12px)'});
      return{name,original,chars,body,visible,animations:[] as Animation[]};
    });
    let frame = 0;
    const clamp = (x: number) => Math.max(0,Math.min(1,x));
    const update = () => {
      if(reduced) { method.style.height='auto';rail.dataset.reducedMotion='true';intro.style.opacity='1';track.style.transform='none';return; }
      delete rail.dataset.reducedMotion;
      method.style.height='600svh';rail.style.position='sticky';rail.style.top='0';
      const rect=method.getBoundingClientRect();const p=clamp(-rect.top/(method.offsetHeight-innerHeight));
      const incoming=clamp((innerHeight-rect.top)/(innerHeight*2));
      intro.style.opacity=String(incoming<.5?incoming*2:incoming<=.85?1:clamp((1-incoming)/.15));
      intro.style.transform=`scale(${.95+.05*clamp(incoming*2)})`;
      track.style.transform=`translateX(${(1-clamp((p-.2)/.8)*3.65)*innerWidth}px)`;
      const f=clamp((p-.5)/.5)**3;
      const r=Math.round(255-249*f),g=Math.round(255-247*f),b=Math.round(255-239*f);
      method.style.setProperty('--method-bg',`rgba(${r},${g},${b},${1-clamp((p-.95)/.05)})`);
      const shade=Math.round(23+(240-23)*f);method.style.setProperty('--method-fg',`rgb(${shade},${shade},${Math.round(23+(248-23)*f)})`);
      method.style.setProperty('--method-border',`rgba(${Math.round(255*f)},${Math.round(255*f)},${Math.round(255*f)},.1)`);
      let current=-1;phases.forEach((n,i)=>{if(p>=n)current=i});setActive(current);
      groups.forEach((group,index)=>{
        const visible=index===0||p>=phases[index];if(visible===group.visible)return;group.visible=visible;
        group.animations.forEach(animation=>animation.cancel());group.animations=[];
        const animate=(el:HTMLElement,delay:number,distance:number)=>{
          el.style.opacity=visible?'1':'0';el.style.transform=visible?'translateY(0)':`translateY(${distance}px)`;
          group.animations.push(el.animate(visible?[{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:`translateY(${distance}px)`}],{duration:visible?800:300,delay:visible?delay:0,easing:visible?'cubic-bezier(.16,1,.3,1)':'cubic-bezier(.55,.055,.675,.19)',fill:'backwards'}));
        };
        group.chars.forEach((el,i)=>animate(el,i*60,24));group.body.forEach((el,i)=>animate(el,i===0?150:300+(i-1)*80,12));
      });
      if(indicator){indicator.style.opacity=String(clamp((p-.15)/.1));indicator.style.position='absolute';indicator.style.transform='translateX(-50%)';indicator.style.bottom='32px';const labels=indicator.querySelectorAll<HTMLElement>('span');labels.forEach((label,i)=>label.style.opacity=i===current?'1':'.35')}
    };
    const scroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)};window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();
    return()=>{cancelAnimationFrame(frame);groups.forEach(group=>{group.animations.forEach(animation=>animation.cancel());group.name.textContent=group.original;group.name.style.opacity='';group.body.forEach(el=>{el.style.opacity='';el.style.transform=''})});media.removeEventListener('change',change);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)};
  },[reduced]);
  const go=(index:number)=>{const method=ref.current?.querySelector<HTMLElement>('[data-method]');if(!method)return;if(reduced){method.querySelector(`[data-method-slide="${index}"]`)?.scrollIntoView();return}window.scrollTo({top:scrollY+method.getBoundingClientRect().top+[.27,.45,.61,.78,.94][index]*(method.offsetHeight-innerHeight),behavior:'smooth'})};
  return <div className={`reference-method ${reduced?'is-reduced':''}`}><div ref={ref} dangerouslySetInnerHTML={methodHTML}/><div className="reference-phase-controls" aria-label="Development approach navigation">{['Discover','Diagnose','Design','Deliver','Evolve'].map((name,i)=><button key={name} onClick={()=>go(i)} aria-label={`Go to ${name}`} aria-current={active===i?'step':undefined}>{name}</button>)}</div></div>;
}

function ProjectsCarousel() {
  const ref=useRef<HTMLDivElement>(null);
  const [selected,setSelected]=useState<number|null>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,last=0,paused=false,down=false,start=0,left=0;
    const tick=(now:number)=>{if(last&&!paused&&!down&&!media.matches&&!document.hidden){el.scrollLeft+=(now-last)*.05;if(el.scrollLeft>=el.scrollWidth/2)el.scrollLeft-=el.scrollWidth/2}last=now;frame=requestAnimationFrame(tick)};
    const enter=()=>{paused=true};const leave=()=>{paused=false};
    const pointerdown=(e:PointerEvent)=>{if((e.target as HTMLElement).closest('a,button'))return;down=true;start=e.clientX;left=el.scrollLeft};
    const pointermove=(e:PointerEvent)=>{if(down)el.scrollLeft=left-(e.clientX-start)};const up=()=>{down=false};
    el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);el.addEventListener('focusin',enter);el.addEventListener('focusout',leave);el.addEventListener('pointerdown',pointerdown);window.addEventListener('pointermove',pointermove);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);el.removeEventListener('pointerenter',enter);el.removeEventListener('pointerleave',leave);el.removeEventListener('focusin',enter);el.removeEventListener('focusout',leave);el.removeEventListener('pointerdown',pointerdown);window.removeEventListener('pointermove',pointermove);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};
  },[]);
  return <div id="projects" data-hero-carousel="true" className="relative z-20 mt-12 w-full overflow-x-clip pt-8 pb-24 will-change-transform reference-carousel"><div ref={ref} className="reference-carousel-track" tabIndex={0} role="region" aria-label="Project screenshots and details">{[0,1].flatMap(copy=>projectCards.map((project,i)=><div className="shrink-0 px-3 py-4" key={`${copy}-${project.title}`} aria-hidden={copy===1?true:undefined} inert={copy===1?true:undefined}><article className="reference-project-card flex min-h-[220px] w-[400px] flex-col overflow-hidden rounded-[14px] border-hairline p-6 backdrop-blur-xl backdrop-saturate-150"><div className="flex items-center gap-2"><Code2 size={13} aria-hidden="true"/><p className="font-mono text-label-s uppercase text-fg/45">{project.category}</p></div>{project.image&&<img className="reference-project-image" src={project.image} alt={`${project.title} live website screenshot`} loading="lazy"/>}<h2 className="reference-project-title">{project.title}</h2><p className="reference-project-description font-mono text-body-sm font-light text-fg">{project.text}</p><button className="reference-read-more text-accent" onClick={()=>setSelected(i)} tabIndex={copy===1?-1:0}>View project <ArrowRight size={13} aria-hidden="true"/></button><div className="reference-project-caption"><span>{String(i+1).padStart(2,'0')}</span><span>Keith Kapfunde · {project.category}</span></div></article></div>))}</div><div className="reference-carousel-controls"><button onClick={()=>ref.current?.scrollBy({left:-450,behavior:'smooth'})} aria-label="Previous projects"><ArrowLeft size={16}/></button><Link to="/projects">All projects <ArrowUpRight size={13} aria-hidden="true"/></Link><button onClick={()=>ref.current?.scrollBy({left:450,behavior:'smooth'})} aria-label="Next projects"><ArrowRight size={16}/></button></div>{selected!==null&&<ProjectDialog index={selected} close={()=>setSelected(null)}/>}</div>;
}

function ProjectDialog({index,close}:{index:number;close:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);const project=projectCards[index];
  useEffect(()=>{const d=ref.current;d?.showModal();const prior=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=prior;d?.close()}},[]);
  return <dialog ref={ref} className="reference-project-dialog" aria-labelledby="project-dialog-title" onCancel={close} onClick={event=>{if(event.target===event.currentTarget)close()}}><button className="reference-dialog-close" aria-label="Close project" onClick={close}><X size={20}/></button>{project.image&&<img src={project.image} alt={`${project.title} website screenshot`}/>}<div className="reference-dialog-copy"><p className="text-label uppercase text-fg-muted">{project.category}</p><h2 id="project-dialog-title">{project.title}</h2><p>{project.text}</p>{project.url?<a className="pill" href={project.url} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16} aria-hidden="true"/></a>:<p className="text-label">Development project · No public demo supplied</p>}</div></dialog>;
}

function Audit() {
  const [idea,setIdea]=useState('');
  return <section data-section="2" className="relative isolate z-10 overflow-x-clip reference-audit"><div className="relative z-10 scroll-mt-24"><div className="relative px-4 pt-16 pb-20 sm:min-h-screen sm:px-6 sm:pt-20 sm:pb-24"><div className="relative z-10 flex flex-col items-center gap-6 text-center"><span className="font-mono text-label uppercase tracking-[0.28em] text-fg-muted">[ Your next idea ]</span><h2 className="font-display text-display-l font-extrabold text-fg">What are you building?</h2><p className="max-w-[480px] font-mono text-body text-fg">A portfolio, a website, a working product.<br/>Let’s turn the idea into something real.</p><div className="mt-2 flex items-center gap-3"><span className="reference-live"><span/> available</span><p className="font-mono text-body text-fg-muted">6 projects · always learning</p></div><form className="reference-idea-form" onSubmit={event=>{event.preventDefault();window.location.href=`mailto:keithmutsawanaku@gmail.com?subject=${encodeURIComponent('Let’s build something together')}&body=${encodeURIComponent(idea)}`}}><input aria-label="Describe your project idea" placeholder="Tell me about your idea..." value={idea} onChange={event=>setIdea(event.target.value)} required/><button aria-label="Open email with your project idea" disabled={!idea.trim()}><ArrowRight size={17}/></button></form><p className="reference-form-hint">Opens your email app.</p></div><div className="reference-orbit-tags">{skills.map((skill,i)=><button className="reference-keyword" key={skill} onClick={()=>setIdea('I would like to build a project using '+skill+'.')} style={{left:[12,88,15,80,28,60,45,90,8,73][i]+'%',top:[24,35,64,69,84,78,59,88,80,90][i]+'%','--i':i} as React.CSSProperties}>{skill}<ArrowUpRight size={12} aria-hidden="true"/></button>)}</div></div></div></section>;
}

export function ReferenceFooter() {
  return <footer id="contact" data-footer-section="true" className="relative overflow-hidden border-t-hairline-soft reference-footer"><FooterParticles/><div className="relative z-10"><div className="relative z-20 border-b-hairline-soft"><div className="reference-framework-marquee" aria-label="Discover, diagnose, design, deliver, evolve"><div>{[0,1].map(copy=><span key={copy} aria-hidden={copy===1}>discover · diagnose · design · deliver · <b>evolve</b> · </span>)}</div></div></div><div data-footer-comms="true"><section className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-12 sm:py-14 lg:py-16"><span className="font-mono text-label uppercase text-fg-muted">[ talk to me ]</span><div className="reference-comm-grid"><a href="mailto:keithmutsawanaku@gmail.com" className="reference-comm-card"><span className="reference-comm-icon"><Mail size={20} aria-hidden="true"/></span><span><b>email</b><small>write to me · keithmutsawanaku@gmail.com</small></span><ArrowRight size={17} aria-hidden="true"/></a><a href="https://wa.me/263778362164" target="_blank" rel="noreferrer" className="reference-comm-card"><span className="reference-comm-icon"><MessageCircle size={20} aria-hidden="true"/></span><span><b>whatsapp</b><small>let’s talk · +263 778 362 164</small></span><ArrowRight size={17} aria-hidden="true"/></a></div></section></div><section className="mx-auto flex max-w-[1400px] flex-col gap-8 border-t-hairline-soft px-6 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:gap-12 lg:pt-20 lg:pb-32"><span className="font-mono text-label uppercase text-fg-muted">[ The possibility ]</span><h2 className="reference-footer-phrase font-display text-display-xl font-extrabold text-fg">And every idea deserves to <span className="footer-phrase-accent">evolve<span className="reference-blob"/></span></h2></section><div className="border-t-hairline-soft"><section className="mx-auto flex max-w-[1400px] flex-col gap-5 px-6 py-12 sm:py-14"><span className="font-mono text-label uppercase text-fg-muted">[ follow ]</span><div className="reference-socials"><a className="pill" href="https://www.linkedin.com/in/keith-mutsawanaki-kapfunde-0a74243b1" target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} aria-hidden="true"/> linkedin</a><a className="pill" href="https://github.com/keithmutsawanaki" target="_blank" rel="noreferrer"><GitFork size={16} aria-hidden="true"/> github</a><a className="pill" href="tel:0778362164"><Phone size={16} aria-hidden="true"/> 0778 362 164</a><a className="pill" href="/Keith_Kapfunde_CV.pdf" download><Download size={16} aria-hidden="true"/> download cv</a></div></section></div><div className="border-t-hairline-soft"><section className="reference-footer-links mx-auto max-w-[1400px] px-6 py-12 sm:py-14"><div><span className="text-label uppercase text-fg-muted">Technologies</span><div>{skills.slice(0,6).map(skill=><span key={skill}>{skill}</span>)}</div></div><div><span className="text-label uppercase text-fg-muted">Portfolio</span><div><Link to="/projects">Projects</Link><Link to="/about">About</Link><a href="/#method">Method</a><Link to="/certifications">Certifications</Link><a href="#contact">Contact</a></div></div><div><span className="text-label uppercase text-fg-muted">Quick links</span><div><a href="/Keith_Kapfunde_CV.pdf" download>Download CV</a><a href="mailto:keithmutsawanaku@gmail.com">Email me</a><a href="https://wa.me/263778362164" target="_blank" rel="noreferrer">WhatsApp</a><Link to="/projects">Selected work</Link></div></div></section></div><div className="border-t-hairline-soft"><div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-6 reference-footer-strip"><span className="reference-live"><span/> full stack developer</span><span>2026 · 6 projects · always learning</span><span>Open to projects & collaborations</span></div></div><div className="border-t-hairline-soft"><div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-5 reference-footer-meta"><p>© {new Date().getFullYear()} Keith Kapfunde · built to evolve</p><Link to="/">Keith Mutsawanaki Kapfunde</Link></div></div></div></footer>;
}

export default function ReferenceHome() {
  const [ready,setReady]=useState(skipIntro);
  const complete=useCallback(()=>setReady(true),[]);
  return <div className="reference-home">{!ready&&<ReferenceIntro complete={complete}/>}<div className="reference-background" aria-hidden="true"/><main id="main-content"><InkTransition><section data-hero-section="true" className="relative flex flex-col pb-20 sm:pb-40"><Globe enabled={ready}/><div className="reference-hero-content relative z-10 flex flex-col"><div className="mx-auto w-full px-4 text-center"><h1 data-hero-title="true" className="font-display text-display-xl font-extrabold text-fg">Your tech partner. Evolved.</h1><p data-hero-sub="true" className="mx-auto mt-6 max-w-[560px] font-mono text-body font-light text-fg">I’m Keith Mutsawanaki Kapfunde. A full stack developer building practical digital solutions, from the frontend to the backend.</p></div><ReferenceStats/><ProjectsCarousel/></div></section><ReferenceMethod/></InkTransition><Audit/></main><ReferenceFooter/></div>;
}
