const PROCESSOS = {
    "sacaria-impressa": {nome:"Sacaria Impressa",tipoPedido:"metragem",refile:{valor:2,unidade:"cm",etapa:"final"},tinta:{gramaturaPadrao:1.5,unidade:"g/m²"},adesivo:false,laminado:false,impresso:true,sacaria:true},
    "extrusao-rebobinagem": {
        nome: "Extrusão → Rebobinagem",
        tipoPedido: "peso",

        refile: {
            valor: 1.5,
            unidade: "cm",
            etapa: "final"
        },

        tinta: false,
        adesivo: false,
        laminado: false,
        impresso: false,
        sacaria: false
    },

    "impresso-monocamada": {
        nome: "Impresso Monocamada",
        tipoPedido: "peso",

        refile: {
            valor: 1.5,
            unidade: "cm",
            etapa: "final"
        },

        tinta: {
            gramaturaPadrao: 1.5,
            unidade: "g/m²"
        },

        adesivo: false,
        laminado: false,
        impresso: true,
        sacaria: false
    },

    "impresso-laminado": {
        nome: "Impresso Laminado",
        tipoPedido: "peso",

        refile: {
            valor: 2.0,
            unidade: "cm",
            etapa: "final"
        },

        tinta: {
            gramaturaPadrao: 1.5,
            unidade: "g/m²"
        },

        adesivo: {
            gramaturaPadrao: 2.0,
            unidade: "g/m²"
        },

        laminado: true,
        impresso: true,
        sacaria: false
    },

    "liso-laminado": {
        nome: "Liso Laminado",
        tipoPedido: "peso",

        refile: {
            valor: 2.0,
            unidade: "cm",
            etapa: "final"
        },

        tinta: false,

        adesivo: {
            gramaturaPadrao: 2.0,
            unidade: "g/m²"
        },

        laminado: true,
        impresso: false,
        sacaria: false
    },

    "sacaria-lisa": {
        nome: "Sacaria Lisa",
        tipoPedido: "metragem",

        refile: {
            valor: 2.0,
            unidade: "cm",
            etapa: "final"
        },

        tinta: false,
        adesivo: false,
        laminado: false,
        impresso: false,
        sacaria: true
    },

    "sacaria-impressa-laminada": {
        nome: "Sacaria Impressa Laminada",
        tipoPedido: "metragem",

        refile: {
            valor: 2.0,
            unidade: "cm",
            etapa: "final"
        },

        tinta: {
            gramaturaPadrao: 1.5,
            unidade: "g/m²"
        },

        adesivo: {
            gramaturaPadrao: 2.0,
            unidade: "g/m²"
        },

        laminado: true,
        impresso: true,
        sacaria: true
    }
};


// =============================================
// BUSCAR PROCESSO
// =============================================

function obterProcesso(id) {
    return PROCESSOS[id] || null;
}


// =============================================
// LISTAR PROCESSOS
// =============================================

function listarProcessos() {
    return Object.entries(PROCESSOS).map(([id, processo]) => ({
        id,
        ...processo
    }));
}


// =============================================
// VERIFICAÇÕES
// =============================================

function processoPossuiTinta(id) {
    const processo = obterProcesso(id);

    return processo ? Boolean(processo.tinta) : false;
}


function processoPossuiAdesivo(id) {
    const processo = obterProcesso(id);

    return processo ? Boolean(processo.adesivo) : false;
}


function processoPossuiLaminacao(id) {
    const processo = obterProcesso(id);

    return processo ? processo.laminado : false;
}


function processoEhSacaria(id) {
    const processo = obterProcesso(id);

    return processo ? processo.sacaria : false;
}