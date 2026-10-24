// Finca Berthina: conceptual, navigable 3D massing based on the owner's annotated sketch.
// Not to scale. No private residence, pool or room is marketed as available.
const host=document.querySelector('#finca3d');
if(host){
const imgBase='../assets/img/';
const zones={
 entrada:{label:'Portón',category:'public',pos:[-40,-9],h:1.5,title:'Entrada principal',desc:'Acceso desde la calle. El estacionamiento es sobre vía pública y debe verificarse antes de cada evento.',photo:'gate.webp',url:'../ubicacion/',action:'Cómo llegar'},
 capilla:{label:'Capilla',category:'public',pos:[-46,-25],h:6,title:'Capilla de Finca Berthina',desc:'Está cerca del portón, sobre el lado izquierdo del recorrido. Su uso para ceremonias se confirma con administración.',photo:'chapel_out.webp',url:'../espacios/capilla/',action:'Conocer la capilla'},
 fuente:{label:'Fuente',category:'public',pos:[-22,-7],h:1.8,title:'Bifurcación y fuente',desc:'Aquí se separan los recorridos: camino para vehículos y sendero peatonal hacia jardín, alberca y salón.',photo:'garden_path.webp',url:'../galeria/',action:'Ver jardines'},
 alberca:{label:'Alberca',category:'closed',pos:[-13,-17],h:3.2,title:'Alberca en mantenimiento',desc:'En la ruta peatonal, antes de los baños. Actualmente vacía y fuera de servicio; NO se incluye en ninguna renta.',photo:'pool_maintenance.webp',url:'../galeria/',action:'Ver fotos reales'},
 banos:{label:'Baños H / M',category:'public',pos:[-3,-16],h:4.5,title:'Baños exteriores',desc:'Después del paso cercano a la alberca. Los sanitarios tienen servicio de agua y forman parte de la operación de eventos.',photo:'banos_h.webp',url:'../galeria/',action:'Ver galería'},
 pasillo:{label:'Pasillo',category:'public',pos:[16,-17],h:5,title:'Pasillo de las habitaciones',desc:'Conecta baños con sala de juegos, habitaciones privadas, cocina de apoyo y salón. Las habitaciones no están disponibles.',photo:'salon_corridor.webp',url:'../galeria/',action:'Ver fotos'},
 cocina:{label:'Cocina',category:'public',pos:[32,-16],h:5.4,title:'Cocina de apoyo',desc:'Se encuentra al final del corredor, junto al salón. Cuenta con un espacio amplio; sus equipos siguen sujetos al inventario.',photo:'cocina.webp',url:'../espacios/cocina/',action:'Conocer la cocina'},
 salon:{label:'Salón',category:'public',pos:[43,-16],h:8.5,title:'Salón de eventos',desc:'El corredor conecta directamente con la cocina y el salón, donde se realizan las celebraciones. La rotonda de llegada queda al frente.',photo:'salon_empty2.webp',url:'../espacios/salon/',action:'Ver salón y fotografías'},
 jardin:{label:'Jardín central',category:'public',pos:[12,12],h:1.4,title:'Jardín central',desc:'El gran espacio verde se extiende delante del corredor. El camino rodea el jardín y continúa hasta la zona pavimentada de llegada frente a la cocina.',photo:'garden_day.webp',url:'../espacios/jardin/',action:'Conocer el jardín'},
 llegada:{label:'Llegada',category:'public',pos:[35,-6],h:1.5,title:'Zona pavimentada de llegada',desc:'El camino para vehículos continúa alrededor del jardín y termina en esta área pavimentada gris, delante de la cocina y junto al salón. Es una zona para bajar invitados, no un estacionamiento privado.',photo:'garden_evening.webp',url:'../galeria/',action:'Ver fotos del lugar'}
};
const panel=document.querySelector('#viewerInfo'), labelLayer=document.querySelector('#modelLabels');
const filterButtons=[...document.querySelectorAll('[data-model-filter]')];
let current='entrada',filter='all';
function selectZone(key){const z=zones[key];if(!z)return;current=key;
 panel.querySelector('h3').textContent=z.title;
 panel.querySelector('p').textContent=z.desc;
 const image=panel.querySelector('#modelAreaPhoto');image.src=imgBase+z.photo;image.alt='Fotografía de '+z.title;
 const a=panel.querySelector('#modelAreaLink');a.href=z.url;a.textContent=z.action+' ↗';
 document.querySelectorAll('.area-marker').forEach(b=>b.classList.toggle('selected',b.dataset.zone===key));
}
filterButtons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.modelFilter;filterButtons.forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.area-marker').forEach(x=>x.hidden=filter==='public'&&zones[x.dataset.zone].category!=='public');}));
const labelElements={};for(const [key,z] of Object.entries(zones)){
 const btn=document.createElement('button');btn.type='button';btn.className='area-marker'+(z.category==='closed'?' closed':'');btn.dataset.zone=key;btn.textContent=z.label;btn.setAttribute('aria-label',z.title);btn.addEventListener('click',()=>selectZone(key));labelLayer.appendChild(btn);labelElements[key]=btn;
}
selectZone('entrada');
try{
const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
const canvas=document.querySelector('#fincaCanvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'default'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x355344);scene.fog=new THREE.Fog(0x355344,115,190);
const camera=new THREE.PerspectiveCamera(45,1,.1,260);const focus=new THREE.Vector3(0,0,0);
const ambient=new THREE.HemisphereLight(0xffefce,0x2c402f,2.05);scene.add(ambient);
const sun=new THREE.DirectionalLight(0xffd28d,2.55);sun.position.set(-28,60,38);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-90;sun.shadow.camera.right=90;sun.shadow.camera.top=90;sun.shadow.camera.bottom=-90;scene.add(sun);
const MAT={terrain:new THREE.MeshStandardMaterial({color:0x496a41,roughness:1}),lawn:new THREE.MeshStandardMaterial({color:0x6d914e,roughness:1}),grass:new THREE.MeshStandardMaterial({color:0x56834c,roughness:1}),stone:new THREE.MeshStandardMaterial({color:0xbcae94,roughness:.95}),path:new THREE.MeshStandardMaterial({color:0xd3c19f,roughness:.98}),red:new THREE.MeshStandardMaterial({color:0xa34b37,roughness:.85}),brick:new THREE.MeshStandardMaterial({color:0xb87a53,roughness:.85}),wall:new THREE.MeshStandardMaterial({color:0xdfc399,roughness:1}),wood:new THREE.MeshStandardMaterial({color:0x6b4030,roughness:1}),roof:new THREE.MeshStandardMaterial({color:0xa14f36,roughness:.84}),private:new THREE.MeshStandardMaterial({color:0x967b7b,roughness:1}),privateRoof:new THREE.MeshStandardMaterial({color:0x805452,roughness:1}),closed:new THREE.MeshStandardMaterial({color:0x92989b,roughness:1}),dryPool:new THREE.MeshStandardMaterial({color:0x758e91,roughness:1}),leaf:new THREE.MeshStandardMaterial({color:0x355c32,roughness:1}),leaf2:new THREE.MeshStandardMaterial({color:0x517a3e,roughness:1}),bark:new THREE.MeshStandardMaterial({color:0x795d3e,roughness:1}),gold:new THREE.MeshStandardMaterial({color:0xe3bd73,roughness:.8}),arrival:new THREE.MeshStandardMaterial({color:0x9da4a4,roughness:1})};
const clickable=[];function box(w,h,d,mat,x,y,z,tag){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=h>.3;o.receiveShadow=true;scene.add(o);if(tag){o.userData.zone=tag;clickable.push(o);}return o;}
function cylinder(r1,r2,h,mat,x,y,z,tag){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,16),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);if(tag){o.userData.zone=tag;clickable.push(o);}return o;}
function dome(r,x,y,z,tag){const o=new THREE.Mesh(new THREE.SphereGeometry(r,22,13,0,Math.PI*2,0,Math.PI/2),MAT.red);o.position.set(x,y,z);o.scale.y=.82;o.castShadow=true;scene.add(o);if(tag){o.userData.zone=tag;clickable.push(o);}}
function roof(x,z,w,d,h=3.8){const o=new THREE.Mesh(new THREE.ConeGeometry(Math.sqrt((w*w+d*d))/2,h,4,1),MAT.roof);o.rotation.y=Math.PI/4;o.position.set(x,5+h/2,z);o.castShadow=true;scene.add(o);return o;}
// Ground and front garden, sized only to express spatial relationships.
box(105,1.2,74,MAT.terrain,0,-.62,1);
const lawn=new THREE.Mesh(new THREE.CylinderGeometry(22,22,.22,52),MAT.lawn);lawn.scale.set(1.25,1,.78);lawn.position.set(10,.08,12);lawn.receiveShadow=true;scene.add(lawn);
// Roads as smooth flat masonry segments; automobile loop is to the front of the long corridor.
function path(points,width=3.2,material=MAT.stone){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],.075,p[1])),false,'centripetal',.3);const pts=curve.getPoints(120);for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],len=a.distanceTo(b);const mesh=box(width,.12,len+.18,material,(a.x+b.x)/2,.12,(a.z+b.z)/2);mesh.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);mesh.castShadow=false;}}
path([[-52,-25],[-40,-23],[-31,-21],[-22,-7],[-14,0],[-12,17],[5,27],[30,27],[41,19],[41,6],[38,-2],[34,-7]],4.1);
path([[-22,-7],[-19,-16],[-13,-20],[-4,-20],[5,-20],[25,-20],[36,-19],[42,-10]],2.1,MAT.path);
// Entrance avenue unchanged. Swap the two physical buildings and markers only.
// Portón now occupies the former chapel point.
path([[-52,-27],[-47,-27],[-42,-24]],6,MAT.path);
box(.8,5,1.5,MAT.brick,-42.5,2.5,-9);box(.8,5,1.5,MAT.brick,-37.5,2.5,-9);
box(4,3,.5,MAT.wood,-40,2,-9,'entrada');
// Capilla now occupies the former gate point, retaining its original visual treatment.
box(8,4.7,8,MAT.brick,-46,2.35,-25,'capilla');dome(4.1,-46,4.8,-25,'capilla');
cylinder(.7,.7,1.6,MAT.wall,-46,8.6,-25);dome(.72,-46,9.4,-25);
for(const dx of [-2.9,2.9])cylinder(.4,.46,3.6,MAT.wall,-46+dx,2.0,-19.5);
roof(-46,-19.4,7.5,3.9,1.75);
// Two non-rentable residences: anonymized on public map to protect owners.
function privateHouse(x,z,w=9){box(w,4.2,7.5,MAT.private,x,2.1,z);const r=roof(x,z,w,7.5,2.7);r.material=MAT.privateRoof;}
privateHouse(-31,-21,9);privateHouse(-19,-23,8.5);
// Fountain at route bifurcation.
cylinder(2,2,.5,MAT.stone,-22,.28,-7,'fuente');cylinder(1.35,1.35,.2,MAT.dryPool,-22,.6,-7);cylinder(.35,.5,2.1,MAT.wall,-22,1.7,-7,'fuente');
// Dry pool, explicitly not presented as filled or usable.
box(9,.55,6,MAT.stone,-13,.25,-17,'alberca');box(7.9,.04,4.9,MAT.dryPool,-13,.56,-17,'alberca');
for(let i=0;i<4;i++)box(.7,.28,.5,MAT.stone,-15+i*.8,.38,-14.1);
// Raised small bridge near pool and access to toilets
box(4,.45,3.1,MAT.path,-7.4,.65,-17.8);for(let i of [-1,1])box(.26,1.15,3.1,MAT.brick,-7.4+i*1.75,1.28,-17.8);
box(6,4.1,6,MAT.wall,-3,2.05,-16,'banos');roof(-3,-16,6.8,6.3,1.9);
// Continuous 3D sequence: games / rooms (closed) / kitchen / hall.
box(39,1.1,2.2,MAT.stone,19, .43,-10.4,'pasillo');
const specs=[{x:4,w:6,tag:'pasillo',private:false},{x:10.2,w:6.3,private:true},{x:16.4,w:6.1,private:true},{x:23.2,w:7.4,private:true},{x:31,w:7.7,tag:'cocina'}];
for(const s of specs){box(s.w-.2,4.6,6.8,s.private?MAT.private:MAT.brick,s.x,2.3,-16,s.tag);box(s.w-.2,.65,7.2,s.private?MAT.privateRoof:MAT.roof,s.x,4.95,-16,s.tag);}
// Columns and coherent covered corridor between bathrooms and salon
for(let x=1.2;x<37.5;x+=3){cylinder(.23,.3,3.2,MAT.wall,x,2.06,-10.5,'pasillo');}
box(39,.45,2.5,MAT.roof,19,4,-11.4,'pasillo');
// Hall, verified red dome architecture stylized, not exact scanned shape.
box(13,5.2,12,MAT.brick,43,2.6,-16,'salon');dome(6.6,43,5.5,-16,'salon');
for(let i=0;i<3;i++){const x=38+i*4.3;cylinder(.32,.38,3.8,MAT.wall,x,2.1,-9.7,'salon');}
box(13,.55,2.8,MAT.roof,43,4.4,-10,'salon');
// Actual arrival: plain gray paved forecourt directly in front of the kitchen/salon.
// The main roadway reaches this apron; no roundabout, central planter or ornamental island.
box(11,.16,7,MAT.arrival,35,.14,-6,'llegada');
// Trees: deterministic placed at boundaries plus around open lawn, not inside the buildings.
let state=19;const rnd=()=>((state=(state*1664525+1013904223)>>>0)/4294967296);
function tree(x,z,scale=1){cylinder(.23*scale,.33*scale,2.6*scale,MAT.bark,x,1.5*scale,z);const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(1.75*scale,1),rnd()<.45?MAT.leaf2:MAT.leaf);leaf.position.set(x,4.4*scale,z);leaf.castShadow=true;scene.add(leaf);}
for(let x=-53;x<56;x+=5.8){tree(x,-36+(rnd()-.5)*4,.8+rnd()*.5);tree(x,36+(rnd()-.5)*4,.78+rnd()*.4)}
for(let z=-30;z<32;z+=6){tree(-53+(rnd()-.5)*4,z,.8+rnd()*.4);tree(55+(rnd()-.5)*3,z,.8+rnd()*.5)}
for(let i=0;i<17;i++){const x=-17+rnd()*56,z=-4+rnd()*37;if(z>-4&&Math.abs(x-42)>11&&!(x>0&&z>7&&z<19&&rnd()<.7))tree(x,z,.45+rnd()*.45);}
// Display floating labels for interactive points. Orthographic-like elevated orbit preserves site order.
const markerLocation=(z)=>new THREE.Vector3(z.pos[0],z.h,z.pos[1]);
let azimuth=.55,elevation=.93,radius=120,isDragging=false,startX=0,startY=0,moved=false;
function placeCamera(){camera.position.set(Math.sin(azimuth)*Math.cos(elevation)*radius,Math.sin(elevation)*radius,Math.cos(azimuth)*Math.cos(elevation)*radius);camera.lookAt(focus);render();}
function render(){const width=host.clientWidth,height=host.clientHeight;if(width<10||height<10)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);
 for(const [k,z] of Object.entries(zones)){const el=labelElements[k];const vec=markerLocation(z).project(camera);const visible=vec.z<1 && vec.z>-1 && (filter==='all'||z.category==='public');el.style.left=((vec.x+1)/2*width)+'px';el.style.top=((-vec.y+1)/2*height)+'px';el.hidden=!visible;el.classList.toggle('selected',current===k);}}
const fallback=document.querySelector('#fincaFallback');fallback.hidden=true;
const resizeObserver=new ResizeObserver(()=>render());resizeObserver.observe(host);
placeCamera();
const raycaster=new THREE.Raycaster();const cursor=new THREE.Vector2();
canvas.addEventListener('pointerdown',e=>{isDragging=true;moved=false;startX=e.clientX;startY=e.clientY;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!isDragging)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;azimuth-=dx*.007;elevation=Math.max(.35,Math.min(1.45,elevation+dy*.005));startX=e.clientX;startY=e.clientY;placeCamera();});
canvas.addEventListener('pointerup',e=>{if(!moved){const rect=canvas.getBoundingClientRect();cursor.x=(e.clientX-rect.left)/rect.width*2-1;cursor.y=-(e.clientY-rect.top)/rect.height*2+1;raycaster.setFromCamera(cursor,camera);for(const hit of raycaster.intersectObjects(clickable,false)){if(hit.object.userData.zone){selectZone(hit.object.userData.zone);break;}}}isDragging=false;});
canvas.addEventListener('pointercancel',()=>isDragging=false);
canvas.addEventListener('wheel',e=>{e.preventDefault();radius=Math.max(55,Math.min(160,radius+Math.sign(e.deltaY)*6));placeCamera();},{passive:false});
const btn=(selector,fn)=>document.querySelector(selector)?.addEventListener('click',fn);
btn('#viewLeft',()=>{azimuth-=.24;placeCamera()});btn('#viewRight',()=>{azimuth+=.24;placeCamera()});btn('#viewPlus',()=>{radius=Math.max(55,radius-9);placeCamera()});btn('#viewMinus',()=>{radius=Math.min(160,radius+9);placeCamera()});btn('#viewReset',()=>{azimuth=.55;elevation=.93;radius=120;selectZone('entrada');placeCamera()});
}catch(err){console.warn('3D interactivo no disponible. Se mantiene el plano esquemático.',err);document.querySelector('.model-top-label small').textContent='Versión ilustrada sin visor 3D';document.querySelectorAll('.area-marker').forEach(x=>x.hidden=true);}
}
