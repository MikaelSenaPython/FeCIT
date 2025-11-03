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
// --- INÍCIO DO CÓDIGO DO QUIZ (COPIE E SUBSTITUA NO SEU SCRIPT.JS) ---

let currentQuestion = 1;
let score = 0;
// Seleciona especificamente as opções dentro do contêiner do quiz
const options = document.querySelectorAll('#quiz .option');

// Adiciona o clique para TODAS as opções do quiz
options.forEach(option => {
    option.addEventListener('click', function() {
        
        // Impede cliques múltiplos enquanto a transição ocorre
        const parentOptions = this.parentElement;
        parentOptions.querySelectorAll('.option').forEach(opt => opt.style.pointerEvents = 'none');

        // 1. Remove a seleção de 'irmãos'
        parentOptions.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // 2. Adiciona a classe 'selected' e de feedback (certo/errado)
        this.classList.add('selected');
        const isCorrect = this.getAttribute('data-correct') === 'true';
        if (isCorrect) {
            this.classList.add('correct');
        } else {
            this.classList.add('incorrect');
        }

        // 3. Descobre em qual passo estamos
        const currentStepElement = this.closest('.quiz-step');
        const currentStepId = currentStepElement.id; // ex: "step3"

        // 4. LÓGICA DE AVANÇO AUTOMÁTICO
        // Espera 800ms (0.8 segundos) para o usuário ver o feedback
        setTimeout(() => {
            if (currentStepId === 'step4') {
                // Se for a última pergunta (step4), mostra os resultados
                showResults();
            } else {
                // Se não, apenas avança para a próxima
                nextQuestion();
            }
            
            // Reabilita os cliques nas opções do próximo passo (se houver)
            parentOptions.querySelectorAll('.option').forEach(opt => opt.style.pointerEvents = 'auto');

        }, 800); 
    });
});

// Função para avançar para a próxima pergunta
function nextQuestion() {
    // Esconde a pergunta atual
    document.getElementById('step' + currentQuestion).classList.remove('active');
    // Incrementa o contador
    currentQuestion++;
    // Mostra a próxima pergunta
    document.getElementById('step' + currentQuestion).classList.add('active');
}

// Função para mostrar os resultados (chamada SÓ na última pergunta)
function showResults() {
    // Calcular pontuação
    score = 0;
    const selectedOptions = document.querySelectorAll('#quiz .option.selected');
    
    selectedOptions.forEach(option => {
        if (option.getAttribute('data-correct') === 'true') {
            score++;
        }
    });
    
    // Atualiza o placar na tela
    document.getElementById('score').textContent = score;
    
    // Feedback baseado na pontuação (para 4 perguntas)
    let feedback = '';
    if (score === 4) {
        feedback = '<p>Parabéns! Você domina os conceitos fundamentais e o futuro do trabalho com IA.</p>';
    } else if (score === 3) {
        feedback = '<p>Ótimo resultado! Você tem um bom entendimento sobre IA e suas implicações profissionais.</p>';
    } else if (score === 2) {
        feedback = '<p>Bom trabalho! Você está no caminho certo para entender a Revolução da IA.</p>';
    } else if (score === 1) {
        feedback = '<p>Você está começando bem! Continue explorando o impacto da IA nas carreiras.</p>';
    } else {
        feedback = '<p>Continue explorando o site para dominar o futuro da Inteligência Artificial!</p>';
    }
    
    document.getElementById('quizFeedback').innerHTML = feedback;
    
    // Esconde a última pergunta e mostra os resultados
    document.getElementById('step' + currentQuestion).classList.remove('active');
    document.getElementById('results').classList.add('active');
}

// Função para reiniciar o quiz
function resetQuiz() {
    // Resetar estado
    currentQuestion = 1;
    score = 0;
    
    // Limpar seleções e cores
    document.querySelectorAll('#quiz .option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.style.pointerEvents = 'auto'; // Garante que os cliques voltem a funcionar
    });
    
    // Esconder todos os passos
    document.querySelectorAll('#quiz .quiz-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Voltar para primeira pergunta
    document.getElementById('step1').classList.add('active');
}

// --- FIM DO CÓDIGO DO QUIZ ---

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
    },
    "transporte": {
        level: "Relevância Redefinida",
        description: "Com o avanço da IA em veículos autônomos e otimização logística, a habilidade em transporte evolui. Profissionais se focarão em gestão de frotas autônomas, manutenção de sistemas inteligentes e planejamento de redes complexas, exigindo adaptabilidade tecnológica."
    }
};

// "Banco de dados" de habilidades
const skillDatabase = {
    'criatividade': {
        title: 'Criatividade',
        demand: 'Alta Demanda',
        badge: 'badge-alta',
        text: 'Essencial! A IA é uma ferramenta para executar tarefas. A criatividade humana é necessária para fazer as perguntas certas, criar novos conceitos e inovar.'
    },
    'critico': {
        title: 'Pensamento Crítico',
        demand: 'Alta Demanda',
        badge: 'badge-alta',
        text: 'Fundamental. Precisamos de humanos para analisar os resultados que a IA gera, questionar suas conclusões e tomar decisões éticas e estratégicas.'
    },
    'emocional': {
        title: 'Inteligência Emocional',
        demand: 'Alta Demanda',
        badge: 'badge-alta',
        text: 'Insubstituível. Habilidades como empatia, liderança e colaboração são puramente humanas. A IA não consegue gerenciar equipes ou se conectar com um cliente.'
    },
    'programacao': {
        title: 'Programação',
        demand: 'Média/Alta Demanda',
        badge: 'badge-media',
        text: 'Em transformação. A IA pode escrever códigos básicos, mas engenheiros de software ainda são vitais para projetar sistemas complexos e gerenciar a IA.'
    },
    'comunicacao': {
        title: 'Comunicação',
        demand: 'Alta Demanda',
        badge: 'badge-alta',
        text: 'Mais importante do que nunca. Saber explicar ideias complexas (como as da IA) para colegas, clientes e para o público será uma habilidade-chave.'
    },
    'etica': {
        title: 'Ética em IA',
        demand: 'Alta Demanda',
        badge: 'badge-alta',
        text: 'Uma nova área em crescimento. Profissionais que garantem que a IA seja justa e transparente são essenciais para o futuro da tecnologia.'
    },
    'repetitivo': {
        title: 'Trabalho Repetitivo',
        demand: 'Baixa Demanda',
        badge: 'badge-baixa',
        text: 'Em risco. Tarefas manuais ou de escritório que são repetitivas e baseadas em regras (como entrada de dados) são as mais fáceis de serem automatizadas pela IA.'
    }
};

// Nova função que recebe o nome da habilidade (do botão)
function analyzeSkill(skillName) {
    const skillData = skillDatabase[skillName];
    const resultDiv = document.getElementById('skill-result');
    
    if (skillData) {
        // Formata o HTML com os dados da habilidade
        resultDiv.innerHTML = `
            <h4>${skillData.title}</h4>
            <p>${skillData.text}</p>
            <span class="skill-badge ${skillData.badge}">${skillData.demand}</span>
        `;
        // Mostra a caixa de resultado
        resultDiv.style.display = 'block';
    }
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