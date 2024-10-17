let precoTotal = 0;
let produtosCache = []; 
let itensNoCarrinho =[]

async function exibirProdutos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {

            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const produtos = await response.json();
        produtosCache = produtos; 
        const resultadoDiv = document.getElementById("resultado-produtos");
        resultadoDiv.innerHTML = ''; 
        
        produtos.forEach(produto => {
            const produtoDiv = document.createElement("div");
            produtoDiv.classList.add("produto");
            produtoDiv.innerHTML = `
                <h3>${produto.title}</h3>
                <p>${produto.description}</p>
                <img src="${produto.image}" alt="Erro ao carregar a imagem" width="275px" height="260px">
                <h4>${produto.category}</h4>
                <p>$ ${produto.price}</p>
                <button onclick="adicionarAoCarrinho(${produto.id})" 
                style="padding: 10px;background: #28a745;color: #fff;border: none;border-radius: 5px;cursor: pointer;"
                id="btnAdicionarAoCarrinho">
                Adicionar ao carrinho
                </button>`;
            resultadoDiv.appendChild(produtoDiv);
        })
        
    } catch (error) {
        console.error(error);
        document.getElementById("resultado-produtos").innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

window.onload = exibirProdutos;

function adicionarAoCarrinho(produtoId) {
    if (!itensNoCarrinho.includes(produtoId)) { 
        console.log(`Produto ${produtoId} adicionado ao carrinho`);
        
        const mensagemVazio = document.getElementById('mensagem-vazio').innerHTML = ''; 
        const produtoSelecionado = produtosCache.find(produto => produto.id === produtoId); // Busca o produto pelo ID
        const elementoDoCarrinho = document.getElementById('lista-carrinho');
    
        const produtosLi = document.createElement("li");
        produtosLi.id = `${produtoId}`
        console.log(produtosLi.id)
        
        produtosLi.innerHTML = `
            <img src="${produtoSelecionado.image}" width="50" height="50">
            <button id="removerDoCarrinho-${produtoId}" onclick="removerDoCarrinho(${produtoId})" 
            style="padding: 10px;background: #28a745;color: #fff;border: none;border-radius: 5px;cursor: pointer;float: right;">
            Remover
            </button>
            <p> $ ${produtoSelecionado.price}</p>`;
        
        elementoDoCarrinho.appendChild(produtosLi);
        itensNoCarrinho.push(produtoSelecionado.id)
        console.log(itensNoCarrinho)

        const carrinhoSection = document.getElementById('carrinho');
        carrinhoSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(550)
        document.getElementById("btnAdicionarAoCarrinho").addEventListener('click', totalFinal(produtoId, 'adicionar'), {once: true});
        
    }else {
        mostrarAlerta('O produto já foi adicionado ao carrinho');
    }
}

function removerDoCarrinho(produtoId) {    
    if (itensNoCarrinho.includes(produtoId)){
        const produtoLi = document.getElementById(produtoId); // Busca o elemento pelo ID correspondente ao produto
        console.log(produtoId)
        console.log(produtoLi)

        if (produtoLi) {
            produtoLi.remove(); // Remove o elemento inteiro do carrinho
            itensNoCarrinho = itensNoCarrinho.filter(id => id !== produtoId);
            console.log(`Produto ${produtoId} removido do carrinho.`);
            document.getElementById("btnAdicionarAoCarrinho").addEventListener('click', totalFinal(produtoId, 'remover'), {once: true});
            if (itensNoCarrinho.length === 0) {
                const totalElement = document.getElementById("totalFinal");
                const finalizarButton = document.getElementById('btnFinalizar');

                totalElement.innerHTML = '<p>Seu carrinho de compras está vazio.</p>';
                finalizarButton.innerHTML = ''; // Remove o botão de finalizar
            }    
        }else {
            console.log('Produto não encontrado no carrinho.');
    }}else{
        console.log('Esse produto não está no carrinho')
    }
}


function limparCarrinho(){
    itensNoCarrinho.forEach(removerDoCarrinho)
    document.getElementById('btnLimparCarrinho').innerHTML = ''
    
}

function totalFinal(produtoId, acao) {
    const produtoSelecionado = produtosCache.find(produto => produto.id === produtoId); // Busca o produto pelo ID. === compara valores e o tipo da variável
    const totalElement = document.getElementById("totalFinal");
    
    if (acao === 'adicionar') {
        precoTotal += produtoSelecionado.price;
    } else if (acao === 'remover') {
        precoTotal -= produtoSelecionado.price;
    }

    console.log(precoTotal.toFixed(2));
    totalElement.innerHTML = `<p>Total: $ ${precoTotal.toFixed(2)}</p>`;

    const finalizarButton = document.getElementById('btnFinalizar');
    finalizarButton.innerHTML = ''; 
    finalizarButton.innerHTML = `<button onclick="mostrarPedidoRealizado('Pedido realizado com sucesso!')"
        style="padding: 10px;background: #28a745;color: #fff;border: none;border-radius: 5px;cursor: pointer;">
            Finalizar Compra
        </button>`;
    const limparCarrinhoButton = document.getElementById('btnLimparCarrinho');
    limparCarrinhoButton.innerHTML = ''; 
    limparCarrinhoButton.innerHTML = `<button onclick="limparCarrinho(${produtoId})"
        style="padding: 10px;background: #28a745;color: #fff;border: none;border-radius: 5px;cursor: pointer;">
            Limpar carrinho
        </button>`;
}

function mostrarAlerta(mensagem) {
    const alerta = document.getElementById('mensagem-alerta');
    alerta.innerHTML = mensagem;
    alerta.style.display = 'block'; 
    
    setTimeout(() => {
        alerta.style.display = 'none';
    }
    , 3000);
}

function mostrarPedidoRealizado(mensagem) {
    limparCarrinho();
    const alerta = document.getElementById('pedidoRealizado');
    alerta.innerHTML = mensagem;
    alerta.style.display = 'block';
    
    setTimeout(() => {
        alerta.style.display = 'none';
    }
    , 3000);
}




