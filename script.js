// NOVO: Lógica para esconder/mostrar o header ao rolar com threshold no topo
let lastScrollY = window.scrollY; // Variável para armazenar a última posição de rolagem
const header = document.querySelector('header'); // Pega o header uma vez
const topThreshold = 200; // Define o limiar em pixels para perto do topo

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
        // Rolando para baixo: Sempre esconde se já desceu o suficiente.
        if (currentScrollY > topThreshold) {
            header.classList.add('header-hidden');
        }
    } else {
        // Rolando para cima:
        // A navbar só aparece se estiver perto do topo (dentro do topThreshold)
        if (currentScrollY <= topThreshold) {
            header.classList.remove('header-hidden');
        } else {
            // Se rolando para cima, mas ainda longe do topo (fora do topThreshold), mantém escondida
            header.classList.add('header-hidden');
        }
    }

    // Caso especial: Sempre mostrar se estiver exatamente no topo da página
    if (currentScrollY === 0) {
        header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY; // Atualiza a última posição de rolagem
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

        // Ajustar min-height de todas as abas para 'auto' por padrão
        tabContents.forEach(content => {
            content.style.minHeight = 'auto';
        });

        // Exceção para a aba 'quiz' se ela precisar de um min-height específico para as perguntas
        if (tabId === 'quiz') {
            document.getElementById('quiz').style.minHeight = '580px'; // Altura ideal para o quiz
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
        option.removeEventListener('click', handleOptionClick);
        option.addEventListener('click', handleOptionClick);
    });
}

// Handler para o clique em uma opção do quiz
function handleOptionClick() {
    const currentStep = this.closest('.quiz-step');
    const optionsInCurrentStep = currentStep.querySelectorAll('.option');

    optionsInCurrentStep.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.classList.remove('selected', 'correct', 'incorrect');
    });

    this.classList.add('selected');

    const isCorrect = this.getAttribute('data-correct') === 'true';
    if (isCorrect) {
        this.classList.add('correct');
    } else {
        this.classList.add('incorrect');
    }

    setTimeout(() => {
        optionsInCurrentStep.forEach(opt => opt.style.pointerEvents = 'auto');

        if (currentQuestion === 3) {
            showResults();
        } else {
            nextQuestion();
        }
    }, 1500);
}

function nextQuestion() {
    const currentStepElement = document.getElementById('step' + currentQuestion);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
    }

    currentQuestion++;
    const nextStepElement = document.getElementById('step' + currentQuestion);

    if (nextStepElement) {
        nextStepElement.classList.add('active');
        addOptionClickListeners(nextStepElement);
    } else {
        showResults();
    }
}

function showResults() {
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

    const lastQuestionElement = document.getElementById('step' + (currentQuestion));
    if (lastQuestionElement) {
        lastQuestionElement.classList.remove('active');
    }
    document.getElementById('results').classList.add('active');

    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.style.minHeight = 'auto';
    }
    const tabContentQuiz = document.getElementById('quiz');
    if (tabContentQuiz) {
        tabContentQuiz.style.minHeight = 'auto';
    }
}

function resetQuiz() {
    currentQuestion = 1;
    score = 0;

    document.querySelectorAll('.quiz-step .option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.style.pointerEvents = 'auto';
    });

    document.getElementById('results').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    addOptionClickListeners(document.getElementById('step1'));

    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.style.minHeight = 'auto';
    }
    const tabContentQuiz = document.getElementById('quiz');
    if (tabContentQuiz) {
        tabContentQuiz.style.minHeight = '580px';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addOptionClickListeners(document.getElementById('step1'));
});


// --------------------------------------------------------------------------------------
// FUNÇÕES PARA O SIMULADOR DE HABILIDADES E IA + MEIO AMBIENTE (CARDS)
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
    },
    "colaboração": {
        level: "Essencial",
        description: "A capacidade de trabalhar eficazmente em equipe, tanto com humanos quanto com sistemas de IA, será fundamental para projetos complexos e inovadores."
    },
    "ética em ia": {
        level: "Emergente e Crítica",
        description: "Com o avanço da IA, a demanda por profissionais que entendam e apliquem princípios éticos na sua concepção e uso será vital para garantir tecnologias justas e responsáveis."
    },
    "curiosidade": {
        level: "Altamente Valorizada",
        description: "A curiosidade impulsiona a exploração e o aprendizado contínuo, qualidades essenciais para se manter relevante em um mercado de trabalho em constante evolução pela IA."
    },
    "negociação": {
        level: "Relevante",
        description: "Enquanto a IA pode otimizar processos, a negociação e a persuasão em interações complexas com clientes, parceiros e equipes permanecem habilidades humanas chave."
    },
    "design thinking": {
        level: "Crescente Importância",
        description: "A abordagem de Design Thinking permite resolver problemas de forma criativa, colocando o ser humano no centro, habilidade que complementa o poder analítico da IA."
    },
    "interpretação de dados": {
        level: "Crucial",
        description: "Ir além da coleta de dados; a habilidade de interpretar resultados gerados pela IA, identificar padrões e extrair insights relevantes para tomada de decisão."
    }
};

function analyzeSkill() {
    const skillInput = document.getElementById('skill-input');
    const skillResultDiv = document.getElementById('skill-result');
    const skillName = skillInput.value.trim().toLowerCase();

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
    skillResultDiv.style.display = 'block';
}

// Dados para a ABA "Meio Ambiente" (environment-cards)
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
    const envCardsResultDiv = document.getElementById('env-cards-result'); // ID de resultado para esta aba
    let resultHtml = '';

    if (envAIData[envType]) {
        const data = envAIData[envType];
        resultHtml = `
            <h4>${data.title}</h4>
            <p>${data.description}</p>
        `;
    } else {
        resultHtml = '<p>Clique em uma área para saber como a IA ajuda!</p>';
    }
    envCardsResultDiv.innerHTML = resultHtml;
    envCardsResultDiv.style.display = 'block';
}

// Adicionar listeners para os cards da ABA "Meio Ambiente" (environment-cards)
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