const catalogo = {
    "Jogo de Banheiro": [
        { tamanho: "Pequeno", medida: "40 x 60 cm", preco: 90 },
        { tamanho: "Médio", medida: "50 x 70 cm", preco: 120 },
        { tamanho: "Grande", medida: "60 x 90 cm", preco: 150 }
    ],
    "Tapetes": [
        { tamanho: "Pequeno", medida: "50 x 80 cm", preco: 80 },
        { tamanho: "Médio", medida: "80 x 120 cm", preco: 150 },
        { tamanho: "Grande", medida: "120 x 180 cm", preco: 280 }
    ],
    "Sousplats": [
        { tamanho: "Pequeno", medida: "30 cm", preco: 25 },
        { tamanho: "Médio", medida: "35 cm", preco: 30 },
        { tamanho: "Grande", medida: "40 cm", preco: 35 }
    ],
    "Centro de Mesa": [
        { tamanho: "Pequeno", medida: "30 cm", preco: 40 },
        { tamanho: "Médio", medida: "45 cm", preco: 70 },
        { tamanho: "Grande", medida: "60 cm", preco: 110 }
    ],
    "Caminho de Mesa": [
        { tamanho: "Pequeno", medida: "30 x 100 cm", preco: 60 },
        { tamanho: "Médio", medida: "35 x 140 cm", preco: 90 },
        { tamanho: "Grande", medida: "40 x 180 cm", preco: 130 }
    ]
};

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function lerCarrinho() {
    const texto = localStorage.getItem("carrinho");
    if (texto) {
        return JSON.parse(texto);
    }
    return [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarContador() {
    const contador = document.querySelector("#contador-carrinho");
    if (!contador) {
        return;
    }

    const carrinho = lerCarrinho();
    let total = 0;

    carrinho.forEach(function (item) {
        total = total + item.quantidade;
    });

    contador.textContent = total;
}
function adicionarAoCarrinho(produto, tamanho, medida, preco, quantidade) {
    const carrinho = lerCarrinho();

    const existente = carrinho.find(function (item) {
        return item.produto === produto && item.tamanho === tamanho;
    });

    if (existente) {
        existente.quantidade = existente.quantidade + quantidade;
    } else {
        carrinho.push({
            produto: produto,
            tamanho: tamanho,
            medida: medida,
            preco: preco,
            quantidade: quantidade
        });
    }

    salvarCarrinho(carrinho);
    atualizarContador();
}

function alterarQuantidade(indice, variacao) {
    const carrinho = lerCarrinho();
    const item = carrinho[indice];

    if (!item) {
        return;
    }

    item.quantidade = Math.max(1, item.quantidade + variacao);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
    atualizarContador();
}

function removerDoCarrinho(indice) {
    const carrinho = lerCarrinho();
    carrinho.splice(indice, 1);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
    atualizarContador();
}

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) {
        elemento.className = classe;
    }
    if (texto !== undefined) {
        elemento.textContent = texto;
    }
    return elemento;
}

function renderizarCarrinho() {
    const lista = document.querySelector("#lista-produtos");
    if (!lista) {
        return;
    }

    const carrinho = lerCarrinho();
    const estadoVazio = document.querySelector("#carrinho-vazio");
    const subtotalElemento = document.querySelector("#subtotal");
    const totalElemento = document.querySelector("#total");
    const botaoFinalizar = document.querySelector("#finalizar-pedido");
    const subtotal = carrinho.reduce(function (soma, item) {
        return soma + item.preco * item.quantidade;
    }, 0);

    estadoVazio.hidden = carrinho.length > 0;
    botaoFinalizar.disabled = carrinho.length === 0;
    subtotalElemento.textContent = formatarPreco(subtotal);
    totalElemento.textContent = formatarPreco(subtotal);
    lista.replaceChildren();

    const ilustracoes = {
        "Jogo de Banheiro": "🛁",
        "Tapetes": "🧶",
        "Sousplats": "🍽️",
        "Centro de Mesa": "🌸",
        "Caminho de Mesa": "🪡"
    };

    carrinho.forEach(function (item, indice) {
        const linha = criarElemento("article", "item-carrinho");
        const ilustracao = criarElemento("div", "ilustracao-produto", ilustracoes[item.produto] || "🧶");
        ilustracao.setAttribute("aria-hidden", "true");

        const informacoes = criarElemento("div", "info-produto");
        informacoes.append(
            criarElemento("h2", "", item.produto),
            criarElemento("p", "detalhe-produto", item.tamanho + " · " + item.medida),
            criarElemento("p", "preco-produto", formatarPreco(item.preco) + " cada")
        );

        const acoes = criarElemento("div", "acoes-produto");
        const quantidade = criarElemento("div", "controle-quantidade");
        const diminuir = criarElemento("button", "ajuste-quantidade", "−");
        diminuir.type = "button";
        diminuir.disabled = item.quantidade <= 1;
        diminuir.setAttribute("aria-label", "Diminuir quantidade de " + item.produto);
        diminuir.addEventListener("click", function () {
            alterarQuantidade(indice, -1);
        });

        const valorQuantidade = criarElemento("span", "valor-quantidade", String(item.quantidade));
        const aumentar = criarElemento("button", "ajuste-quantidade", "+");
        aumentar.type = "button";
        aumentar.setAttribute("aria-label", "Aumentar quantidade de " + item.produto);
        aumentar.addEventListener("click", function () {
            alterarQuantidade(indice, 1);
        });

        quantidade.append(diminuir, valorQuantidade, aumentar);

        const remover = criarElemento("button", "remover-produto", "Remover");
        remover.type = "button";
        remover.addEventListener("click", function () {
            removerDoCarrinho(indice);
        });

        acoes.append(quantidade, remover);

        const totalItem = criarElemento("strong", "total-item", formatarPreco(item.preco * item.quantidade));
        linha.append(ilustracao, informacoes, acoes, totalItem);
        lista.append(linha);
    });
}

document.querySelectorAll(".compra").forEach(function (bloco) {
    const produto = bloco.dataset.produto;
    const campoTamanho = bloco.querySelector(".escolha-tamanho");
    const campoQuantidade = bloco.querySelector(".quantidade");
    const botao = bloco.querySelector(".btn-adicionar");
    const opcoes = catalogo[produto];

    opcoes.forEach(function (opcao, posicao) {
        const texto = opcao.tamanho + " – " + opcao.medida + " – " + formatarPreco(opcao.preco);
        campoTamanho.add(new Option(texto, posicao));
    });

    botao.addEventListener("click", function () {
        const opcao = opcoes[campoTamanho.value];
        const quantidade = parseInt(campoQuantidade.value);

        if (!quantidade || quantidade < 1) {
            alert("Escolha uma quantidade válida.");
            return;
        }

        adicionarAoCarrinho(produto, opcao.tamanho, opcao.medida, opcao.preco, quantidade);

        botao.textContent = "ADICIONADO ✓";
        setTimeout(function () {
            botao.textContent = "ADICIONAR AO CARRINHO";
        }, 1500);
    });
});

atualizarContador();
renderizarCarrinho();

window.addEventListener("storage", function (evento) {
    if (evento.key === "carrinho") {
        atualizarContador();
        renderizarCarrinho();
    }
});