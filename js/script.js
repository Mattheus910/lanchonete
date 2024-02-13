const restaurante = {

    tela: {
        inicial: document.querySelector(".inicial"),
        carrinho: document.querySelector("#carrinho"),
    },

    botoes: {
        pedir: document.querySelectorAll(".pedir"),
        carrinho: document.querySelector(".cart"),
        voltar: document.querySelector(".back button"),
        remover: document.querySelectorAll(".remover"),
        adicionar: document.querySelectorAll(".adicionar"),
        enviar: document.querySelector("#enviar"),
        search: document.querySelector("#search"),
        filter: document.getElementById(".filter")
    },

    produto: {
        container: document.querySelectorAll(".product-container"),
        nome: document.querySelectorAll(".product-container .name"),
        preco: document.querySelector(".price p"),
        foto: document.querySelector(".img img"),
        ingrediente: document.querySelector(".ingredientes")
    },

    pedido: {
        pedidos: document.querySelector(".pedidos"),
        nome: document.querySelector(".resumo-pedido .name"),
        preco: document.querySelector(".price p"),
        quantidade: document.querySelector(".quantidade"),
        foto: document.querySelector(".resumo-pedido img"),
        total: document.querySelector(".total p span")
    },

    valores: {
        lanche: 15.00,
        pizza: 25.00,
        hotdog: 10.00,
        suco: 6.00,
        cerveja: 8.00,
        refrigerante: 5.00,
        bolo: 20.00,
        batata: 12.00,
        brigadeiro: 3.00,
        sorvete: 7.00,
    },

    endereco: {
        cep: document.querySelector("#cep"),
        numero: document.querySelector("#numero"),
        logradouro: document.querySelector("#logradouro"),
        bairro: document.querySelector("#bairro"),
        cidade: document.querySelector("#cidade"),
        estado: document.querySelector("#estado"),
    }

}

let pedidos = 0;


// funções

// adiciona o balão de pedido no botão do carrinho
function toggleVisibility() {
    restaurante.botoes.carrinho.classList.toggle("ativo");
}

// esconde a tela inicial e aparece a tela do carrinho
function toggleCart() {
    restaurante.tela.inicial.classList.toggle("esconde");
    restaurante.tela.carrinho.classList.toggle("aparece");
}

function addPedidoCarrinho(event) {

    const botaoPedir = event.target;
    const produtoContainer = botaoPedir.closest(".product-container");


    const divPedido = document.createElement("div")
    divPedido.classList.add("resumo-pedido");
    restaurante.pedido.pedidos.appendChild(divPedido);

    const foto = produtoContainer.querySelector("img").cloneNode(true);
    divPedido.appendChild(foto);

    const nome = produtoContainer.querySelector(".name").cloneNode(true);
    divPedido.appendChild(nome);

    const divQuant = document.createElement("div");
    divQuant.classList.add("quant");
    divPedido.appendChild(divQuant);

    const btnRemove = document.createElement("button")
    btnRemove.classList.add("remover");
    btnRemove.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
    </svg>`;
    divQuant.appendChild(btnRemove);

    const quantidade = document.createElement("p")
    quantidade.classList.add("quantidade");
    quantidade.innerText = 1;
    divQuant.appendChild(quantidade);

    const btnAdiciona = document.createElement("button")
    btnAdiciona.classList.add("adicionar");
    btnAdiciona.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
  </svg>`;
    divQuant.appendChild(btnAdiciona);

    const preco = produtoContainer.querySelector(".price").cloneNode(true);
    divPedido.appendChild(preco);

    divQuant.querySelector(".adicionar").addEventListener("click", addProduct);
    divQuant.querySelector(".remover").addEventListener("click", removeProduct);

    updateTotal();
    checkPedidos();
}

// desativa o botão de pedir após colocar no carrinho
function desableBtn(event) {
    const botaoClicado = event.target;
    botaoClicado.style.backgroundColor = "#ccc";
    botaoClicado.innerText = "No carrinho";
    botaoClicado.disabled = true;
}

// adiciona quantidade no carrinho
function addProduct(event) {
    const nameElement = event.target.closest(".resumo-pedido").querySelector(".name").innerText.toLowerCase();
    const precoElement = event.target.closest(".resumo-pedido").querySelector(".price");
    const preco = parseFloat(precoElement.innerText.replace("R$ ", "").replace(",", "."));
    const quantidadeElement = event.target.closest(".resumo-pedido").querySelector(".quantidade");
    let quantidade = parseInt(quantidadeElement.innerText);
    quantidade++;
    quantidadeElement.innerText = quantidade;

    alterPriceUp(event, nameElement);
    updateTotal();
};

// remove quantidade e produto do carrinho
function removeProduct(event) {
    const nameElement = event.target.closest(".resumo-pedido").querySelector(".name").innerText.toLowerCase();
    let total = parseInt(event.target.closest(".resumo-pedido").querySelector(".quantidade").innerText);
    total--;
    event.target.closest(".resumo-pedido").querySelector(".quantidade").innerText = total;
    if (total <= 0) {
        const pedidoContainer = event.target.closest(".resumo-pedido");
        pedidoContainer.remove();
        const botoesPedir = document.querySelectorAll(".pedir");
        for (const botaoPedir of botoesPedir) {
            const produtoContainer = botaoPedir.closest(".product-container");
            const nomeProdutoRemovido = pedidoContainer.querySelector(".name").innerText;
            if (produtoContainer.querySelector(".name").innerText === nomeProdutoRemovido) {
                botaoPedir.style.backgroundColor = "orange";
                botaoPedir.innerText = "Pedir";
                botaoPedir.disabled = false;
                break;
            }
        }
        pedidos--;
        restaurante.botoes.carrinho.setAttribute("data-content", pedidos);

    }

    alterPriceDown(event, nameElement);
    updateTotal();
    checkPedidos();
};

// aumenta o preço do produto no carrinho
function alterPriceUp(event, nameElement) {
    const valorFixo = restaurante.valores[nameElement];
    const precoElement = event.target.closest(".resumo-pedido").querySelector(".price");
    const quantidadeElement = event.target.closest(".resumo-pedido").querySelector(".quantidade");
    let quantidade = parseInt(quantidadeElement.innerText);
    let total = (quantidade * valorFixo).toFixed(2);
    precoElement.innerText = `R$ ${total.replace(".", ",")}`;

};

// diminui o preço do produto no carrinho
function alterPriceDown(event, nameElement) {
    const valorFixo = restaurante.valores[nameElement];
    const precoElement = event.target.closest(".resumo-pedido").querySelector(".price");

    const preco = parseInt(precoElement.innerText.replace("R$ ", "").replace(",", "."));
    let quantidade = parseInt(event.target.closest(".resumo-pedido").querySelector(".quantidade").innerText);
    let total = (valorFixo * quantidade).toFixed(2).replace(".", ",");
    precoElement.innerText = `R$ ${total}`;
};

// atualiza o valor total do pedido
function updateTotal() {
    let total = 0;
    document.querySelectorAll('.resumo-pedido').forEach((pedido) => {
        const precoString = pedido.querySelector('.price').innerText.replace('R$ ', '').replace(',', '.');
        const preco = parseFloat(precoString);
        total += preco;
    });

    const totalFormatado = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    restaurante.pedido.total.innerText = `R$ ${totalFormatado}`;
}

function addEventListenersToDynamicElements() {
    restaurante.botoes.adicionar.forEach(botao => {
        botao.addEventListener("click", addProduct);
    });

    restaurante.botoes.remover.forEach(botao => {
        botao.addEventListener("click", removeProduct);
    });
}

// preenche os dados do formulario com a api
function preencherFormulario(data) {
    document.getElementById('logradouro').value = data.logradouro;
    document.getElementById('bairro').value = data.bairro;
    document.getElementById('cidade').value = data.localidade;
    document.getElementById('estado').value = data.uf;
}

// envia o pedido para o whatsapp
function enviarPedido() {
    const pedidos = document.querySelectorAll('.resumo-pedido');
    let totalPedido = 0;
    let mensagem = 'Olá! Gostaria de fazer o seguinte pedido:\n';

    pedidos.forEach((item, index) => {
        const nome = item.querySelector('.name').innerText;
        const quantidade = item.querySelector('.quantidade').innerText;
        const preco = parseFloat(item.querySelector('.price').innerText.replace('R$ ', '').replace(',', '.'));
        totalPedido += preco;
        mensagem += `\n${index + 1}. ${quantidade}x ${nome} - R$ ${preco.toFixed(2)}`;
    });

    const endereco = `Endereço:\nRua: ${restaurante.endereco.logradouro.value}\nNúmero: ${restaurante.endereco.numero.value}\nBairro: ${restaurante.endereco.bairro.value}\nCidade: ${restaurante.endereco.cidade.value}\nCEP: ${restaurante.endereco.cep.value}`;

    mensagem += `\n\n${endereco}`;

    mensagem += `\n\nTotal do Pedido: R$ ${totalPedido.toFixed(2)}`;

    const mensagemCodificada = encodeURIComponent(mensagem);

    const url = `https://api.whatsapp.com/send/?phone=5511973008423&text=${mensagemCodificada}`;

    window.open(url, '_blank');
}

// procura os produtos pelo nome
const getSearchedProducts = (search) => {
    const produtos = restaurante.produto.container;

    produtos.forEach((produto) => {

        const nomeElement = produto.querySelector('.name');

        if (!nomeElement) return;

        const nome = nomeElement.innerText.toLowerCase();

        produto.style.display = "block";

        if (!nome.includes(search.toLowerCase())) {
            produto.style.display = "none";
        }
    });
};

// filtra os produtos
const filterProducts = (filterValue) => {

    const produtos = restaurante.produto.container;

    switch (filterValue) {

        case "tudo":
            produtos.forEach((produto) => produto.style.display = "block");
            break;

        case "salgado":
            produtos.forEach((produto) => produto.classList.contains("salgado") ? (produto.style.display = "block") : (produto.style.display = "none"));
            break;

        case "doce":
            produtos.forEach((produto) => produto.classList.contains("doce") ? (produto.style.display = "block") : (produto.style.display = "none"));;
            break;

        case "bebida":
            produtos.forEach((produto) => produto.classList.contains("bebida") ? (produto.style.display = "block") : (produto.style.display = "none"));;
            break;

        default:
            break;
    }

}

// checa se existem pedidos no botão do carrinho
const checkPedidos = () => {

    if (pedidos === 0) {
        restaurante.botoes.carrinho.style.display = "none"
    } else {
        restaurante.botoes.carrinho.style.display = "block"
    }
}





// Eventos

restaurante.botoes.carrinho.addEventListener("click", (e) => {
    toggleCart();
});

restaurante.botoes.voltar.addEventListener("click", (e) => {
    toggleCart();
});

restaurante.botoes.pedir.forEach(btn => {
    btn.addEventListener("click", () => {
        pedidos++;
        desableBtn(event);
        if (!restaurante.botoes.carrinho.classList.contains("ativo")) {
            toggleVisibility();
        }
        restaurante.botoes.carrinho.setAttribute("data-content", pedidos);
        addPedidoCarrinho(event);
    });
});

restaurante.endereco.cep.addEventListener("input", () => {
    const cep = restaurante.endereco.cep.value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => preencherFormulario(data))
        .catch(error => console.error('Erro ao buscar CEP:', error));
});

restaurante.botoes.enviar.addEventListener("click", (e) => {
    e.preventDefault();

    if (
        restaurante.endereco.logradouro.value &&
        restaurante.endereco.numero.value &&
        restaurante.endereco.bairro.value &&
        restaurante.endereco.cidade.value &&
        restaurante.endereco.estado.value &&
        restaurante.endereco.cep.value
    ) {

        enviarPedido();
    }

});

restaurante.botoes.search.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchedProducts(search);
});

document.querySelector(".filter").addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterProducts(filterValue);
});





checkPedidos();

addEventListenersToDynamicElements();


