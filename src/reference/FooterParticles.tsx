import { useEffect, useRef } from 'react';

export default function FooterParticles() {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current;const context=canvas?.getContext('2d');const parent=canvas?.parentElement;if(!canvas||!context||!parent)return;
    const ctx=context;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const mobile=innerWidth<768;
    const count=mobile?1000:1800;let width=1,height=1,frame=0,rotation=0,visible=false,fallen=false,drag=false,lastX=0,moved=false;
    const pointer={x:-1e6,y:-1e6};
    const particles=Array.from({length:count},(_,i)=>({u:(Math.sin(i*17.17)*.5+.5)*Math.PI*2,v:(Math.sin(i*31.37+2)*.5+.5)*Math.PI*2,jitter:Math.sin(i*21)*.04,speed:Math.sin(i*4)*.02,color:i===141?'#e4007c':i%421===0?'#00e5ff':'#f0f0f8',x:0,y:0,vx:0,vy:0}));
    const resize=()=>{const r=parent.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
    const geometry=()=>{let major=Math.min(width*(mobile?.33:.13),180),minor=.38*major;const maxHeight=height*(mobile?.7:.55);const projected=(major+minor)*.5226872289306592+.8525245220595057*minor;if(projected>maxHeight){const s=maxHeight/projected;major*=s;minor*=s}return{major,minor,depth:(major+minor)*2.5,cx:width/2,cy:height*(mobile?.28:.5)}};
    const draw=(time:number)=>{
      ctx.clearRect(0,0,width,height);const {major,minor,depth,cx,cy}=geometry();ctx.globalCompositeOperation='lighter';
      for(const p of particles){let alpha=1,size=.77;
        if(!fallen){const u=p.u+rotation+time*p.speed;const radial=major+minor*Math.cos(p.v)*(1+p.jitter);const x=radial*Math.cos(u),z=radial*Math.sin(u),y=minor*Math.sin(p.v);const projectedY=.8525245220595057*y-.5226872289306592*z;const projectedZ=depth+.5226872289306592*y+.8525245220595057*z;const perspective=projectedZ>1?depth/projectedZ:depth;p.x=cx+x*perspective;p.y=cy-projectedY*perspective;const a=Math.max(0,Math.min(1,(perspective-.55)/.9));alpha=(.28+.72*a)*(reduced.matches?1:.84+.16*Math.sin(1.1*time+p.u));size*=.7+.4*a;const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);if(d<80&&d>.01){const force=(1-d/80)**2*30;p.x+=dx/d*force;p.y+=dy/d*force}}
        else{p.vy+=.075;p.x+=p.vx;p.y+=p.vy;const d=Math.hypot(p.x-pointer.x,p.y-pointer.y);if(d<65&&d>.01){p.vx+=(p.x-pointer.x)/d*.2;p.vy+=(p.y-pointer.y)/d*.2}if(p.y>height-2){p.y=height-2;p.vy*=-.3;p.vx*=.99}if(p.x<1||p.x>width-1)p.vx*=-.6}
        ctx.globalAlpha=alpha;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fill();
      }ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    };
    let last=0;const tick=(now:number)=>{if(visible&&!document.hidden&&now-last>30){if(!drag&&!reduced.matches)rotation+=.01;draw(now/1000);last=now}frame=requestAnimationFrame(tick)};
    const move=(e:PointerEvent)=>{const r=parent.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;if(drag){const dx=e.clientX-lastX;if(Math.abs(dx)>2)moved=true;rotation+=dx*.006;lastX=e.clientX}};
    const leave=()=>{pointer.x=pointer.y=-1e6};
    const down=(e:PointerEvent)=>{if((e.target as HTMLElement).closest('a,button,input'))return;const {cx,cy,major,minor}=geometry();if(Math.abs(pointer.x-cx)<(major+minor)*1.25&&Math.abs(pointer.y-cy)<(major+minor)*.9){drag=true;moved=false;lastX=e.clientX}};
    const up=()=>{if(drag&&!moved&&!reduced.matches){fallen=true;particles.forEach(p=>{p.vx=Math.sin(p.u)*1.5;p.vy=.4+Math.cos(p.v)**2*1.6})}drag=false};
    const observer=new ResizeObserver(resize);observer.observe(parent);const intersection=new IntersectionObserver(([e])=>visible=e.isIntersecting,{threshold:.01});intersection.observe(parent);resize();frame=requestAnimationFrame(tick);
    parent.addEventListener('pointermove',move);parent.addEventListener('pointerleave',leave);parent.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();parent.removeEventListener('pointermove',move);parent.removeEventListener('pointerleave',leave);parent.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up)};
  },[]);
  return <canvas className="reference-footer-particles" ref={ref} aria-hidden="true"/>;
}
