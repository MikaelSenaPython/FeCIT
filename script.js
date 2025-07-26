// Inicialização dos gráficos
document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de automação de empregos
    const automationCtx = document.getElementById('automationChart').getContext('2d');
    new Chart(automationCtx, {
        type: 'bar',
        data: {
            labels: ['Administrativo', 'Manufatura', 'Varejo', 'Transporte', 'Saúde', 'Educação', 'TI'],
            datasets: [{
                label: '% de Tarefas Automatizáveis',
                data: [55, 45, 38, 30, 20, 15, 40],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(72, 149, 239, 0.7)',
                    'rgba(72, 149, 239, 0.7)',
                    'rgba(76, 201, 240, 0.7)'
                ],
                borderColor: [
                    'rgba(67, 97, 238, 1)',
                    'rgba(67, 97, 238, 1)',
                    'rgba(67, 97, 238, 1)',
                    'rgba(67, 97, 238, 1)',
                    'rgba(72, 149, 239, 1)',
                    'rgba(72, 149, 239, 1)',
                    'rgba(76, 201, 240, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Porcentagem'
                    }
                }
            }
        }
    });

    // Gráfico de consumo de energia
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    new Chart(energyCtx, {
        type: 'doughnut',
        data: {
            labels: ['Treinamento', 'Inferência', 'Armazenamento', 'Refrigeração'],
            datasets: [{
                label: 'Consumo de Energia',
                data: [45, 35, 10, 10],
                backgroundColor: [
                    'rgba(247, 37, 133, 0.7)',
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(72, 149, 239, 0.7)',
                    'rgba(76, 201, 240, 0.7)'
                ],
                borderColor: [
                    'rgba(247, 37, 133, 1)',
                    'rgba(67, 97, 238, 1)',
                    'rgba(72, 149, 239, 1)',
                    'rgba(76, 201, 240, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Distribuição do Consumo de Energia em Sistemas de IA'
                }
            }
        }
    });
});

// Funcionalidade das abas
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover classe ativa de todos os botões e conteúdos
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Adicionar classe ativa ao botão clicado
        btn.classList.add('active');

        // Mostrar o conteúdo correspondente
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Quiz
let currentQuestion = 1;
let score = 0;

// Função para adicionar evento de clique às opções de uma etapa
function addOptionClickListeners(stepElement) {
    const options = stepElement.querySelectorAll('.option');
    options.forEach(option => {
        // Remove listeners antigos para evitar duplicação se a função for chamada novamente
        option.removeEventListener('click', handleOptionClick); // Remove o listener anterior
        option.addEventListener('click', handleOptionClick); // Adiciona o novo listener
    });
}

// Handler para o clique em uma opção do quiz
function handleOptionClick() {
    const currentStep = this.closest('.quiz-step'); // Encontra o pai .quiz-step
    const optionsInCurrentStep = currentStep.querySelectorAll('.option');

    // Desabilitar cliques adicionais na pergunta atual
    optionsInCurrentStep.forEach(opt => {
        opt.style.pointerEvents = 'none'; // Desabilita cliques após a primeira escolha
        opt.classList.remove('selected', 'correct', 'incorrect'); // Limpa seleções e cores anteriores
    });

    // Selecionar a opção clicada
    this.classList.add('selected');

    // Verificar se está correta
    const isCorrect = this.getAttribute('data-correct') === 'true';
    if (isCorrect) {
        this.classList.add('correct'); // Adiciona a classe verde
    } else {
        this.classList.add('incorrect'); // Adiciona a classe vermelha
    }

    // Atraso para ver o feedback visual antes de avançar para a próxima pergunta
    setTimeout(() => {
        // Reabilitar cliques antes de avançar, caso a próxima pergunta utilize a mesma lógica
        optionsInCurrentStep.forEach(opt => opt.style.pointerEvents = 'auto');

        // Se esta é a última pergunta antes dos resultados, chame showResults()
        if (currentQuestion === 3) { // Ajuste 3 para o número total de perguntas se for diferente
            showResults();
        } else {
            nextQuestion();
        }
    }, 1500); // 1.5 segundos de atraso
}

function nextQuestion() {
    const currentStepElement = document.getElementById('step' + currentQuestion);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        // Remover classes de seleção e cor ao sair da pergunta
        currentStepElement.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
    }

    currentQuestion++;
    const nextStepElement = document.getElementById('step' + currentQuestion);

    if (nextStepElement) {
        nextStepElement.classList.add('active'); // Adiciona active para mostrar e acionar a animação
        addOptionClickListeners(nextStepElement); // Adiciona listeners para as opções da nova pergunta
    } else {
        // Não deveria chegar aqui se o handleOptionClick já gerencia a chamada para showResults na última pergunta
        // Mas como fallback, pode chamar showResults() aqui também.
        showResults();
    }
}

function showResults() {
    // Calcular pontuação
    score = 0;
    // Pega todas as opções que foram marcadas como corretas em TODAS as perguntas para o score final
    // Nota: A lógica de pontuação é feita no showResults, não no handleOptionClick
    const allQuizSteps = document.querySelectorAll('.quiz-step');
    allQuizSteps.forEach(step => {
        step.querySelectorAll('.option.selected').forEach(option => {
            if (option.getAttribute('data-correct') === 'true') {
                score++;
            }
        });
    });

    document.getElementById('score').textContent = score;

    // Feedback baseado na pontuação
    let feedback = '';
    if (score === 3) { // Se houver 3 perguntas, 3 acertos é o máximo
        feedback = '<p>Parabéns! Você domina os conceitos fundamentais sobre IA.</p>';
    } else if (score === 2) {
        feedback = '<p>Bom trabalho! Você tem um bom entendimento sobre IA.</p>';
    } else if (score === 1) {
        feedback = '<p>Você está no caminho certo, mas pode aprender mais sobre IA.</p>';
    } else {
        feedback = '<p>Continue explorando para entender melhor o impacto da IA.</p>';
    }

    document.getElementById('quizFeedback').innerHTML = feedback;

    // Esconde a última pergunta (se ainda estiver ativa) e mostra os resultados
    // Certifique-se de que a última pergunta foi desativada antes de mostrar os resultados
    const lastQuestionElement = document.getElementById('step' + (currentQuestion));
    if (lastQuestionElement) {
        lastQuestionElement.classList.remove('active');
    }
    document.getElementById('results').classList.add('active');
}

function resetQuiz() {
    // Resetar estado
    currentQuestion = 1;
    score = 0;

    // Limpar seleções e cores de TODAS as opções em TODAS as etapas
    document.querySelectorAll('.quiz-step .option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.style.pointerEvents = 'auto'; // Reabilita cliques
    });

    // Voltar para a primeira pergunta
    document.getElementById('results').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    addOptionClickListeners(document.getElementById('step1')); // Garante que a primeira pergunta tenha listeners
}

// Chama para a primeira pergunta carregar os listeners ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona listeners apenas à primeira pergunta no carregamento inicial
    addOptionClickListeners(document.getElementById('step1'));
});


// Calculadora de Pegada de Carbono
function calculateFootprint() {
    const modelSize = document.getElementById('model-size').value;
    const trainingTime = parseInt(document.getElementById('training-time').value);
    const hardware = document.getElementById('hardware').value;
    const energySource = document.getElementById('energy-source').value;

    // Fatores de cálculo (ajustados para simulação)
    let sizeFactor = 0;
    switch(modelSize) {
        case 'small': sizeFactor = 1; break;
        case 'medium': sizeFactor = 10; break;
        case 'large': sizeFactor = 50; break;
        case 'xlarge': sizeFactor = 200; break;
    }

    let hardwareFactor = 1; // Base: GPU
    switch(hardware) {
        case 'cpu': hardwareFactor = 1.5; break; // CPUs geralmente menos eficientes que GPUs para ML
        case 'gpu': hardwareFactor = 1; break;
        case 'tpu': hardwareFactor = 0.7; break; // TPUs mais eficientes
    }

    let energyFactor = 1; // Base: Energia mista
    switch(energySource) {
        case 'fossil': energyFactor = 1.5; break; // Mais CO2
        case 'mixed': energyFactor = 1; break;
        case 'renewable': energyFactor = 0.3; break; // Menos CO2
    }

    // Cálculo da pegada de carbono (valores arbitrários para demonstração)
    const co2Tons = Math.round((sizeFactor * trainingTime * hardwareFactor * energyFactor) * 10) / 10;

    // Atualizar a UI com o resultado
    document.getElementById('co2-amount').textContent = co2Tons + " toneladas";

    // Barra de progresso (escala para visualização)
    const maxCO2 = 300; // Define um valor máximo para a barra de progresso
    const progressPercent = Math.min(100, (co2Tons / maxCO2) * 100);
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    // Comparação com carros (média de 4.6 toneladas de CO2/ano por carro nos EUA)
    const carsEquivalent = Math.round(co2Tons / 4.6);
    document.getElementById('comparison').textContent =
        `Isso equivale a aproximadamente ${carsEquivalent} carros na estrada por um ano`;

    // Sugestões para reduzir o impacto
    let suggestionsList = '';
    if (co2Tons > 50) {
        suggestionsList += '<li>Considere reduzir o tamanho do modelo ou otimizar sua arquitetura.</li>';
        suggestionsList += '<li>Otimize o tempo de treinamento utilizando técnicas de parada antecipada.</li>';
    }
    if (energySource !== 'renewable') {
        suggestionsList += '<li>Priorize o uso de data centers que utilizam fontes de energia renovável.</li>';
    }
    if (hardware === 'cpu' || hardware === 'gpu') {
        suggestionsList += '<li>Considere usar hardware especializado (TPUs) para maior eficiência energética, se disponível.</li>';
    }
    suggestionsList += '<li>Explore técnicas de compressão de modelos (model pruning, quantization) para reduzir o custo de inferência.</li>';

    document.getElementById('suggestions').innerHTML = `<ul>${suggestionsList}</ul>`;

    // Mostrar resultado
    document.getElementById('result').style.display = 'block';
}

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});