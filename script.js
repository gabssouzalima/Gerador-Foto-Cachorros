const imagens = document.querySelectorAll('.img-cachorro');
const buttonCarregar = document.getElementById('button-carregar');

let carregando = false;

const setCarregando = (valor) => {
    carregando = valor;
    buttonCarregar.disabled = valor;
    buttonCarregar.textContent = valor ? "Carregando..." : "Carregar";
};

const carregarImagem = (img, src) => {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = src;
    });
};

const pegarDados = async () => {
    if (carregando) return;

    setCarregando(true);

    imagens.forEach(img => img.style.opacity = 0);

    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random/6');
        if (!response.ok) throw new Error('Erro na requisição');

        const dados = await response.json();
        if (dados.status !== "success") throw new Error('Erro na API');

        const promessas = dados.message.map((url, index) =>
            carregarImagem(imagens[index], url)
        );

        await Promise.all(promessas);

        imagens.forEach(img => img.style.opacity = 1);

    } catch (err) {
        console.log('Erro! ' + err.message);
    } finally {
        setCarregando(false);
    }
};

buttonCarregar.addEventListener("click", pegarDados);