// js/routes-data.js
// Global object RoutesDB: armazena rotas populares entre cidades brasileiras e fornece métodos utilitários.
// Estrutura:
// - routes: array de objetos { origin, destination, distanceKm }
// - getAllCities(): retorna array única e ordenada de todas as cidades
// - findDistance(origin, destination): retorna distância entre duas cidades (ambas direções)

var RoutesDB = {
    // Lista de rotas populares (capitais e grandes cidades)
    routes: [
        { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
        { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
        { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
        { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
        { origin: "Belo Horizonte, MG", destination: "Rio de Janeiro, RJ", distanceKm: 434 },
        { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
        { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
        { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKm: 476 },
        { origin: "Porto Alegre, RS", destination: "Curitiba, PR", distanceKm: 711 },
        { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
        { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1448 },
        { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 839 },
        { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKm: 800 },
        { origin: "Fortaleza, CE", destination: "São Luís, MA", distanceKm: 1077 },
        { origin: "São Luís, MA", destination: "Belém, PA", distanceKm: 806 },
        { origin: "Belém, PA", destination: "Manaus, AM", distanceKm: 5297 },
        { origin: "Manaus, AM", destination: "Boa Vista, RR", distanceKm: 785 },
        { origin: "Brasília, DF", destination: "Campo Grande, MS", distanceKm: 1134 },
        { origin: "Campo Grande, MS", destination: "Cuiabá, MT", distanceKm: 694 },
        { origin: "Cuiabá, MT", destination: "Porto Velho, RO", distanceKm: 1450 },
        { origin: "Porto Velho, RO", destination: "Rio Branco, AC", distanceKm: 544 },
        { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 356 },
        { origin: "Aracaju, SE", destination: "Maceió, AL", distanceKm: 278 },
        { origin: "Maceió, AL", destination: "Recife, PE", distanceKm: 262 },
        { origin: "Natal, RN", destination: "João Pessoa, PB", distanceKm: 185 },
        { origin: "João Pessoa, PB", destination: "Recife, PE", distanceKm: 120 },
        { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
        { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
        { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
        { origin: "Fortaleza, CE", destination: "Teresina, PI", distanceKm: 634 },
        { origin: "Belém, PA", destination: "Macapá, AP", distanceKm: 600 },
        { origin: "Palmas, TO", destination: "Goiânia, GO", distanceKm: 874 },
        { origin: "Vitória, ES", destination: "Belo Horizonte, MG", distanceKm: 524 },
        { origin: "Vitória, ES", destination: "Rio de Janeiro, RJ", distanceKm: 521 },
        { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 72 },
        { origin: "Recife, PE", destination: "Mossoró, RN", distanceKm: 277 },
        { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 261 },
        { origin: "Curitiba, PR", destination: "Joinville, SC", distanceKm: 130 },
        { origin: "Manaus, AM", destination: "Porto Velho, RO", distanceKm: 901 },
        { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 313 },
        { origin: "Goiânia, GO", destination: "Uberlândia, MG", distanceKm: 335 },
        { origin: "Brasília, DF", destination: "Uberlândia, MG", distanceKm: 539 }
    ],

    /**
     * Retorna array única e ordenada de todas as cidades presentes nas rotas.
     * Extrai de origin e destination, remove duplicatas e ordena.
     */
    getAllCities: function () {
        var cidades = this.routes.reduce(function (arr, rota) {
            arr.push(rota.origin, rota.destination);
            return arr;
        }, []);
        // Remove duplicatas e ordena
        return Array.from(new Set(cidades)).sort(function (a, b) {
            return a.localeCompare(b, 'pt-BR');
        });
    },

    /**
     * Busca a distância entre duas cidades (ambas direções).
     * Normaliza entrada (trim, lowercase) para comparação.
     * Retorna distância em km se encontrada, senão null.
     */
    findDistance: function (origin, destination) {
        if (!origin || !destination) return null;
        var o = origin.trim().toLowerCase();
        var d = destination.trim().toLowerCase();
        for (var i = 0; i < this.routes.length; i++) {
            var r = this.routes[i];
            var ro = r.origin.trim().toLowerCase();
            var rd = r.destination.trim().toLowerCase();
            if ((o === ro && d === rd) || (o === rd && d === ro)) {
                return r.distanceKm;
            }
        }
        return null;
    }
};
