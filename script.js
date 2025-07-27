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

        // Resetar quiz ao mudar de aba, se o quiz não for o ativo
        if (tabId !== 'quiz') {
            resetQuiz(); // Garante que o quiz está sempre no estado inicial ao sair
        }

        // NOVO: Ajustar min-height de todas as abas para 'auto' por padrão
        // Isso permite que o CSS principal gerencie a altura da maioria das abas
        tabContents.forEach(content => {
            content.style.minHeight = 'auto';
        });

        // NOVO: Exceção para a aba 'quiz' se ela precisar de um min-height específico para as perguntas
        // Se o CSS do .tab-content e .quiz-container estiver com min-height: auto, esta linha pode não ser necessária,
        // mas pode ser útil se as perguntas tiverem uma altura total muito maior que os resultados.
        if (tabId === 'quiz') {
            // Este min-height deve ser ajustado para acomodar a pergunta mais longa do quiz
            // Experimente valores como '580px', '600px' ou 'auto' se o CSS estiver ajustando bem.
            // Se o CSS do .tab-content já tiver um min-height adequado, pode remover esta linha.
            document.getElementById('quiz').style.minHeight = '580px';
        }
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
        showResults();
    }
}

function showResults() {
    // Calcular pontuação
    score = 0;
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

    // Esconde a última pergunta (se ainda estiver ativa) e mostra os resultados
    const lastQuestionElement = document.getElementById('step' + (currentQuestion));
    if (lastQuestionElement) {
        lastQuestionElement.classList.remove('active');
    }
    document.getElementById('results').classList.add('active');

    // NOVO: Ajustar a altura do quiz-container e tab-content para se adaptar aos resultados (min-height: auto)
    // Isso é crucial para que a caixa branca diminua
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.style.minHeight = 'auto'; // Deixa o min-height automático
    }
    const tabContentQuiz = document.getElementById('quiz');
    if (tabContentQuiz) {
        tabContentQuiz.style.minHeight = 'auto'; // Deixa o min-height automático
    }
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

    // NOVO: Resetar min-height para 'auto' ao reiniciar o quiz, para que as perguntas se ajustem naturalmente
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.style.minHeight = 'auto';
    }
    const tabContentQuiz = document.getElementById('quiz');
    if (tabContentQuiz) {
        // Defina um min-height inicial adequado para as perguntas, ou 'auto' se o CSS for suficiente
        tabContentQuiz.style.minHeight = '580px'; // Volte para a altura que funcionou para as perguntas ou 'auto'
    }
}

// Chama para a primeira pergunta carregar os listeners ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    addOptionClickListeners(document.getElementById('step1'));
});


// --------------------------------------------------------------------------------------
// NOVAS FUNÇÕES PARA O SIMULADOR DE HABILIDADES E IA + MEIO AMBIENTE
// --------------------------------------------------------------------------------------

// Dados para o Simulador de Habilidades
const skillsData = {
    "programação": {
        level: "Essencial",
        description: "A programação é fundamental para desenvolver, otimizar e aplicar soluções de IA. Profissionais com essa habilidade serão altamente demandados para construir o futuro."
    },
    "pensamento crítico": {
        level: "Altamente Valorizado",
        description: "A capacidade de analisar informações, questionar suposições e resolver problemas complexos é crucial, pois a IA não substitui o raciocínio humano aprofundado."
    },
    "criatividade": {
        level: "Indispensável",
        description: "A IA pode gerar ideias, mas a criatividade humana para inovar, criar conceitos e pensar fora da caixa continua sendo única e de alto valor em qualquer setor."
    },
    "comunicação": {
        level: "Crescente Importância",
        description: "Saber comunicar ideias complexas, colaborar com equipes e interagir com clientes é vital, especialmente em um mundo onde a interação humano-máquina se intensifica."
    },
    "inteligência emocional": {
        level: "Crucial",
        description: "Habilidades como empatia, autoconsciência e gestão de relacionamentos são exclusivas dos humanos e se tornam ainda mais valorizadas em funções de liderança e interação social."
    },
    "resolução de problemas": {
        level: "Essencial",
        description: "A IA ajuda na análise, mas a habilidade de identificar problemas, formular soluções e implementá-las de forma eficaz continua sendo um pilar para o futuro do trabalho."
    },
    "alfabetização em dados": {
        level: "Fundamental",
        description: "Compreender, interpretar e usar dados é cada vez mais importante para interagir efetivamente com sistemas de IA e tomar decisões informadas."
    },
    "adaptabilidade": {
        level: "Vital",
        description: "A capacidade de aprender e se adaptar rapidamente a novas ferramentas e tecnologias é crucial em um cenário de constantes mudanças impulsionadas pela IA."
    }
};

function analyzeSkill() {
    const skillInput = document.getElementById('skill-input');
    const skillResultDiv = document.getElementById('skill-result');
    const skillName = skillInput.value.trim().toLowerCase(); // Normaliza a entrada

    let resultHtml = '';

    if (skillsData[skillName]) {
        const data = skillsData[skillName];
        resultHtml = `
            <h4>Habilidade: ${skillName.charAt(0).toUpperCase() + skillName.slice(1)}</h4>
            <p><strong>Nível de Valorização na Era da IA:</strong> ${data.level}</p>
            <p>${data.description}</p>
        `;
    } else if (skillName === "") {
        resultHtml = '<p>Por favor, digite uma habilidade para analisar.</p>';
    }
    else {
        resultHtml = `
            <p>Não encontramos informações específicas para "${skillName}".</p>
            <p>Considere que habilidades como <strong>Pensamento Crítico</strong>, <strong>Criatividade</strong> e <strong>Inteligência Emocional</strong> são universalmente valorizadas, complementando as capacidades da IA.</p>
        `;
    }
    skillResultDiv.innerHTML = resultHtml;
    skillResultDiv.style.display = 'block'; // Garante que o resultado seja exibido
}

// Dados para "IA a Serviço do Meio Ambiente"
const envAIData = {
    "agricultura": {
        title: "Agricultura de Precisão",
        description: "A IA otimiza o uso de água, fertilizantes e pesticidas através da análise de dados de sensores e drones. Isso reduz o desperdício, melhora a produtividade das colheitas e minimiza o impacto ambiental da agricultura."
    },
    "cidades": {
        title: "Cidades Inteligentes",
        description: "Sistemas de IA podem otimizar o fluxo de tráfego para reduzir congestionamentos e emissões, gerenciar o consumo de energia em edifícios, e roteirizar a coleta de lixo de forma mais eficiente, tornando as cidades mais sustentáveis."
    },
    "desastres": {
        title: "Prevenção e Gestão de Desastres",
        description: "Algoritmos de IA analisam grandes volumes de dados climáticos e geográficos para prever desastres naturais como inundações e incêndios florestais. Também ajudam na gestão de recursos durante e após esses eventos."
    },
    "energia": {
        title: "Otimização de Energias Renováveis",
        description: "A IA pode prever a demanda de energia e a produção de fontes renováveis (solar, eólica), otimizando a distribuição na rede elétrica e minimizando o desperdício de energia. Isso acelera a transição para uma matriz energética limpa."
    }
};

function displayEnvAIInfo(envType) {
    const envAiResultDiv = document.getElementById('env-ai-result');
    let resultHtml = '';

    if (envAIData[envType]) {
        const data = envAIData[envType];
        resultHtml = `
            <h4>${data.title}</h4>
            <p>${data.description}</p>
        `;
    } else {
        resultHtml = '<p>Selecione uma área para ver os detalhes.</p>';
    }
    envAiResultDiv.innerHTML = resultHtml;
    envAiResultDiv.style.display = 'block';
}

// Adicionar listeners para os cards de IA e Meio Ambiente
document.addEventListener('DOMContentLoaded', function() {
    const envCards = document.querySelectorAll('.env-card');
    envCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remover a classe 'active' de todos os cards
            envCards.forEach(c => c.classList.remove('active'));
            // Adicionar a classe 'active' ao card clicado
            this.classList.add('active');
            displayEnvAIInfo(this.getAttribute('data-env-type'));
        });
    });
});

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});