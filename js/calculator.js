// js/calculator.js
// Objeto global Calculator: funções para cálculos de emissão, economia e créditos de carbono

var Calculator = {
    /**
     * Calcula emissão de CO2 (kg) para uma distância e modo de transporte.
     * @param {number} distanceKm - Distância em km
     * @param {string} transportMode - Chave do modo em CONFIG.EMISSION_FACTORS
     * @returns {number} Emissão em kg CO2 (2 casas decimais)
     */
    calculateEmission: function (distanceKm, transportMode) {
        var factor = CONFIG.EMISSION_FACTORS[transportMode] || 0;
        var emission = distanceKm * factor;
        return Math.round(emission * 100) / 100;
    },

    /**
     * Calcula emissão para todos os modos, compara com carro e ordena por menor emissão.
     * @param {number} distanceKm
     * @returns {Array} [{ mode, emission, percentageVsCar }]
     */
    calculateAllModes: function (distanceKm) {
        var results = [];
        var carEmission = this.calculateEmission(distanceKm, 'carro');
        for (var mode in CONFIG.EMISSION_FACTORS) {
            var emission = this.calculateEmission(distanceKm, mode);
            var percentage = carEmission > 0 ? (emission / carEmission) * 100 : 0;
            results.push({
                mode: mode,
                emission: emission,
                percentageVsCar: Math.round(percentage * 100) / 100
            });
        }
        // Ordena por menor emissão
        results.sort(function (a, b) { return a.emission - b.emission; });
        return results;
    },

    /**
     * Calcula economia de emissão em relação ao baseline (ex: carro).
     * @param {number} emission - Emissão do modo escolhido
     * @param {number} baselineEmission - Emissão de referência
     * @returns {{ saved: number, percentage: number }}
     */
    calculateSavings: function (emission, baselineEmission) {
        var saved = baselineEmission - emission;
        var percent = baselineEmission > 0 ? (saved / baselineEmission) * 100 : 0;
        return {
            saved: Math.round(saved * 100) / 100,
            percentage: Math.round(percent * 100) / 100
        };
    },

    /**
     * Calcula quantidade de créditos de carbono equivalentes à emissão (kg).
     * @param {number} emissionKg
     * @returns {number} créditos (4 casas decimais)
     */
    calculateCarbonCredits: function (emissionKg) {
        var credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        return Math.round(credits * 10000) / 10000;
    },

    /**
     * Estima preço dos créditos de carbono (mín, máx, média).
     * @param {number} credits
     * @returns {{ min: number, max: number, average: number }}
     */
    estimateCreditPrice: function (credits) {
        var min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        var max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        var avg = (min + max) / 2;
        return {
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            average: Math.round(avg * 100) / 100
        };
    }
};
