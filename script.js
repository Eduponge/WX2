const LOCATIONS = [
    {
        name: "GRU",
        latitude: -23.43555556,
        longitude: -46.47305556
    },
    {
        name: "CGH",
        latitude: -23.62611111,
        longitude: -46.65638889
    },
    {
        name: "VCP",
        latitude: -23.00694444,
        longitude: -47.13444444
    }
];

const FIELDS = [
    { label: "Hora", key: "time", unit: "" },
    { label: "Visibilidade (m)", key: "visibility", unit: "m" },
    { label: "Temp. Aparente (°C)", key: "apparent_temperature", unit: "°C" },
    { label: "Prob. Precipitação (%)", key: "precipitation_probability", unit: "%" },
    { label: "Precipitação (mm)", key: "precipitation", unit: "mm" },
    { label: "Pancadas (mm)", key: "showers", unit: "mm" },
    { label: "Tempo", key: "weather_code", unit: "" }, // Alterado para "Tempo"
    { label: "Nuvens (%)", key: "cloud_cover", unit: "%" },
    { label: "Nuvens Baixas (%)", key: "cloud_cover_low", unit: "%" },
    { label: "Vento 80m (km/h)", key: "wind_speed_80m", unit: "km/h" },
    { label: "Dir. Vento 80m (°)", key: "wind_direction_80m", unit: "°" },
];

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const PARAMS =
    "hourly=visibility,apparent_temperature,precipitation_probability,precipitation,showers,weather_code,cloud_cover,cloud_cover_low,wind_speed_80m,wind_direction_80m" +
    "&models=gfs_seamless&timezone=America%2FSao_Paulo&forecast_hours=24&past_hours=24";

const WEATHER_CODE_PT = {
    "0": "Tempo bom",
    "1": "Nuvens dissipando",
    "2": "Tempo inalterado",
    "3": "Nuvens se formando",
    "4": "Visibilidade reduzida por fumaça (incêndios, fumaça industrial ou cinzas vulcânicas)",
    "5": "Neblina seca (haze)",
    "6": "Poeira suspensa em grande escala, não levantada pelo vento na estação",
    "7": "Poeira ou areia levantada pelo vento na estação, mas sem turbilhão ou tempestade desenvolvida",
    "8": "Turbilhão de poeira/areia bem desenvolvido observado, mas sem tempestade de poeira/areia",
    "9": "Tempestade de poeira ou areia à vista ou ocorrida na última hora",
    "10": "Névoa",
    "11": "Nevoeiro em Pedaços/fragmentos",
    "12": "Nevoeiro contínuo",
    "13": "Relâmpago visível, sem trovão ouvido",
    "14": "Precipitação à vista, não atingindo o solo/mar",
    "15": "Precipitação à vista, atingindo solo/mar, mas distante (>5km)",
    "16": "Precipitação à vista, atingindo solo/mar, próxima mas não na estação",
    "17": "Trovoada sem precipitação no momento",
    "18": "Rajadas (squalls)",
    "19": "CB (Cumulonimbus)"
};

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("tables-container");
    container.innerHTML = "<div style='text-align:center;'>Carregando...</div>";
    try {
        const tables = await Promise.all(
            LOCATIONS.map(loc => fetchLocationDataAndTable(loc))
        );
        container.innerHTML = "";
        tables.forEach(tableSection => container.appendChild(tableSection));
    } catch (err) {
        container.innerHTML = `<div style="color:red;text-align:center;">Erro ao carregar dados: ${err.message}</div>`;
    }
});

async function fetchLocationDataAndTable(location) {
    const url = `${BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&${PARAMS}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar dados para ${location.name}`);
    const data = await response.json();
    return makeTableSection(data, location.name);
}

function makeTableSection(data, locationName) {
    const section = document.createElement("div");
    section.className = "table-section";
    section.innerHTML = `<h2>${locationName}</h2>`;

    const table = document.createElement("table");
    // Cabeçalho
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr>${FIELDS.map(f => `<th>${f.label}</th>`).join("")}</tr>`;
    table.appendChild(thead);

    // Linhas
    const tbody = document.createElement("tbody");
    const times = data.hourly.time;
    const now = getNowLocalString();

    for (let i = 0; i < times.length; i++) {
        const currTime = times[i].replace("T", " ");
        // Só mostra linhas onde Hora >= hora atual
        if (currTime < now) continue;

        const row = document.createElement("tr");
        row.innerHTML = FIELDS.map((f, idx) => {
            let value, style = "";

            if (f.key === "time") {
                value = currTime;
            } else if (f.key === "weather_code") {
                // Convert to texto em português
                let code = data.hourly["weather_code"][i];
                value = WEATHER_CODE_PT.hasOwnProperty(code)
                    ? WEATHER_CODE_PT[code]
                    : code;
            } else if (Array.isArray(data.hourly[f.key])) {
                value = data.hourly[f.key][i];
            } else {
                value = "-";
            }

            // Regras de cor de fundo
            if (f.key === "visibility" && isNumeric(value)) {
                if (value > 399 && value < 801) style = 'background: #fff6bf;';
                else if (value < 400) style = 'background: #ffeaea;';
            } else if (f.key === "precipitation" && isNumeric(value)) {
                if (value > 1 && value < 10) style = 'background: #fff6bf;';
                else if (value > 9) style = 'background: #ffeaea;';
            } else if (f.key === "cloud_cover_low" && isNumeric(value)) {
                if (value > 49 && value < 80) style = 'background: #fff6bf;';
                else if (value > 79) style = 'background: #ffeaea;';
            } else if (f.key === "wind_speed_80m" && isNumeric(value)) {
                if (value > 19 && value < 30) style = 'background: #fff6bf;';
                else if (value > 29) style = 'background: #ffeaea;';
            }

            // Unidades
            let unidade = (value !== "-" && f.unit) ? ` ${f.unit}` : "";

            return `<td${style ? ` style="${style}"` : ""}>${value !== undefined && value !== null ? value + unidade : "-"}</td>`;
        }).join("");
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    section.appendChild(table);
    return section;
}

// Obter hora local (America/Sao_Paulo) no mesmo formato das datas da API: 'YYYY-MM-DD HH:MM'
function getNowLocalString() {
    const now = new Date();
    // Ajusta para o fuso de São Paulo (-3 UTC, sem considerar DST)
    let spNow = new Date(now.getTime() - (now.getTimezoneOffset() + 180) * 60000);
    const yyyy = spNow.getFullYear();
    const mm = String(spNow.getMonth() + 1).padStart(2, '0');
    const dd = String(spNow.getDate()).padStart(2, '0');
    const hh = String(spNow.getHours()).padStart(2, '0');
    const min = String(spNow.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
