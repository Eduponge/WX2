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

const FIELDS_COMMON = [
    { label: "Hora", key: "time", unit: "" },
    { label: "Tempo", key: "weather_code", unit: "" },
    { label: "Nuvens (%)", key: "cloud_cover", unit: "%" },
    { label: "Nuvens Baixas (%)", key: "cloud_cover_low", unit: "%" },
    { label: "Temp. Aparente (°C)", key: "apparent_temperature", unit: "°C" },
    { label: "Prob. Precipitação (%)", key: "precipitation_probability", unit: "%" },
    { label: "Precipitação (mm)", key: "precipitation", unit: "mm" },
    { label: "Pancadas (mm)", key: "showers", unit: "mm" },
    { label: "Vento 80m (km/h)", key: "wind_speed_80m", unit: "km/h" }
    // Última coluna será tratada de forma customizada por location
];

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const PARAMS =
    "hourly=visibility,apparent_temperature,precipitation_probability,precipitation,showers,weather_code,cloud_cover,cloud_cover_low,wind_speed_80m,wind_direction_80m" +
    "&models=gfs_seamless&timezone=America%2FSao_Paulo&forecast_hours=24&past_hours=24";

// (Lista completa conforme resposta anterior)
const WEATHER_CODE_PT = {
    "0": "Tempo bom",
    "1": "Nuvens dissipando",
    "2": "Tempo bom",
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
    "19": "CB (Cumulonimbus)",
    "20": "Chuvisco (não congelante) ou grãos de neve",
    "21": "Chuva (não congelante)",
    "22": "Neve",
    "23": "Chuva e neve ou granizo",
    "24": "Chuvisco congelante ou chuva congelante",
    "25": "Pancadas de chuva",
    "26": "Pancadas de neve, ou de chuva e neve",
    "27": "Pancadas de granizo*, ou de chuva e granizo*",
    "28": "Nevoeiro ou nevoeiro de gelo",
    "29": "Trovoada (com ou sem precipitação)",
    "30": "Tempestade de poeira ou areia, leve ou moderada",
    "31": "Tempestade de poeira ou areia, leve ou moderada",
    "32": "Tempestade de poeira ou areia, leve ou moderada",
    "33": "Tempestade de poeira ou areia severa",
    "34": "Tempestade de poeira ou areia severa",
    "35": "Tempestade de poeira ou areia severa",
    "36": "Neve soprada leve ou moderada",
    "37": "Neve soprada forte",
    "38": "Neve soprada leve ou moderada",
    "39": "Neve soprada forte",
    "40": "Nevoeiro ou nevoeiro de gelo à distância no momento da observação, mas não na estação durante a hora precedente, o nevoeiro ou nevoeiro de gelo estendendo-se até um nível acima do solo",
    "41": "Nevoeiro",
    "42": "Nevoeiro",
    "43": "Nevoeiro",
    "44": "Nevoeiro",
    "45": "Nevoeiro",
    "46": "Nevoeiro",
    "47": "Nevoeiro",
    "48": "Nevoeiro",
    "49": "Nevoeiro",
    "50": "Chuvisco intermitente",
    "51": "Chuvisco contínuo",
    "52": "Chuvisco intermitente",
    "53": "Chuvisco contínuo",
    "54": "Chuvisco intermitente",
    "55": "Chuvisco contínuo",
    "56": "Chuvisco, congelante, fraco",
    "57": "Chuvisco, congelante, moderado ou forte (denso)",
    "58": "Chuvisco e chuva, fraco",
    "59": "Chuvisco e chuva, moderado ou forte",
    "60": "Chuva intermitente",
    "61": "Chuva contínua",
    "62": "Chuva intermitente",
    "63": "Chuva contínua",
    "64": "Chuva intermitente",
    "65": "Chuva contínua",
    "66": "Chuva, congelante, fraca",
    "67": "Chuva, congelante, moderada ou forte (densa)",
    "68": "Chuva ou chuvisco e neve, fraca",
    "69": "Chuva ou chuvisco e neve, moderada ou forte",
    "70": "Queda intermitente de flocos de neve",
    "71": "Queda contínua de flocos de neve",
    "72": "Queda intermitente de flocos de neve",
    "73": "Queda contínua de flocos de neve",
    "74": "Queda intermitente de flocos de neve",
    "75": "Queda contínua de flocos de neve",
    "76": "Pó de diamante (com ou sem nevoeiro)",
    "77": "Grãos de neve (com ou sem nevoeiro)",
    "78": "Cristais de neve isolados em forma de estrela (com ou sem nevoeiro)",
    "79": "Granizo",
    "80": "Pancadas de chuva, fraca",
    "81": "Pancadas de chuva, moderada ou forte",
    "82": "Pancadas de chuva, violenta",
    "83": "Pancadas de chuva e neve misturados, fraca",
    "84": "Pancadas de chuva e neve misturados, moderada ou forte",
    "85": "Pancadas de neve, fraca",
    "86": "Pancadas de neve, moderada ou forte",
    "87": "Pancadas de grãos de neve ou granizo pequeno, com ou sem chuva ou chuva e neve misturados",
    "88": "Pancadas de grãos de neve ou granizo pequeno, com ou sem chuva ou chuva e neve misturados",
    "89": "Pancadas de granizo*, com ou sem chuva ou chuva e neve misturados, não associado a trovoada",
    "90": "Pancadas de granizo*, com ou sem chuva ou chuva e neve misturados, não associado a trovoada",
    "91": "Chuva fraca no momento da observação",
    "92": "Chuva moderada ou forte no momento da observação",
    "93": "Neve fraca, ou chuva e neve misturados ou granizo** no momento da observação",
    "94": "Neve moderada ou forte, ou chuva e neve misturados ou granizo** no momento da observação",
    "95": "Trovoada, fraca ou moderada, sem granizo**, mas com chuva e/ou neve no momento da observação",
    "96": "Trovoada, fraca ou moderada, com granizo** no momento da observação",
    "97": "Trovoada, forte, sem granizo**, mas com chuva e/ou neve no momento da observação",
    "98": "Trovoada combinada com tempestade de poeira ou areia no momento da observação",
    "99": "Trovoada, forte, com granizo** no momento da observação"
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

    // Monta as colunas de acordo com location
    let fields;
    if (locationName === "GRU") {
        fields = [
            ...FIELDS_COMMON,
            { label: "Pista Prevista para Pouso", key: "runway_prediction", unit: "" }
        ];
    } else {
        fields = [
            ...FIELDS_COMMON,
            { label: "Dir. Vento 80m (°)", key: "wind_direction_80m", unit: "°" }
        ];
    }

    // Cabeçalho
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr>${fields.map(f => `<th>${f.label}</th>`).join("")}</tr>`;
    table.appendChild(thead);

    // Linhas
    const tbody = document.createElement("tbody");
    const times = data.hourly.time;
    const now = getNowLocalString();

    // ENCONTRAR O PRIMEIRO ÍNDICE >= agora
    let firstIdx = times.findIndex(t => t.replace("T", " ") >= now);
    if (firstIdx === -1) firstIdx = times.length; // Se não achar, não mostra linhas

    // Começar a mostrar a partir da quinta linha futura (ou seja, da posição firstIdx + 5 em diante)
    for (let i = firstIdx + 5; i < times.length; i++) {
        const currTime = times[i].replace("T", " ");
        const row = document.createElement("tr");
        row.innerHTML = fields.map((f) => {
            let value, style = "";

            if (f.key === "time") {
                value = currTime;
            } else if (f.key === "weather_code") {
                let code = data.hourly["weather_code"][i];
                value = WEATHER_CODE_PT.hasOwnProperty(code)
                    ? WEATHER_CODE_PT[code]
                    : code;

                // Fundo de acordo com código:
                // 0, 1, 2: normal; 3: amarelo; outros: vermelho
                if (code === 3 || code === "3") {
                    style = 'background: #fff6bf;';
                } else if (!(code === 0 || code === 1 || code === 2 || code === "0" || code === "1" || code === "2")) {
                    style = 'background: #ffc1c1;';
                }
            } else if (f.key === "runway_prediction") {
                // Só para GRU
                let windDir = data.hourly["wind_direction_80m"][i];
                let windSpd = data.hourly["wind_speed_80m"][i];

                // Garantia de tipo numérico
                windDir = Number(windDir);
                windSpd = Number(windSpd);

                // Regra:
                // "10R" quando Dir. Vento 80m (°) entre 010 e 190 (inclusive) OU Vento 80m (km/h) < 7
                // Senão "28L"
                if ((windDir >= 10 && windDir <= 190) || windSpd < 7) {
                    value = "10R";
                } else {
                    value = "28L";
                }
            } else if (Array.isArray(data.hourly[f.key])) {
                value = data.hourly[f.key][i];
            } else {
                value = "-";
            }

                // Outras regras de cor de fundo (menos para weather_code/runway_prediction)
                if (f.key !== "weather_code" && f.key !== "runway_prediction") {
                    if (f.key === "showers" && isNumeric(value)) {
                        if (value > 0) style = 'background: #ffeaea;';
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

// Obter hora local (America/Sao_Paulo) no formato 'YYYY-MM-DD HH:MM'
function getNowLocalString() {
    const now = new Date();
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
