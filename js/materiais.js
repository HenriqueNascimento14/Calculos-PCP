"use strict";

const MATERIAIS_PADRAO = {
  "PE": { nome:"PE", densidade:0.922 },
  "PE PIG": { nome:"PE PIG", densidade:0.940 },
  "PEAD": { nome:"PEAD", densidade:0.950 },
  "PEAD PIG": { nome:"PEAD PIG", densidade:0.950 },
  "Duravac": { nome:"Duravac", densidade:0.980 },
  "Duravac PIG": { nome:"Duravac PIG", densidade:0.980 },
  "Duraflex": { nome:"Duraflex", densidade:0.980 },
  "Duraflex PIG": { nome:"Duraflex PIG", densidade:0.980 },
  "PP CPP": { nome:"PP CPP", densidade:0.960 },
  "PP HSF": { nome:"PP HSF", densidade:0.960 },
  "PET Transp": { nome:"PET Transp", densidade:1.400 },
  "PET MET": { nome:"PET MET", densidade:1.400 },
  "PET Acrílico": { nome:"PET Acrílico", densidade:1.400 },
  "BOPP": { nome:"BOPP", densidade:0.905 },
  "PE Monoplast": { nome:"PE Monoplast", densidade:0.940 },
  "PE Monoplast PIG": { nome:"PE Monoplast PIG", densidade:0.950 },
  "BOPP Perolado": { nome:"BOPP Perolado", densidade:0.905 },
  "Alumínio": { nome:"Alumínio", densidade:2.700 }
};

const MATERIAIS = JSON.parse(JSON.stringify(MATERIAIS_PADRAO));

function listarMateriais(){
  return Object.values(MATERIAIS).sort((a,b)=>a.nome.localeCompare(b.nome,"pt-BR"));
}
function obterMaterial(nome){ return MATERIAIS[nome] || null; }
function adicionarMaterial(nome,densidade){
  nome=String(nome||"").trim(); densidade=Number(densidade);
  if(!nome || !Number.isFinite(densidade) || densidade<=0 || MATERIAIS[nome]) return false;
  MATERIAIS[nome]={nome,densidade}; return true;
}
function editarMaterial(nomeAtual,novoNome,novaDensidade){
  nomeAtual=String(nomeAtual||"").trim(); novoNome=String(novoNome||"").trim(); novaDensidade=Number(novaDensidade);
  if(!MATERIAIS[nomeAtual] || !novoNome || !Number.isFinite(novaDensidade) || novaDensidade<=0) return false;
  if(novoNome!==nomeAtual && MATERIAIS[novoNome]) return false;
  delete MATERIAIS[nomeAtual]; MATERIAIS[novoNome]={nome:novoNome,densidade:novaDensidade}; return true;
}
function excluirMaterial(nome){ if(!MATERIAIS[nome]) return false; delete MATERIAIS[nome]; return true; }
function restaurarMateriaisPadrao(){ Object.keys(MATERIAIS).forEach(k=>delete MATERIAIS[k]); Object.entries(MATERIAIS_PADRAO).forEach(([k,v])=>MATERIAIS[k]={...v}); }
