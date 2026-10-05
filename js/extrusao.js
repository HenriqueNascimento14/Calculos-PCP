// ============================================================
// PCP CALC - PLANEJAMENTO DE EXTRUSÃO
// ============================================================
//
// Fórmula validada com a PLANILHA PCP:
//
// Peso = π × (R² - r²) × largura(cm) × densidade / 1000
//
// R = raio externo
// r = raio interno
//
// ============================================================


// ============================================================
// CONFIGURAÇÕES DA EXTRUSÃO
// ============================================================

const CONFIGURACOES_EXTRUSAO = {

    "2x1": {
        id: "2x1",
        nome: "2 × 1",
        quantidadeBobinas: 2
    },

    "4x2": {
        id: "4x2",
        nome: "4 × 2",
        quantidadeBobinas: 4
    },

    "6x3": {
        id: "6x3",
        nome: "6 × 3",
        quantidadeBobinas: 6
    }

};


// ============================================================
// DESTINOS
// ============================================================

const DESTINOS_EXTRUSAO = {

    REBOBINAGEM: "rebobinagem",

    IMPRESSAO: "impressao",

    LAMINACAO: "laminacao",

    CORTE_SOLDA: "corte-solda"

};


// ============================================================
// MATERIAIS COM LIMITE DE 80 CM NA LAMINAÇÃO
// ============================================================

const MATERIAIS_LAMINACAO_80 = [

    "PE",
    "PE PIG",

    "PEAD",
    "PEAD PIG",

    "PE Monoplast",
    "PE Monoplast PIG"

];


// ============================================================
// MATERIAIS COM LIMITE DE 92 CM NA LAMINAÇÃO
// ============================================================

const MATERIAIS_LAMINACAO_92 = [

    "Duravac",
    "Duravac PIG",

    "Duraflex",
    "Duraflex PIG"

];


// ============================================================
// BUSCAR CONFIGURAÇÃO
// ============================================================

function obterConfiguracaoExtrusao(id) {

    return CONFIGURACOES_EXTRUSAO[id] || null;

}


// ============================================================
// LISTAR CONFIGURAÇÕES
// ============================================================

function listarConfiguracoesExtrusao() {

    return Object.values(CONFIGURACOES_EXTRUSAO);

}


// ============================================================
// LIMITE DE DIÂMETRO PELO PRÓXIMO PROCESSO
// ============================================================

function obterDiametroMaximo(material, destino) {

    if (!material || !destino) {
        return null;
    }


    // IMPRESSÃO
    if (destino === DESTINOS_EXTRUSAO.IMPRESSAO) {

        return 92;

    }


    // LAMINAÇÃO
    if (destino === DESTINOS_EXTRUSAO.LAMINACAO) {


        if (
            MATERIAIS_LAMINACAO_80.includes(material)
        ) {

            return 80;

        }


        if (
            MATERIAIS_LAMINACAO_92.includes(material)
        ) {

            return 92;

        }


        return null;

    }


    // Ainda não temos limite definido
    // para os demais processos.

    return null;

}


// ============================================================
// CALCULAR PESO DE UMA BOBINA
// ============================================================
//
// Baseado diretamente na fórmula da planilha:
//
// π × (R² - r²) × largura × densidade / 1000
//
// Entrada:
//
// diametroExterno -> cm
// diametroInterno -> cm
// larguraCM       -> cm
// densidade       -> g/cm³
//
// Saída:
//
// kg
//
// ============================================================

function calcularPesoBobina(
    diametroExterno,
    diametroInterno,
    larguraCM,
    densidade
) {

    if (
        diametroExterno <= 0 ||
        diametroInterno <= 0 ||
        larguraCM <= 0 ||
        densidade <= 0
    ) {

        return 0;

    }


    if (
        diametroExterno <= diametroInterno
    ) {

        return 0;

    }


    const raioExterno =
        diametroExterno / 2;


    const raioInterno =
        diametroInterno / 2;


    const peso =

        (
            Math.PI *

            (
                Math.pow(raioExterno, 2) -
                Math.pow(raioInterno, 2)
            ) *

            larguraCM *

            densidade

        ) / 1000;


    return peso;

}


// ============================================================
// CALCULAR DIÂMETRO NECESSÁRIO
// ============================================================
//
// Aqui fazemos o cálculo INVERSO.
//
// Em vez de:
//
// diâmetro -> peso
//
// fazemos:
//
// peso -> diâmetro
//
// Isso permite que o PCP CALC descubra sozinho
// qual diâmetro será necessário.
//
// ============================================================

function calcularDiametroPorPeso(
    pesoBobina,
    diametroInterno,
    larguraCM,
    densidade
) {

    if (
        pesoBobina <= 0 ||
        diametroInterno <= 0 ||
        larguraCM <= 0 ||
        densidade <= 0
    ) {

        return 0;

    }


    const raioInterno =
        diametroInterno / 2;


    const raioExternoQuadrado =

        (

            pesoBobina *

            1000

        ) /

        (

            Math.PI *

            larguraCM *

            densidade

        )

        +

        Math.pow(raioInterno, 2);


    const raioExterno =
        Math.sqrt(
            raioExternoQuadrado
        );


    const diametroExterno =
        raioExterno * 2;


    return diametroExterno;

}


// ============================================================
// PESO MÉDIO POR BOBINA
// ============================================================

function calcularPesoMedioPorBobina(
    pesoTotal,
    quantidadeBobinas
) {

    if (
        pesoTotal <= 0 ||
        quantidadeBobinas <= 0
    ) {

        return 0;

    }


    return pesoTotal / quantidadeBobinas;

}


// ============================================================
// ANALISAR UMA CONFIGURAÇÃO
// ============================================================
//
// Exemplo:
//
// Pedido = 1000 kg
//
// configuração = 4×2
//
// 4 bobinas
//
// peso/bobina = 250 kg
//
// O sistema calcula qual diâmetro cada bobina
// precisa ter.
//
// ============================================================

function analisarConfiguracao({
    pesoTotal, configuracao, diametroInterno, larguraCM, densidade, diametroMaximo
}) {
    const config = obterConfiguracaoExtrusao(configuracao);
    if (!config) return null;

    // 2×1, 4×2 e 6×3 são configurações de saída, não limites de bobinas.
    // A quantidade cresce em múltiplos da configuração até respeitar o diâmetro máximo.
    const multiplo = config.quantidadeBobinas;
    let quantidadeBobinas = multiplo;

    if (diametroMaximo !== null && diametroMaximo !== undefined) {
        const minimo = calcularQuantidadeMinimaBobinas({
            pesoTotal, diametroMaximo, diametroInterno, larguraCM, densidade
        });
        if (minimo && minimo.quantidadeMinima > 0) {
            quantidadeBobinas = Math.ceil(minimo.quantidadeMinima / multiplo) * multiplo;
        }
    }

    const pesoPorBobina = calcularPesoMedioPorBobina(pesoTotal, quantidadeBobinas);
    const diametroNecessario = calcularDiametroPorPeso(
        pesoPorBobina, diametroInterno, larguraCM, densidade
    );
    const permitido = diametroMaximo == null || diametroNecessario <= diametroMaximo + 1e-9;

    return {
        configuracao: config.id, nome: config.nome, quantidadeBobinas,
        pesoTotal, pesoPorBobina, diametroNecessario, diametroMaximo, permitido
    };
}

// ============================================================
// ANALISAR TODAS AS CONFIGURAÇÕES
// ============================================================
//
// Testa:
//
// 2×1
// 4×2
// 6×3
//
// ============================================================

function analisarTodasConfiguracoes({

    pesoTotal,

    diametroInterno,

    larguraCM,

    densidade,

    diametroMaximo

}) {


    return listarConfiguracoesExtrusao()

        .map((config) =>

            analisarConfiguracao({

                pesoTotal,

                configuracao:
                    config.id,

                diametroInterno,

                larguraCM,

                densidade,

                diametroMaximo

            })

        );

}


// ============================================================
// QUANTIDADE MÍNIMA DE BOBINAS
// ============================================================
//
// Descobre quantas bobinas seriam necessárias
// respeitando um determinado diâmetro máximo.
//
// ============================================================

function calcularQuantidadeMinimaBobinas({

    pesoTotal,

    diametroMaximo,

    diametroInterno,

    larguraCM,

    densidade

}) {


    const pesoMaximoBobina =
        calcularPesoBobina(

            diametroMaximo,

            diametroInterno,

            larguraCM,

            densidade

        );


    if (
        pesoMaximoBobina <= 0
    ) {

        return null;

    }


    const quantidade =
        Math.ceil(

            pesoTotal /
            pesoMaximoBobina

        );


    return {

        pesoMaximoBobina,

        quantidadeMinima:
            quantidade

    };

}


// ============================================================
// PROCURAR MELHORES OPÇÕES
// ============================================================
//
// Esta função é o coração do planejamento.
//
// O sistema:
//
// 1. recebe os kg necessários
// 2. verifica o limite do próximo processo
// 3. testa 2×1
// 4. testa 4×2
// 5. testa 6×3
// 6. calcula automaticamente o diâmetro
// 7. informa quais opções são possíveis
//
// ============================================================

function encontrarMelhoresOpcoesExtrusao({

    pesoTotal,

    material,

    destino,

    diametroInterno,

    larguraCM,

    densidade

}) {


    const diametroMaximo =
        obterDiametroMaximo(
            material,
            destino
        );


    const configuracoes =
        analisarTodasConfiguracoes({

            pesoTotal,

            diametroInterno,

            larguraCM,

            densidade,

            diametroMaximo

        });


    // --------------------------------------------------------
    // CONFIGURAÇÕES POSSÍVEIS
    // --------------------------------------------------------

    const possiveis =
        configuracoes.filter(
            (item) => item.permitido
        );


    // --------------------------------------------------------
    // CONFIGURAÇÕES IMPOSSÍVEIS
    // --------------------------------------------------------

    const impossiveis =
        configuracoes.filter(
            (item) => !item.permitido
        );


    // --------------------------------------------------------
    // QUANTIDADE MÍNIMA
    // --------------------------------------------------------

    let quantidadeMinima = null;


    if (diametroMaximo !== null) {

        quantidadeMinima =
            calcularQuantidadeMinimaBobinas({

                pesoTotal,

                diametroMaximo,

                diametroInterno,

                larguraCM,

                densidade

            });

    }


    // --------------------------------------------------------
    // ORDENAR MELHORES OPÇÕES
    // --------------------------------------------------------
    //
    // Primeiro aparecem as opções com menos bobinas.
    //
    // Isso não significa que são automaticamente
    // a decisão final do PCP.
    //
    // --------------------------------------------------------

    possiveis.sort(
        (a, b) =>
            a.quantidadeBobinas -
            b.quantidadeBobinas
    );


    return {

        pesoTotal,

        material,

        destino,

        densidade,

        larguraCM,

        diametroInterno,

        diametroMaximo,

        quantidadeMinima,

        configuracoes,

        possiveis,

        impossiveis

    };

}


// ============================================================
// PLANEJAMENTO COMPLETO
// ============================================================

function criarPlanejamentoExtrusao({

    pesoNecessario,

    material,

    destino,

    diametroInterno,

    larguraMM

}) {


    // --------------------------------------------------------
    // MATERIAL
    // --------------------------------------------------------

    const dadosMaterial =
        obterMaterial(material);


    if (!dadosMaterial) {

        return {

            erro:
                "Material não encontrado."

        };

    }


    // --------------------------------------------------------
    // CONVERTER LARGURA
    // --------------------------------------------------------

    const larguraCM =
        larguraMM / 10;


    // --------------------------------------------------------
    // PLANEJAMENTO
    // --------------------------------------------------------

    return encontrarMelhoresOpcoesExtrusao({

        pesoTotal:
            pesoNecessario,

        material,

        destino,

        diametroInterno,

        larguraCM,

        densidade:
            dadosMaterial.densidade

    });

}