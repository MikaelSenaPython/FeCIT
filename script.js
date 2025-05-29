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
const options = document.querySelectorAll('.option');

options.forEach(option => {
    option.addEventListener('click', function() {
        // Remover seleção de todas as opções nesta pergunta
        this.parentElement.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Selecionar a opção clicada
        this.classList.add('selected');
        
        // Verificar se está correta
        const isCorrect = this.getAttribute('data-correct') === 'true';
        if (isCorrect) {
            this.classList.add('correct');
        } else {
            this.classList.add('incorrect');
        }
    });
});

function nextQuestion() {
    document.getElementById('step' + currentQuestion).classList.remove('active');
    currentQuestion++;
    document.getElementById('step' + currentQuestion).classList.add('active');
}

function showResults() {
    // Calcular pontuação
    score = 0;
    const selectedOptions = document.querySelectorAll('.option.selected');
    
    selectedOptions.forEach(option => {
        if (option.getAttribute('data-correct') === 'true') {
            score++;
        }
    });
    
    document.getElementById('score').textContent = score;
    
    // Feedback baseado na pontuação
    let feedback = '';
    if (score === 3) {
        feedback = '<p>Parabéns! Você domina os conceitos fundamentais sobre IA.</p>';
    } else if (score === 2) {
        feedback = '<p>Bom trabalho! Você tem um bom entendimento sobre IA.</p>';
    } else if (score === 1) {
        feedback = '<p>Você está no caminho certo, mas pode aprender mais sobre IA.</p>';
    } else {
        feedback = '<p>Continue explorando para entender melhor o impacto da IA.</p>';
    }
    
    document.getElementById('quizFeedback').innerHTML = feedback;
    
    // Mostrar resultados
    document.getElementById('step' + currentQuestion).classList.remove('active');
    document.getElementById('results').classList.add('active');
}

function resetQuiz() {
    // Resetar estado
    currentQuestion = 1;
    score = 0;
    
    // Limpar seleções
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Voltar para primeira pergunta
    document.getElementById('results').classList.remove('active');
    document.getElementById('step1').classList.add('active');
}

// Calculadora de Pegada de Carbono
function calculateFootprint() {
    const modelSize = document.getElementById('model-size').value;
    const trainingTime = parseInt(document.getElementById('training-time').value);
    const hardware = document.getElementById('hardware').value;
    const energySource = document.getElementById('energy-source').value;
    
    // Fatores de cálculo
    let sizeFactor = 0;
    switch(modelSize) {
        case 'small': sizeFactor = 1; break;
        case 'medium': sizeFactor = 10; break;
        case 'large': sizeFactor = 50; break;
        case 'xlarge': sizeFactor = 200; break;
    }
    
    let hardwareFactor = 1;
    switch(hardware) {
        case 'cpu': hardwareFactor = 1.5; break;
        case 'gpu': hardwareFactor = 1; break;
        case 'tpu': hardwareFactor = 0.7; break;
    }
    
    let energyFactor = 1;
    switch(energySource) {
        case 'fossil': energyFactor = 1.5; break;
        case 'mixed': energyFactor = 1; break;
        case 'renewable': energyFactor = 0.3; break;
    }
    
    // Cálculo da pegada de carbono
    const co2Tons = Math.round((sizeFactor * trainingTime * hardwareFactor * energyFactor) * 10) / 10;
    
    // Atualizar a UI com o resultado
    document.getElementById('co2-amount').textContent = co2Tons + " toneladas";
    
    // Barra de progresso
    const maxCO2 = 300; // para escala
    const progressPercent = Math.min(100, (co2Tons / maxCO2) * 100);
    document.getElementById('progress-bar').style.width = progressPercent + '%';
    
    // Comparação
    const carsEquivalent = Math.round(co2Tons / 4.6);
    document.getElementById('comparison').textContent = 
        `Isso equivale a ${carsEquivalent} carros na estrada por um ano`;
    
    // Sugestões
    let suggestions = '<ul>';
    if (co2Tons > 50) {
        suggestions += '<li>Considere reduzir o tamanho do modelo</li>';
        suggestions += '<li>Otimize o tempo de treinamento</li>';
    }
    if (energySource !== 'renewable') {
        suggestions += '<li>Priorize data centers com energia renovável</li>';
    }
    if (hardware === 'cpu') {
        suggestions += '<li>Use hardware especializado (GPUs/TPUs) para maior eficiência</li>';
    }
    suggestions += '<li>Implemente técnicas de otimização de modelos</li>';
    suggestions += '<li>Considere transfer learning para reduzir treinamento</li></ul>';
    
    document.getElementById('suggestions').innerHTML = suggestions;
    
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