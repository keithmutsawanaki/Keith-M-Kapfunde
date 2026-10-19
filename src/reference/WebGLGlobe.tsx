import { useEffect, useRef } from 'react';
import { arcFragment, arcVertex, haloFragment, haloVertex, pointFragment, pointVertex } from './globe-shaders';
import { cities, connections, portfolioHub } from './globe-geography';

const globeCities = [...cities.map(city => ({...city,isHQ:false})), {...portfolioHub,isHQ:true}];
const globeConnections = connections.map(([,to]) => [portfolioHub.name,to]);

type Ring = number[][];
type Country = {geometry:{type:string;coordinates:Ring[]|Ring[][]}|null};
type Attribute = { buffer: WebGLBuffer; size: number };
type Geometry = { attributes: Record<string, Attribute>; count: number };
type Arc = { a:number[]; b:number[]; angle:number; sine:number; offset:number; speed:number };

export default function WebGLGlobe({enabled=true}:{enabled?:boolean}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!enabled)return;
    const canvas=ref.current;
    const context=canvas?.getContext('webgl',{alpha:true,antialias:false,powerPreference:'high-performance'});
    if(!canvas||!context)return;
    const gl=context;const abort=new AbortController();const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const buffers:WebGLBuffer[]=[],programs:WebGLProgram[]=[];
    const programsUniforms=new Map<WebGLProgram,Map<string,WebGLUniformLocation|null>>();
    const prefix='precision highp float;\nuniform mat4 projectionMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat3 normalMatrix;\nattribute vec3 position;\nattribute vec3 normal;\n';
    const compile=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,(type===gl.VERTEX_SHADER?prefix:'precision highp float;\n')+source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(message||'Unable to compile globe shader')}return s};
    const program=(vertex:string,fragment:string)=>{const p=gl.createProgram()!,v=compile(gl.VERTEX_SHADER,vertex),f=compile(gl.FRAGMENT_SHADER,fragment);gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'Unable to link globe shaders');programs.push(p);programsUniforms.set(p,new Map());return p};
    const pointsProgram=program(pointVertex,pointFragment),arcsProgram=program(arcVertex,arcFragment),haloProgram=program(haloVertex,haloFragment);
    const location=(p:WebGLProgram,name:string)=>{const cache=programsUniforms.get(p)!;if(!cache.has(name))cache.set(name,gl.getUniformLocation(p,name));return cache.get(name)!};
    const scalar=(p:WebGLProgram,name:string,value:number)=>gl.uniform1f(location(p,name),value);
    const attr=(array:number[],size:number):Attribute=>{const buffer=gl.createBuffer()!;buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(array),gl.STATIC_DRAW);return{buffer,size}};
    const geometry=(data:Record<string,{values:number[];size:number}>):Geometry=>({attributes:Object.fromEntries(Object.entries(data).map(([name,{values,size}])=>[name,attr(values,size)])),count:data.position.values.length/3});
    const bind=(p:WebGLProgram,g:Geometry)=>{for(let i=0;i<gl.getParameter(gl.MAX_VERTEX_ATTRIBS);i++)gl.disableVertexAttribArray(i);for(const [name,a]of Object.entries(g.attributes)){const index=gl.getAttribLocation(p,name);if(index<0)continue;gl.bindBuffer(gl.ARRAY_BUFFER,a.buffer);gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,a.size,gl.FLOAT,false,0,0)}};
    const vector=(lat:number,lng:number)=>{const a=lat*Math.PI/180,b=lng*Math.PI/180;return[Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b)]};
    const arcs:Arc[]=globeConnections.map(([from,to],i)=>{const a=globeCities.find(city=>city.name===from)!,b=globeCities.find(city=>city.name===to)!;const start=vector(a.lat,a.lng),end=vector(b.lat,b.lng);const angle=Math.acos(Math.max(-1,Math.min(1,start.reduce((sum,n,k)=>sum+n*end[k],0))));return{a:start,b:end,angle,sine:Math.sin(angle),offset:(i*.618)%1,speed:1/(18+(i*.43%1)*12)}});
    const lineData={position:{values:[] as number[],size:3},aArcT:{values:[] as number[],size:1},aOffset:{values:[] as number[],size:1},aSpeed:{values:[] as number[],size:1}};
    for(const arc of arcs){const steps=Math.max(32,Math.round(64*arc.angle));let prior:number[]|null=null;let priorT=0;for(let j=0;j<steps;j++){const t=j/(steps-1),radius=1+.3*Math.sin(Math.PI*t);const pos=arc.a.map((n,k)=>(n*Math.sin((1-t)*arc.angle)+arc.b[k]*Math.sin(t*arc.angle))/arc.sine*radius);if(prior){lineData.position.values.push(...prior,...pos);lineData.aArcT.values.push(priorT,t);lineData.aOffset.values.push(arc.offset,arc.offset);lineData.aSpeed.values.push(arc.speed,arc.speed)}prior=pos;priorT=t}}
    const lines=geometry(lineData);
    const sphereData={position:{values:[] as number[],size:3},normal:{values:[] as number[],size:3}};
    for(let lat=0;lat<48;lat++)for(let lng=0;lng<48;lng++){for(const [a,b]of [[lat,lng],[lat,lng+1],[lat+1,lng],[lat,lng+1],[lat+1,lng+1],[lat+1,lng]]){const v=vector(a/48*180-90,b/48*360);sphereData.position.values.push(...v.map(n=>n*1.045));sphereData.normal.values.push(...v)}}
    const sphere=geometry(sphereData);
    let width=1,height=1,dpr=1,baseCamera=3,ndcY=.24,frame=0,visible=true,disposed=false,start=0,last=0,rotation=0,tilt=0,velocity=reduced.matches?0:.055,dragging=false,previousX=0,previousY=0,points:Geometry|null=null;
    const baseTilt=portfolioHub.lat*Math.PI/180;tilt=baseTilt;
    const hq=vector(portfolioHub.lat,portfolioHub.lng);rotation=-Math.atan2(hq[0],hq[2]);
    canvas.dataset.hub=portfolioHub.name+", "+portfolioHub.country;
    const tan=Math.tan(40*Math.PI/360);
    const resize=()=>{width=Math.max(1,canvas.clientWidth);height=Math.max(1,canvas.clientHeight);dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;gl.viewport(0,0,canvas.width,canvas.height);const diameter=Math.min(512,.66*Math.min(width,height));baseCamera=height/(tan*diameter);ndcY=1-Math.max(.38*height,diameter/2+120)/height*2};
    gl.clearColor(0,0,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
    const clamp=(n:number)=>Math.max(0,Math.min(1,n));const expo=(n:number)=>n>=1?1:1-2**(-10*n);
    const uniforms=(p:WebGLProgram,time:number,progress:number,camera:number,arcProgress:number)=>{
      gl.useProgram(p);const f=1/tan,near=.1,far=50;
      gl.uniformMatrix4fv(location(p,'projectionMatrix'),false,new Float32Array([f/(width/height),0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]));
      gl.uniformMatrix4fv(location(p,'modelViewMatrix'),false,new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,ndcY*tan*camera,-camera,1]));
      gl.uniformMatrix3fv(location(p,'normalMatrix'),false,new Float32Array([1,0,0,0,1,0,0,0,1]));
      scalar(p,'uTime',time);scalar(p,'uProgress',progress);scalar(p,'uArcProgress',arcProgress);scalar(p,'uPixelRatio',dpr);scalar(p,'uScale',.5*height/tan);scalar(p,'uCamZ',camera);scalar(p,'uMotion',reduced.matches?0:1);scalar(p,'uRotY',rotation);scalar(p,'uRotX',tilt);scalar(p,'uBase',.3);scalar(p,'uIntensity',.32*expo(progress));
      const linear=(n:number)=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4;
      gl.uniform3f(location(p,'uColor'),linear(240/255),linear(240/255),linear(248/255));gl.uniform3f(location(p,'uAccentColor'),linear(228/255),0,linear(124/255));
    };
    const draw=(now:number)=>{
      frame=requestAnimationFrame(draw);if(!points||!visible||document.hidden)return;
      const dt=Math.min(last?(now-last)/1000:0,.05);last=now;const elapsed=(now-start)/1000;const progress=reduced.matches?1:Math.min(elapsed/2.4,1),arcProgress=reduced.matches?1:clamp((elapsed-2.65)/1.3);
      if(!dragging){const target=reduced.matches?0:.055;velocity+=(target-velocity)*(1-Math.exp(-1.6*dt));rotation+=velocity*dt;tilt+=(baseTilt-tilt)*(1-Math.exp(-.9*dt))}
      const camera=reduced.matches?baseCamera:baseCamera+baseCamera*.145*(1-expo(Math.min(elapsed/3,1)));
      gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);uniforms(haloProgram,elapsed,progress,camera,arcProgress);bind(haloProgram,sphere);gl.drawArrays(gl.TRIANGLES,0,sphere.count);gl.disable(gl.CULL_FACE);
      uniforms(pointsProgram,elapsed,progress,camera,arcProgress);bind(pointsProgram,points);gl.drawArrays(gl.POINTS,0,points.count);
      uniforms(arcsProgram,elapsed,progress,camera,arcProgress);bind(arcsProgram,lines);gl.drawArrays(gl.LINES,0,lines.count);
    };
    const down=(e:PointerEvent)=>{dragging=true;previousX=e.clientX;previousY=e.clientY;velocity=0;canvas.setPointerCapture(e.pointerId)};
    const move=(e:PointerEvent)=>{if(!dragging)return;const dx=e.clientX-previousX,dy=e.clientY-previousY;rotation+=.0045*dx;velocity=Math.max(-2.2,Math.min(2.2,.0045*dx*60));if(e.pointerType!=='touch')tilt=Math.max(baseTilt-.55,Math.min(baseTilt+.55,tilt+.0035*dy*(.35+.65*(1-Math.min(1,Math.abs(tilt-baseTilt)/.55)))));previousX=e.clientX;previousY=e.clientY};
    const up=()=>{dragging=false};
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    const resizer=new ResizeObserver(resize);resizer.observe(canvas);const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;last=0});observer.observe(canvas);resize();frame=requestAnimationFrame(draw);
    Promise.all([fetch('/countries.geojson',{signal:abort.signal}).then(r=>r.json()),fetch('/zimbabwe.geojson',{signal:abort.signal}).then(r=>r.json())]).then(([data,zimbabwe]:[{features:Country[]},Country])=>{
      if(disposed)return;const mask=document.createElement('canvas');mask.width=2048;mask.height=1024;const ctx=mask.getContext('2d',{willReadFrequently:true});if(!ctx)return;ctx.fillStyle='#000';ctx.fillRect(0,0,2048,1024);ctx.fillStyle='#fff';
      for(const {geometry:g}of data.features){if(!g)continue;const polygons=g.type==='Polygon'?[g.coordinates as Ring[]]:g.coordinates as Ring[][];for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){for(const [j,[lng,lat]]of ring.entries()){const x=(lng+180)/360*2048,y=(90-lat)/180*1024;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath()}ctx.fill('evenodd')}}
      const pixels=ctx.getImageData(0,0,2048,1024).data;
      ctx.fillStyle='#000';ctx.fillRect(0,0,2048,1024);ctx.fillStyle='#fff';
      const focus=zimbabwe.geometry;if(!focus)throw new Error('Zimbabwe geography missing');const focusPolygons=focus.type==='Polygon'?[focus.coordinates as Ring[]]:focus.coordinates as Ring[][];
      for(const polygon of focusPolygons){ctx.beginPath();for(const ring of polygon){for(const [j,[lng,lat]]of ring.entries()){const x=(lng+180)/360*2048,y=(90-lat)/180*1024;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath()}ctx.fill('evenodd')}
      const focusPixels=ctx.getImageData(0,0,2048,1024).data;
      const count=innerWidth<768?22000:52000;
      const dataPoints={position:{values:[] as number[],size:3},aScatter:{values:[] as number[],size:3},aDelay:{values:[] as number[],size:1},aSize:{values:[] as number[],size:1},aPhase:{values:[] as number[],size:1},aAccent:{values:[] as number[],size:1},aArcT:{values:[] as number[],size:1}};
      const scatter=()=>{const side=1.06+Math.random()*.28;let x:number,y:number;if(Math.random()<width/(width+height)){x=(Math.random()*2-1)*side;y=Math.random()<.5?side:-side}else{x=Math.random()<.5?side:-side;y=(Math.random()*2-1)*side}const camera=baseCamera*1.145,z=camera-1.2+2.8*Math.random(),scale=z*tan;return[x*scale*width/height,y*scale-ndcY*tan*camera,camera-z]};
      const add=(position:number[],size:number,delay:number,accent=0,arcT=-1,destination?:number[])=>{dataPoints.position.values.push(...position);dataPoints.aScatter.values.push(...(destination||scatter()));dataPoints.aDelay.values.push(delay);dataPoints.aSize.values.push(size);dataPoints.aPhase.values.push(Math.random());dataPoints.aAccent.values.push(accent);dataPoints.aArcT.values.push(arcT)};
      for(let i=0;i<count;i++){const y=1-i/(count-1)*2,r=Math.sqrt(Math.max(0,1-y*y)),angle=Math.PI*(3-Math.sqrt(5))*i,x=Math.cos(angle)*r,z=Math.sin(angle)*r,lng=Math.atan2(-z,x)*180/Math.PI,lat=Math.asin(y)*180/Math.PI;const px=Math.max(0,Math.min(2047,Math.floor((lng+180)/360*2048))),py=Math.max(0,Math.min(1023,Math.floor((90-lat)/180*1024)));if(pixels[(py*2048+px)*4]>127)add([x,y,z],.008+.005*Math.random(),(lng+180)/360*.33+.22*Math.random(),focusPixels[(py*2048+px)*4]>127?1:0)}
      for(const city of globeCities){const accent=city.name===portfolioHub.name;add(vector(city.lat,city.lng),city.isHQ?(accent?.02:.017):.013,city.isHQ?.05:(city.lng+180)/360*.33+.22*Math.random(),accent?1:0)}
      for(const arc of arcs)add(arc.a,.012,arc.speed,0,arc.offset,arc.b);
      points=geometry(dataPoints);start=performance.now();canvas.dataset.particleCount=String(points.count);
    }).catch(error=>{if(error.name!=='AbortError')console.error('Globe geography could not load',error)});
    return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame);resizer.disconnect();observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);buffers.forEach(b=>gl.deleteBuffer(b));programs.forEach(p=>gl.deleteProgram(p))};
  },[enabled]);
  return <div className="reference-globe" role="img" aria-label="Globe focused on Zimbabwe, with Harare as the main connection hub"><canvas ref={ref} aria-hidden="true"/><div className="reference-globe-status"><span/> online · zimbabwe</div></div>;
}
