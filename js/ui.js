// js/ui.js
// Objeto global UI: utilitários de formatação, manipulação de elementos e renderização de resultados

var UI = {
    /**
     * Formata número com casas decimais e separador de milhar (pt-BR)
     */
    formatNumber: function (number, decimals) {
        if (isNaN(number)) return '';
        return Number(number).toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    /**
     * Formata valor como moeda brasileira (R$)
     */
    formatCurrency: function (value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    /**
     * Exibe elemento removendo a classe 'hidden'
     */
    showElement: function (elementId) {
        var el = document.getElementById(elementId);
        if (el) el.classList.remove('hidden');
    },

    /**
     * Oculta elemento adicionando a classe 'hidden'
     */
    hideElement: function (elementId) {
        var el = document.getElementById(elementId);
        if (el) el.classList.add('hidden');
    },

    /**
     * Rola suavemente até o elemento
     */
    scrollToElement: function (elementId) {
        var el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    /**
     * Renderiza resultado principal da simulação
     * @param {Object} data - { origin, destination, distance, emission, mode, savings }
     * @returns {string} HTML
     */
    renderResults: function (data) {
        var modeMeta = CONFIG.TRANSPORT_MODES[data.mode] || {};
        var icon = UI._getModeIcon(data.mode);
        var html = `
        <div class="results_card results_card--route">
            <div class="results_card__title">Rota</div>
            <div class="results_card__value">${data.origin} <span class="results_card__arrow">→</span> ${data.destination}</div>
        </div>
        <div class="results_card results_card--distance">
            <div class="results_card__title">Distância</div>
            <div class="results_card__value">${UI.formatNumber(data.distance, 1)} km</div>
        </div>
        <div class="results_card results_card--emission">
            <div class="results_card__title">Emissão</div>
            <div class="results_card__value"><span class="results_card__icon results_card__icon--leaf">🍃</span> ${UI.formatNumber(data.emission, 2)} kg CO₂</div>
        </div>
        <div class="results_card results_card--mode">
            <div class="results_card__title">Transporte</div>
            <div class="results_card__value"><span class="results_card__icon results_card__icon--mode" style="color:${modeMeta.color}">${icon}</span> ${modeMeta.label || data.mode}</div>
        </div>
        `;
        if (data.mode !== 'carro' && data.savings && data.savings.saved > 0) {
            html += `
            <div class="results_card results_card--savings">
                <div class="results_card__title">Economia</div>
                <div class="results_card__value">${UI.formatNumber(data.savings.saved, 2)} kg CO₂ (${UI.formatNumber(data.savings.percentage, 1)}%)</div>
            </div>
            `;
        }
        return `<div class="results_cards">${html}</div>`;
    },

    /**
     * Renderiza comparação entre modos de transporte
     * @param {Array} modesArray - resultado de Calculator.calculateAllModes()
     * @param {string} selectedMode
     * @returns {string} HTML
     */
    renderComparison: function (modesArray, selectedMode) {
        var maxEmission = Math.max.apply(null, modesArray.map(m => m.emission));
        var html = modesArray.map(function (m) {
            var meta = CONFIG.TRANSPORT_MODES[m.mode] || {};
            var icon = UI._getModeIcon(m.mode);
            var percent = maxEmission > 0 ? (m.emission / maxEmission) * 100 : 0;
            var barColor = percent <= 25 ? '#4CAF50' : percent <= 75 ? '#FFEB3B' : percent <= 100 ? '#FF9800' : '#F44336';
            return `
            <div class="comparison_item${m.mode === selectedMode ? ' comparison_item--selected' : ''}">
                <div class="comparison_item__header">
                    <span class="comparison_item__icon" style="color:${meta.color}">${icon}</span>
                    <span class="comparison_item__label">${meta.label || m.mode}</span>
                    ${m.mode === selectedMode ? '<span class="comparison_item__badge">Selecionado</span>' : ''}
                </div>
                <div class="comparison_item__stats">
                    <span class="comparison_item__emission">${UI.formatNumber(m.emission, 2)} kg CO₂</span>
                    <span class="comparison_item__percent">${UI.formatNumber(m.percentageVsCar, 1)}% do carro</span>
                </div>
                <div class="comparison_item__bar">
                    <div class="comparison_item__bar-inner" style="width:${percent}%;background:${barColor}"></div>
                </div>
            </div>
            `;
        }).join('');
        html += `
        <div class="comparison_tip">
            <span class="comparison_tip__icon">💡</span>
            <span class="comparison_tip__text">Dica: Modos mais limpos ajudam a reduzir sua pegada de carbono!</span>
        </div>`;
        return `<div class="comparison_list">${html}</div>`;
    },

    /**
     * Renderiza informações de créditos de carbono
     * @param {Object} creditsData - { credits, price: { min, max, average } }
     * @returns {string} HTML
     */
    renderCarbonCredits: function (creditsData) {
        return `
        <div class="carbon_credits_grid">
            <div class="carbon_credits_card carbon_credits_card--credits">
                <div class="carbon_credits_card__value">${UI.formatNumber(creditsData.credits, 4)}</div>
                <div class="carbon_credits_card__label">Créditos necessários</div>
                <div class="carbon_credits_card__helper">1 crédito = 1000 kg CO₂</div>
            </div>
            <div class="carbon_credits_card carbon_credits_card--price">
                <div class="carbon_credits_card__value">${UI.formatCurrency(creditsData.price.average)}</div>
                <div class="carbon_credits_card__label">Preço estimado</div>
                <div class="carbon_credits_card__range">${UI.formatCurrency(creditsData.price.min)} - ${UI.formatCurrency(creditsData.price.max)}</div>
            </div>
        </div>
        <div class="carbon_credits_info">
            <span class="carbon_credits_info__icon">ℹ️</span>
            <span class="carbon_credits_info__text">Créditos de carbono representam a compensação de emissões. Ao adquirir, você apoia projetos ambientais certificados.</span>
        </div>
        <button class="carbon_credits_btn">Compensar Emissões</button>
        `;
    },

    /**
     * Mostra loading em botão, salvando texto original
     */
    showLoading: function (buttonElement) {
        if (!buttonElement) return;
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
    },

    /**
     * Restaura botão após loading
     */
    hideLoading: function (buttonElement) {
        if (!buttonElement) return;
        buttonElement.disabled = false;
        if (buttonElement.dataset.originalText) {
            buttonElement.innerHTML = buttonElement.dataset.originalText;
        }
    },

    // Utilitário privado: retorna emoji para cada modo
    _getModeIcon: function (mode) {
        switch (mode) {
            case 'bicicleta': return '🚲';
            case 'carro': return '🚗';
            case 'ônibus': return '🚌';
            case 'caminhão': return '🚚';
            default: return '❓';
        }
    }
};
