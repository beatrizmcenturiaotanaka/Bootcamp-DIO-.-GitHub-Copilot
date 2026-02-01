// js/config.js
// Objeto global CONFIG: configurações de emissão, modos de transporte, crédito de carbono e utilitários de UI

var CONFIG = {
    // Fatores de emissão (kg CO2 por km)
    EMISSION_FACTORS: {
        bicicleta: 0,
        carro: 0.12,
        ônibus: 0.089,
        caminhão: 0.96
    },

    // Metadados dos modos de transporte
    TRANSPORT_MODES: {
        bicicleta: { label: "Bicicleta", color: "#4CAF50" },
        carro: { label: "Carro", color: "#2196F3" },
        ônibus: { label: "Ônibus", color: "#FF9800" },
        caminhão: { label: "Caminhão", color: "#795548" }
    },

    // Configuração de crédito de carbono
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    /**
     * Preenche o datalist de cidades usando RoutesDB.getAllCities()
     */
    populateDatalist: function () {
        if (!window.RoutesDB || typeof RoutesDB.getAllCities !== 'function') return;
        var cities = RoutesDB.getAllCities();
        var datalist = document.getElementById('cities-list');
        if (!datalist) return;
        datalist.innerHTML = '';
        cities.forEach(function (city) {
            var option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
    },

    /**
     * Configura preenchimento automático do campo de distância entre cidades
     */
    setupDistanceAutofill: function () {
        var originInput = document.getElementById('origin');
        var destInput = document.getElementById('destination');
        var distanceInput = document.getElementById('distance');
        var manualCheckbox = document.getElementById('manual-distance');
        var helperText = document.getElementById('distance-helper');

        function updateDistance() {
            var origin = originInput ? originInput.value.trim() : '';
            var dest = destInput ? destInput.value.trim() : '';
            if (origin && dest && window.RoutesDB && typeof RoutesDB.findDistance === 'function') {
                var dist = RoutesDB.findDistance(origin, dest);
                if (dist !== null) {
                    if (distanceInput) {
                        distanceInput.value = dist;
                        distanceInput.readOnly = true;
                    }
                    if (helperText) {
                        helperText.textContent = 'Distância encontrada automaticamente.';
                        helperText.style.color = 'green';
                    }
                } else {
                    if (distanceInput) {
                        distanceInput.value = '';
                        distanceInput.readOnly = false;
                    }
                    if (helperText) {
                        helperText.textContent = 'Distância não encontrada. Informe manualmente.';
                        helperText.style.color = 'orange';
                    }
                }
            } else {
                if (distanceInput) {
                    distanceInput.value = '';
                    distanceInput.readOnly = false;
                }
                if (helperText) {
                    helperText.textContent = 'Preencha origem e destino.';
                    helperText.style.color = 'gray';
                }
            }
        }

        if (originInput) originInput.addEventListener('change', updateDistance);
        if (destInput) destInput.addEventListener('change', updateDistance);

        if (manualCheckbox) {
            manualCheckbox.addEventListener('change', function () {
                if (manualCheckbox.checked) {
                    if (distanceInput) distanceInput.readOnly = false;
                    if (helperText) {
                        helperText.textContent = 'Informe a distância manualmente.';
                        helperText.style.color = 'blue';
                    }
                } else {
                    updateDistance();
                }
            });
        }
    }
};
