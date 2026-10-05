"use strict";
// Fórmulas transcritas da aba BOBINAS de PLANILHA PCP.xlsx.
const CALCULADORAS={
 diametro:{nome:"Diâmetro da bobina pelo peso",formula:"Ø = √[(4 × peso × 1.000) ÷ (densidade × 3,1416 × largura) + tubete²]",campos:[["peso","Peso do filme","kg"],["larg","Largura","cm"],["den","Densidade","g/cm³"],["tub","Diâmetro do tubete","cm"]]},
 pesoDiametro:{nome:"Peso da bobina pelo diâmetro",formula:"Peso = 3,14 × [(Ø externo ÷ 2)² − (Ø tubete ÷ 2)²] × largura × densidade ÷ 1.000",campos:[["diam","Diâmetro externo","cm"],["tub","Diâmetro do tubete","cm"],["larg","Largura","cm"],["den","Densidade","g/cm³"]]},
 metragemPeso:{nome:"Metragem → Peso",formula:"Peso (kg) = metragem × largura (cm) × espessura (µm) × densidade × 0,00001",campos:[["metr","Metragem","m"],["larg","Largura","cm"],["esp","Espessura","µm"],["den","Densidade","g/cm³"]]},
 pesoMetragem:{nome:"Peso → Metragem",formula:"Metragem (m) = peso ÷ [largura (cm) × espessura (µm) × densidade × 0,00001]",campos:[["peso","Peso","kg"],["larg","Largura","cm"],["esp","Espessura","µm"],["den","Densidade","g/cm³"]]},
 densidade:{nome:"Densidade pela gramatura",formula:"Densidade (g/cm³) = gramatura (g/m²) ÷ espessura (µm)",campos:[["gram","Gramatura","g/m²"],["esp","Espessura","µm"]],nota:"Com gramatura em g/m², a largura já está considerada na área. A espessura é necessária para descobrir a densidade."},
 gramatura:{nome:"Gramatura pela densidade e espessura",formula:"Gramatura (g/m²) = densidade (g/cm³) × espessura (µm)",campos:[["den","Densidade","g/cm³"],["esp","Espessura","µm"]]},
 camadas:{nome:"Espessura do filme / micras e porcentagem da camada"}
};
function calcularSimples(tipo,x){
 const def=CALCULADORAS[tipo];if(!def||tipo==="camadas")throw Error("Selecione um cálculo.");
 for(const [k,label]of def.campos)if(!Number.isFinite(x[k])||x[k]<=0)throw Error(`Informe ${label.toLowerCase()} maior que zero.`);
 switch(tipo){
 case "diametro":return {valor:Math.sqrt(4*x.peso*1000/(x.den*3.1416*x.larg)+x.tub**2),unidade:"cm"};
 case "pesoDiametro":if(x.diam<=x.tub)throw Error("O diâmetro externo deve ser maior que o tubete.");return {valor:3.14*((x.diam/2)**2-(x.tub/2)**2)*x.larg*x.den/1000,unidade:"kg"};
 case "metragemPeso":return {valor:x.metr*x.larg*x.esp*x.den*0.00001,unidade:"kg"};
 case "pesoMetragem":return {valor:x.peso/(x.larg*x.esp*x.den*0.00001),unidade:"m"};
 case "densidade":return {valor:x.gram/x.esp,unidade:"g/cm³"};
 case "gramatura":return {valor:x.den*x.esp,unidade:"g/m²"};
 }
}
function calcularDivisaoCamadas(total,valores,modo){
 if(!Number.isFinite(total)||total<=0)throw Error("Informe a espessura total maior que zero.");
 if(![3,5,7].includes(valores.length)||valores.some(x=>!Number.isFinite(x)||x<0))throw Error("Informe valores não negativos para todas as camadas.");
 const rows=valores.map((x,i)=>({camada:String.fromCharCode(65+i),micras:modo==="percentual"?total*x/100:x,percentual:modo==="percentual"?x:x/total*100}));
 const micras=rows.reduce((a,r)=>a+r.micras,0),percentual=rows.reduce((a,r)=>a+r.percentual,0);
 return {rows,micras,percentual,diferenca:total-micras,fechou:Math.abs(total-micras)<0.000001};
}
function renderCalculadora(){
 gid("calculadoraContainer").innerHTML=card("CALCULADORA","Cálculos rápidos","Selecione o cálculo e informe os valores. Larguras e diâmetros em centímetros, conforme a planilha.",`<div class="form-group"><label for="calcTipo">O que você quer calcular?</label><select id="calcTipo">${Object.entries(CALCULADORAS).map(([k,d])=>`<option value="${k}">${d.nome}</option>`).join("")}</select></div>`)+`<div id="calcForm"></div><div id="calcResultado" aria-live="polite"></div>`;
 gid("calcTipo").onchange=renderFormularioCalculadora;renderFormularioCalculadora();
}
function renderFormularioCalculadora(){
 const tipo=v("calcTipo"),d=CALCULADORAS[tipo];gid("calcResultado").innerHTML="";
 if(tipo==="camadas"){
 gid("calcForm").innerHTML=card("EXTRUSÃO",d.nome,"Informe a espessura total e distribua as camadas. O cálculo mostra se a soma fecha com o filme.",`<div class="form-grid">${campoN("qcTotal","Espessura do filme","µm","104")}<div class="form-group"><label>Máquina</label><select id="qcQtd"><option value="3">3 camadas</option><option value="5" selected>5 camadas</option><option value="7">7 camadas</option></select></div><div class="form-group"><label>Valores a informar</label><select id="qcModo"><option value="micras">Micras da camada → porcentagem</option><option value="percentual">Porcentagem da camada → micras</option></select></div></div><div class="form-grid" id="qcCamadas"></div>${botao("qcCalcular","Calcular camadas")}`);
 const rebuild=()=>{const qtd=n("qcQtd"),modo=v("qcModo");gid("qcCamadas").innerHTML=Array.from({length:qtd},(_,i)=>campoN("qcCam"+i,"Camada "+String.fromCharCode(65+i),modo==="micras"?"µm":"%","0")).join("");gid("calcResultado").innerHTML=""};gid("qcQtd").onchange=rebuild;gid("qcModo").onchange=rebuild;rebuild();
 gid("qcCalcular").onclick=()=>{try{const r=calcularDivisaoCamadas(n("qcTotal"),Array.from({length:n("qcQtd")},(_,i)=>n("qcCam"+i)),v("qcModo"));gid("calcResultado").innerHTML=card("RESULTADO","Divisão das camadas",r.fechou?"A soma das camadas fecha com a espessura do filme.":`Confira a distribuição: diferença de ${fmt(r.diferenca)} µm em relação à espessura do filme.`,`<div class="table-wrap"><table><thead><tr><th>Camada</th><th>Micras da camada</th><th>Porcentagem da camada</th></tr></thead><tbody>${r.rows.map(row=>`<tr><td>${row.camada}</td><td>${fmt(row.micras)} µm</td><td>${fmt(row.percentual)}%</td></tr>`).join("")}<tr><th>Total</th><th>${fmt(r.micras)} µm</th><th>${fmt(r.percentual)}%</th></tr></tbody></table></div><div class="notice">Porcentagem = micras da camada ÷ espessura do filme × 100. Micras = espessura do filme × porcentagem ÷ 100.</div>`)}catch(e){gid("calcResultado").innerHTML=`<div class="error">${e.message}</div>`}};
 }else{
 gid("calcForm").innerHTML=card("DADOS",d.nome,d.nota||"Preencha os campos abaixo.",`<div class="form-grid">${d.campos.map(([k,l,u])=>campoN("qc"+k,l,u,"0")).join("")}</div>${botao("qcCalcular","Calcular")}<div class="notice">${d.formula}</div>`);
 gid("qcCalcular").onclick=()=>{try{const r=calcularSimples(tipo,Object.fromEntries(d.campos.map(([k])=>[k,n("qc"+k)])));gid("calcResultado").innerHTML=card("RESULTADO",d.nome,"",`<div class="summary-grid"><div class="summary-item highlight"><span>Resultado</span><strong>${fmt(r.valor,r.unidade==="g/cm³"?4:2)} ${r.unidade}</strong></div></div>`)}catch(e){gid("calcResultado").innerHTML=`<div class="error">${e.message}</div>`}};
 }
}
telas.calculadora=gid("screenCalculadora");
gid("menuCalculadora").addEventListener("click",()=>nav("calculadora","menuCalculadora","Calculadora","Conversões e cálculos técnicos rápidos.","PCP / Calculadora",renderCalculadora));
