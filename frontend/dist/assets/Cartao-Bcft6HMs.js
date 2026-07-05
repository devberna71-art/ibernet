import{a as e}from"./chunk-Cyuzqnbw.js";import{n as t,t as n}from"./jsx-runtime-CnYwEvd9.js";import{T as r,d as i}from"./Select-B5NKyy4I.js";import{t as a}from"./Grid-A9VFUGA4.js";import{t as o}from"./Card-DK1kJn6w.js";import{t as s}from"./Checkbox-CpclwTIg.js";import{D as c,H as l,W as u,j as d}from"./index-Bg1NTvYT.js";import{t as f}from"./jspdf.es.min-DkSZDK1J.js";import{t as p}from"./html2canvas-DSKviCCI.js";var m=e(t()),h=e(p()),g=n();function _(){let[e,t]=(0,m.useState)([]),[n,p]=(0,m.useState)([]),[_,v]=(0,m.useState)(null),[y,b]=(0,m.useState)(null),[x,S]=(0,m.useState)(!1),[C,w]=(0,m.useState)(``),[T,E]=(0,m.useState)(``),[D,O]=(0,m.useState)(``),[k,A]=(0,m.useState)(``),[j,M]=(0,m.useState)(1);(0,m.useEffect)(()=>{async function e(){try{t((await c.get(`/membros`)).data)}catch(e){console.log(`Erro (possível 401):`,e)}}e()},[]);let N=e=>{p(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])},P=e=>{let t=e.target.files[0];t&&v(URL.createObjectURL(t))},F=e=>{let t=e.target.files[0];t&&b(URL.createObjectURL(t))},I=async()=>(await c.post(`/dados-cartao`,{membrosIds:n})).data,L=e.filter(e=>e.nome.toLowerCase().includes(k.toLowerCase())),R=Math.ceil(L.length/6),z=L.slice((j-1)*6,j*6),B=(e,t=!1)=>{let n=x,r=t&&n,i=120+[C,T,D].filter(Boolean).length*20;return`
      <div style="
        width:${n?`900px`:`420px`};
        height:${n?`360px`:`650px`};
        position:relative;
        font-family:'Poppins','Inter','Segoe UI',sans-serif;
        background-image:url(${_||``});
        background-size:cover;
        background-position:center;
        border-radius:24px;
        overflow:hidden;
      ">

        <div style="
          position:absolute;
          inset:0;
          background:linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.15));
        "></div>

        <div style="
          text-align:center;
          padding-top:10px;
          position:relative;
          color:white;
        ">
          
          ${y?`<img src="${y}" style="width:55px; margin-bottom:6px;" />`:``}

          <div style="
            font-size:${r?`14px`:`13px`};
            line-height:1.4;
            white-space:normal;
          ">
            ${C?`<div style="font-weight:600;">${C}</div>`:``}
            ${T?`<div>${T}</div>`:``}
            ${D?`<div>${D}</div>`:``}
          </div>

   <div style="
  margin-top:8px;
  text-align:center;
  white-space:nowrap;
  font-size:0;
">
  
  <span style="
    display:inline-block;
    font-size:${r?`22px`:n?`30px`:`20px`};
    font-weight:800;
    margin-right:12px;
    vertical-align:middle;

    font-family:'Bebas Neue','Oswald','Anton',sans-serif;
    letter-spacing:2px;

    color:#ffffff;

    text-shadow:
      0 2px 4px rgba(0,0,0,0.9),
      0 6px 12px rgba(0,0,0,0.8),
      0 0 20px rgba(0,0,0,0.6);
  ">
    CARTÃO DE MEMBRO
  </span>

  <span style="
    display:inline-block;
    font-size:${r?`26px`:n?`34px`:`24px`};
    font-weight:900;
    vertical-align:middle;
    letter-spacing:2px;

    font-family:'Poppins','Montserrat','Segoe UI',sans-serif;

    color:#ffffff;

    text-shadow:
      0 2px 4px rgba(0,0,0,0.95),
      0 8px 18px rgba(0,0,0,0.9),
      0 0 25px rgba(0,0,0,0.7);
  ">
    Nº ${e.numero_membro||`----`}
  </span>

</div>
        </div>

        ${e.foto?`
          <img src="${e.foto}" style="
            position:absolute;
            ${n?`top:15px; right:15px;`:`left:50%; transform:translateX(-50%); top:${i}px;`}
            width:${n?`150px`:`200px`};
            height:${n?`150px`:`200px`};
            object-fit:cover;
            border-radius:16px;
            border:4px solid white;
            box-shadow:0 12px 30px rgba(0,0,0,0.6);
          "/>
        `:``}

        <!-- INFO -->
        <div style="
          position:absolute;
          ${n?`bottom:18px; left:18px; width:65%;`:`left:50%; transform:translateX(-50%); top:${i+220}px; width:85%;`}
          padding:18px;
          border-radius:18px;
          background:rgba(0,0,0,0.50);
          color:#ffffff;
          text-align:left;
          box-shadow:0 12px 30px rgba(0,0,0,0.6);
          line-height:1.4;
          word-break:normal;
          white-space:normal;
        ">

          <div style="
            font-size:${r?`18px`:`24px`};
            font-weight:900;
            line-height:1.3;
            letter-spacing:0px;
          ">
            ${e.nome||`---`}
          </div>

          <div style="margin-top:10px; font-size:${r?`13px`:`15px`};">
            <span style="color:#cbd5e1;">Função:</span> 
            <span style="font-weight:700;"> ${e.cargos||`---`}</span>
          </div>

          <div style="font-size:${r?`13px`:`15px`};">
            <span style="color:#cbd5e1;">Departamento:</span> 
            <span style="font-weight:700;"> ${e.departamentos||`---`}</span>
          </div>

          <div style="margin-top:8px; font-size:${r?`13px`:`14px`};">
            <span style="color:#cbd5e1;">Batismo:</span> 
            <span style="font-weight:600;"> ${e.data_batismo||`---`}</span>
          </div>

          <div style="font-size:${r?`13px`:`14px`};">
            <span style="color:#cbd5e1;">Validade:</span> 
            <span style="font-weight:600;"> ${e.data_validade||`---`}</span>
          </div>

        </div>

        <!-- ASSINATURA -->
        <div style="
          position:absolute;
          ${n?`top:180px; right:18px; width:150px; text-align:center;`:`bottom:25px; width:100%; display:flex; flex-direction:column; align-items:center;`}
          color:white;
          font-size:13px;
        ">

          <div style="margin-bottom:20px; letter-spacing:1px;">
            Assinatura do Pastor
          </div>

          <div style="
            border-top:2px solid rgba(255,255,255,0.9);
            width:${n?`100%`:`180px`};
          "></div>

        </div>

      </div>
    `},V=(e=!1)=>{let t=x;return`
    <div style="
      width:${t?`900px`:`420px`};
      height:${t?`360px`:`650px`};
      position:relative;
      font-family:'Poppins','Inter','Segoe UI',sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius:24px;
      overflow:hidden;
      color:white;
    ">

      <!-- Efeito decorativo -->
      <div style="
        position:absolute;
        inset:0;
        background: radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 60%);
      "></div>

      <!-- Conteúdo -->
      <div style="
        position:relative;
        height:100%;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        text-align:center;
        padding:30px;
      ">

        <div style="
          font-size:${t?`28px`:`22px`};
          font-weight:900;
          margin-bottom:20px;
          letter-spacing:2px;
        ">
          CARTÃO DE MEMBRO
        </div>

        <div style="
          font-size:${t?`16px`:`14px`};
          max-width:80%;
          line-height:1.6;
          opacity:0.9;
        ">
          Este cartão é pessoal e intransmissível.<br/><br/>

          Em caso de perda, comunicar imediatamente à administração da igreja.<br/><br/>

          Manter sempre em local seguro e protegido.<br/><br/>
        </div>

        <div style="
          margin-top:30px;
          font-size:12px;
          opacity:0.6;
        ">
          IGREJA • DOCUMENTO OFICIAL
        </div>

      </div>
    </div>
  `};return(0,g.jsxs)(a,{container:!0,spacing:2,sx:{minHeight:`100vh`,p:2},children:[(0,g.jsx)(a,{item:!0,xs:12,md:6,children:(0,g.jsxs)(o,{sx:{p:3,borderRadius:4},children:[(0,g.jsx)(r,{fontWeight:900,mb:2,children:`Preview do Cartão`}),(0,g.jsx)(i,{dangerouslySetInnerHTML:{__html:B(e[0]||{})}}),(0,g.jsxs)(i,{mt:2,display:`flex`,flexDirection:`column`,gap:1,children:[(0,g.jsx)(d,{label:`Linha 1`,value:C,onChange:e=>w(e.target.value)}),(0,g.jsx)(d,{label:`Linha 2`,value:T,onChange:e=>E(e.target.value)}),(0,g.jsx)(d,{label:`Linha 3`,value:D,onChange:e=>O(e.target.value)})]}),(0,g.jsxs)(i,{sx:{display:`flex`,gap:1,mt:2},children:[(0,g.jsx)(l,{variant:`contained`,onClick:()=>S(!x),children:`Mudar Layout`}),(0,g.jsxs)(l,{component:`label`,children:[`Fundo`,(0,g.jsx)(`input`,{hidden:!0,type:`file`,onChange:P})]}),(0,g.jsxs)(l,{component:`label`,children:[`Logo`,(0,g.jsx)(`input`,{hidden:!0,type:`file`,onChange:F})]})]})]})}),(0,g.jsx)(a,{item:!0,xs:12,md:6,children:(0,g.jsxs)(o,{sx:{p:3,borderRadius:4},children:[(0,g.jsx)(d,{fullWidth:!0,placeholder:`Pesquisar membro...`,value:k,onChange:e=>{A(e.target.value),M(1)},sx:{mb:2}}),(0,g.jsx)(a,{container:!0,spacing:2,children:z.map(e=>(0,g.jsx)(a,{item:!0,xs:12,sm:6,md:4,children:(0,g.jsxs)(o,{onClick:()=>N(e.id),sx:{p:2,borderRadius:4,cursor:`pointer`,transition:`0.3s`,position:`relative`,border:n.includes(e.id)?`2px solid #4f46e5`:`1px solid #e5e7eb`,boxShadow:n.includes(e.id)?`0 10px 25px rgba(79,70,229,0.4)`:`0 5px 15px rgba(0,0,0,0.08)`,"&:hover":{transform:`translateY(-5px)`,boxShadow:`0 12px 30px rgba(0,0,0,0.15)`}},children:[(0,g.jsx)(s,{checked:n.includes(e.id),sx:{position:`absolute`,top:5,right:5}}),(0,g.jsxs)(i,{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:1,children:[(0,g.jsx)(u,{src:e.foto,sx:{width:70,height:70}}),(0,g.jsx)(r,{fontWeight:700,textAlign:`center`,children:e.nome})]})]})},e.id))}),(0,g.jsxs)(i,{mt:2,display:`flex`,justifyContent:`center`,gap:1,children:[(0,g.jsx)(l,{disabled:j===1,onClick:()=>M(j-1),children:`Anterior`}),(0,g.jsxs)(r,{alignSelf:`center`,children:[j,` / `,R||1]}),(0,g.jsx)(l,{disabled:j===R,onClick:()=>M(j+1),children:`Próximo`})]}),(0,g.jsx)(l,{fullWidth:!0,sx:{mt:2,background:`#4f46e5`,color:`#fff`,fontWeight:800},onClick:async()=>{let e=await I(),t=85.6,n=53.98,r=x?t:n,i=x?n:t,a=new f({orientation:x?`landscape`:`portrait`,unit:`mm`,format:[r,i]});for(let t=0;t<e.length;t++){let n=document.createElement(`div`);n.innerHTML=B(e[t],!0),n.style.width=x?`900px`:`420px`,n.style.height=x?`360px`:`650px`,n.style.position=`fixed`,n.style.top=`-9999px`,document.body.appendChild(n);let o=(await(0,h.default)(n,{scale:4,useCORS:!0,backgroundColor:null})).toDataURL(`image/png`),s=document.createElement(`div`);s.innerHTML=V(!0),s.style.width=x?`900px`:`420px`,s.style.height=x?`360px`:`650px`,s.style.position=`fixed`,s.style.top=`-9999px`,document.body.appendChild(s);let c=(await(0,h.default)(s,{scale:4,useCORS:!0,backgroundColor:null})).toDataURL(`image/png`);t>0&&a.addPage([r,i]),a.addImage(o,`PNG`,0,0,r,i),a.addPage([r,i]),a.addImage(c,`PNG`,0,0,r,i),document.body.removeChild(n),document.body.removeChild(s)}a.save(`cartoes.pdf`)},children:`GERAR CARTÕES`})]})})]})}export{_ as default};