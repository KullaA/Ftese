import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import gsap from 'gsap';
import {wedding as w} from './config';
import {calendar} from './services';
import './style.css';

function Branch(){return <svg className="branch" viewBox="0 0 160 40" fill="none" aria-hidden="true"><path d="M8 31Q80 35 150 8M80 29Q68 6 48 10M104 22Q110 3 130 3" stroke="currentColor"/><g fill="currentColor">{[25,45,65,85,105,125].map((x,i)=><React.Fragment key={x}><ellipse cx={x} cy={31-i*3} rx="11" ry="3.8" transform={`rotate(-35 ${x} ${31-i*3})`}/><ellipse cx={x+9} cy={34-i*3} rx="10" ry="3.8" transform={`rotate(24 ${x+9} ${34-i*3})`}/></React.Fragment>)}</g></svg>}
function Art({name,alt='',className=''}:{name:keyof typeof w.assets,alt?:string,className?:string}){return <img className={`art ${className}`} src={w.assets[name]} alt={alt} width="600" height="600" loading={name==='hero'||name==='bow'||name==='floral'?'eager':'lazy'}/>}
function Section({id,eyebrow,title,children,className=''}:{id:string,eyebrow:string,title:string,children:React.ReactNode,className?:string}){return <section id={id} className={`section ${className}`}><div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><Branch/></div>{children}</section>}
function Countdown(){const [now,setNow]=useState(Date.now());useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);const s=Math.max(0,Math.floor((Date.parse(w.date)-now)/1000));return <div className="countdown" aria-label="Koha deri në dasmë">{[Math.floor(s/86400),Math.floor(s/3600)%24,Math.floor(s/60)%60,s%60].map((v,i)=><div key={i}><span>{String(v).padStart(2,'0')}</span><small>{['Ditë','Orë','Minuta','Sekonda'][i]}</small></div>)}</div>}
function App(){
 const [opened,setOpened]=useState(false);
 const [opening,setOpening]=useState(false);
 const openingStarted=useRef(false);
 const gate=useRef<HTMLDivElement>(null);
 const main=useRef<HTMLElement>(null);
 const animation=useRef<gsap.core.Timeline|null>(null);
 useEffect(()=>{const previous=document.body.style.overflow;if(!opened)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[opened]);
 useEffect(()=>()=>{animation.current?.kill()},[]);
 useEffect(()=>{if(!opened||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){gsap.fromTo(entry.target,{y:20},{y:0,duration:.8,ease:'power2.out',clearProps:'transform'});observer.unobserve(entry.target)}})},{threshold:.12});document.querySelectorAll('.section-heading,.venue-card').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[opened]);
 const open=()=>{
  if(openingStarted.current||opened)return;
  openingStarted.current=true;setOpening(true);
  const finish=()=>{setOpened(true);requestAnimationFrame(()=>main.current?.focus({preventScroll:true}))};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
  const select=gsap.utils.selector(gate);
  animation.current=gsap.timeline({onComplete:finish})
   .to(select('.seal'),{y:85,rotation:12,opacity:0,duration:.55})
   .to(select('.ribbon'),{y:150,scale:1.1,opacity:0,duration:.8},.2)
   .to(select('.panel-left'),{xPercent:-105,duration:1.35,ease:'power2.inOut'},.65)
   .to(select('.panel-right'),{xPercent:105,duration:1.35,ease:'power2.inOut'},.65)
   .to(select('.gate-copy, .gate-hint'),{opacity:0,duration:.3},0);
 };
 return <>{!opened&&<div className="gate" ref={gate}>
  <div className="gate-panel panel-left"><Art name="floral" className="gate-flower"/></div>
  <div className="gate-panel panel-right"><Art name="floral" className="gate-flower"/></div>
  <div className="gate-copy"><span className="eyebrow"></span><p>Një ftesë për ju</p></div>
  <div className="ribbon"><Art name="bow"/></div>
  <button className="seal" onClick={open} disabled={opening} aria-label="Hap ftesën e dasmës"><span>{w.names[0][0]}<span className="seal-and">&</span>{w.names[1][0]}</span><small>{w.displayDate}</small></button>
  <p className="gate-hint" role="status">{opening?'Një histori dashurie po hapet…':'Prekni vulën për ta hapur'}<span>{w.names.join(' & ').toUpperCase()}</span></p>
 </div>}
 <main ref={main} tabIndex={-1} inert={!opened} aria-hidden={!opened}>
 <header className="hero"><Art name="hero" className="hero-art"/><div className="hero-copy"><span className="eyebrow"></span><p className="hero-kicker"></p><h1>{w.names[0]}<span>&</span>{w.names[1]}</h1><Branch/><p className="hero-date">{w.displayDate}</p><p className="eyebrow">{w.city}</p><p className="hero-note"></p></div></header>
 <div className="invitation-note"><Branch/><p>Ka çaste që bëhen kujtime.<br/>Ka njerëz që i bëjnë ato të paharrueshme.</p><span className="eyebrow">JU FTOJMË TË JENI PJESË E DITËS SONË</span></div>
 <Section id="countdown" eyebrow="" title="Numërimi mbrapsht"><Countdown/><p className="soft-text"></p></Section>
 <Section id="venue" eyebrow="TAKOHEMI KËTU" title="Ku & kur" className="venue-section"><div className="venue-card"><Art name="venue" alt="Ambienti i sallës së dasmës"/><span className="eyebrow">NJË VEND PËR KUJTIME TË BUKURA</span><h3>{w.venue.name}</h3><p>{w.venue.address}</p><p className="soft-text">{w.venue.addressNote}</p><div className="venue-date"><span>{new Intl.DateTimeFormat('sq-AL',{day:'numeric',month:'long',year:'numeric',timeZone:w.timeZone}).format(new Date(w.date)).toUpperCase()}</span><i/> <span>ORA {new Intl.DateTimeFormat('sq-AL',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:w.timeZone}).format(new Date(w.date))}</span></div><div className="button-row"><a className="button" href={w.venue.mapUrl} target="_blank" rel="noreferrer">Hape në hartë</a><button className="button outline" onClick={calendar}>Shto në kalendar</button></div></div></Section>
 <footer><Art name="arch" alt="Hark dasme me lule të bardha dhe degë ulliri"/><p className="eyebrow">MEZI PRESIM TË FESTOJMË ME JU</p><p className="footer-names">{w.names.join(' & ')}</p><p className="hero-date">{w.displayDate}</p><Branch/><small>Me dashuri, për një fillim të bukur.</small></footer>
 </main></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);


