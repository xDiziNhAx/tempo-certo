
const btnTopo = document.getElementById("btnClima");
const busca = document.getElementById("busca");
const btnBuscar = document.getElementById("btnBuscar");
const inputCidade = document.getElementById("cidadeInput");
const resultado = document.getElementById("resultado");


const formContato = document.getElementById("formContato");
const formCadastro = document.getElementById("formCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

// Botão do topo 
btnTopo.addEventListener("click", () => {
    busca.scrollIntoView({
        behavior: "smooth"
    });
});

// Buscar o clima api
btnBuscar.addEventListener("click", async () => {
    const cidade = inputCidade.value.trim();

    if (!cidade) {
        resultado.innerHTML = "<p>Digite o nome de uma cidade.</p>";
        return;
    }

    resultado.innerHTML = "<p>⏳ Carregando previsão do tempo...</p>";

    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) {
            resultado.innerHTML = "<p>❌ Cidade não encontrada.</p>";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        const climaRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&timezone=auto`
        );
        const climaData = await climaRes.json();
        const clima = climaData.current;

        const [dataApi, horaApi] = clima.time.split("T");
        const [ano, mes, dia] = dataApi.split("-");
        const data = `${dia}/${mes}/${ano}`;
        const hora = horaApi;

        let icone = "☁️";
        if (clima.temperature_2m >= 30) {
            icone = "🔥";
        } else if (clima.temperature_2m >= 20) {
            icone = "☀️";
        } else if (clima.temperature_2m >= 10) {
            icone = "🌤️";
        } else {
            icone = "❄️";
        }

        resultado.innerHTML = `
            <div class="card-clima">
                <h3>${icone} ${name}</h3>
                <p>🌡 <strong>Temperatura:</strong> ${clima.temperature_2m}°C</p>
                <p>💨 <strong>Vento:</strong> ${clima.wind_speed_10m} km/h</p>
                <p>📅 <strong>Data:</strong> ${data}</p>
                <p>🕒 <strong>Última atualização:</strong> ${hora}</p>
            </div>
        `;
    } catch (erro) {
        resultado.innerHTML = "<p>❌ Ocorreu um erro ao buscar os dados.</p>";
        console.error(erro);
    }
});

// Formulário 
formContato.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! Obrigado pelo contato.");
});

// Formulário de cadastro
formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    mensagemCadastro.innerHTML = `
        <p style="color:green; font-weight:bold;">
            🎉 Cadastro realizado com sucesso! Obrigado por se inscrever no Tempo Certo.
        </p>
    `;
});
