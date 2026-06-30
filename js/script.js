const btnTopo = document.getElementById("btnClima");
const busca = document.getElementById("busca");
const btnBuscar = document.getElementById("btnBuscar");
const inputCidade = document.getElementById("cidadeInput");
const resultado = document.getElementById("resultado");

btnTopo.addEventListener("click", () => {
    busca.scrollIntoView({ behavior: "smooth" });
});
btnBuscar.addEventListener("click", async () => {
    const cidade = inputCidade.value;

    if (!cidade) {
        resultado.innerHTML = "Digite uma cidade!";
        return;
    }

    // 1. Buscar coordenadas da cidade
    const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1`
    );

    const geoData = await geoRes.json();

    if (!geoData.results) {
        resultado.innerHTML = "Cidade não encontrada!";
        return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    // 2. Buscar clima
    const climaRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const climaData = await climaRes.json();

    const clima = climaData.current_weather;

    // 3. Mostrar resultado
    resultado.innerHTML = `
        <h3>📍 ${name}</h3>
        <p>🌡 Temperatura: ${clima.temperature}°C</p>
        <p>💨 Vento: ${clima.windspeed} km/h</p>
        <p>⏰ Hora da medição: ${clima.time}</p>
    `;
});