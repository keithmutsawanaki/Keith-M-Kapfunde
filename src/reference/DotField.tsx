import { useEffect, useRef } from 'react';

export default function DotField() {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
    let width=0,height=0,frame=0;
    let waves:{x:number;y:number;start:number}[]=[];
    const draw=(now:number)=>{
      ctx.clearRect(0,0,width,height);waves=waves.filter(w=>now-w.start<2200);
      for(let y=11;y<height;y+=22)for(let x=11;x<width;x+=22){let dx=x,dy=y,alpha=.09;for(const w of waves){const elapsed=(now-w.start)/1000,remaining=1-elapsed/2.2,ox=x-w.x,oy=y-w.y,distance=Math.hypot(ox,oy),edge=distance-380*elapsed;if(Math.abs(edge)<80){const factor=Math.cos(edge/80*Math.PI*.5),force=factor*14*remaining,scale=distance>.001?1/distance:0;dx+=ox*scale*force;dy+=oy*scale*force;alpha+=.28*remaining*Math.max(0,factor)}}ctx.fillStyle=`rgba(255,255,255,${Math.min(1,alpha)})`;ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);ctx.fill()}
      if(waves.length)frame=requestAnimationFrame(draw);else frame=0;
    };
    const resize=()=>{width=innerWidth;height=innerHeight;const dpr=devicePixelRatio||1;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);cancelAnimationFrame(frame);frame=0;draw(performance.now())};
    const click=(event:MouseEvent)=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches||(event.target as HTMLElement).closest('a,button,[role="button"],input,textarea,select'))return;if(waves.length>=6)waves.shift();waves.push({x:event.clientX,y:event.clientY,start:performance.now()});if(!frame)frame=requestAnimationFrame(draw)};
    resize();window.addEventListener('resize',resize);window.addEventListener('click',click);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('click',click)};
  },[]);
  return <canvas className="reference-dot-field" ref={ref} aria-hidden="true"/>;
}
