const tamanhos = {
    "Jogo de banheiro": [["Pequeno", "40 x 60 cm"], ["Médio", "50 x 70 cm"], ["Grande", "60 x 90 cm"]],
    "Tapete": [["Pequeno", "50 x 80 cm"], ["Médio", "80 x 120 cm"], ["Grande", "120 x 180 cm"]],
    "Sousplat": [["Pequeno", "30 cm"], ["Médio", "35 cm"], ["Grande", "40 cm"]],
    "Centro de mesa": [["Pequeno", "30 cm"], ["Médio", "45 cm"], ["Grande", "60 cm"]],
    "Caminho de mesa": [["Pequeno", "30 x 100 cm"], ["Médio", "35 x 140 cm"], ["Grande", "40 x 180 cm"]]
};

const campoProduto = document.querySelector("#produto");
const campoTamanho = document.querySelector("#tamanho");

if (campoProduto && campoTamanho) {
    campoProduto.addEventListener("change", function () {
        const lista = tamanhos[campoProduto.value];

        campoTamanho.innerHTML = "";

        if (!lista) {
            campoTamanho.add(new Option("Escolha o produto primeiro", ""));
            campoTamanho.disabled = true;
            return;
        }

        campoTamanho.disabled = false;
        campoTamanho.add(new Option("Escolha o tamanho", ""));

        lista.forEach(function (item) {
            const texto = item[0] + " – " + item[1];
            campoTamanho.add(new Option(texto, texto));
        });

        campoTamanho.add(new Option("Outro (descrever nos detalhes)", "Outro tamanho"));
    });
}

const formulario = document.querySelector("#form-encomenda");

if (formulario) {
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const produto = document.querySelector("#produto").value;
        const cores = document.querySelector("#cores").value.trim();
        const tamanho = document.querySelector("#tamanho").value;
        const detalhes = document.querySelector("#detalhes").value.trim();

        const mensagem =
            `Olá! Meu nome é ${nome}.\n` +
            `Quero encomendar: ${produto}\n` +
            `Cores: ${cores || "a combinar"}\n` +
            `Tamanho: ${tamanho || "a combinar"}\n` +
            `Detalhes: ${detalhes || "nenhum"}`;

        const link = "https://wa.me/5512982131489?text=" + encodeURIComponent(mensagem);
        window.open(link, "_blank");
    });
}