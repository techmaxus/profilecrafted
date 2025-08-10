/**
 * Essay Generation Module
 * Modular essay generation with professional prompts
 */

const essayConfig = {
  company: {
    name: 'Perplexity',
    position: 'Associate Product Manager',
    mission: "organizing the world's information and making it universally accessible through innovative AI-powered solutions",
  },
  
  prompt: {
    systemRole: "You are an expert career storyteller and product management hiring advisor.",
    
    task: "Your task is to create a compelling ~400-word written response for the Perplexity Associate Product Manager (APM) program application.",
    
    requirements: [
      "Be around 400 words (±5%)",
      "Be written in a confident yet humble first-person tone",
      "Highlight the candidate's accomplishments and skills directly relevant to the Perplexity APM criteria",
      "Show curiosity, creativity, technical fluency, product thinking, and leadership",
      "Maintain clarity, strong structure, and engaging flow",
      "Avoid bullet points — use cohesive paragraphs",
      "Do NOT repeat the same point in different words",
      "Do NOT make up achievements not present in the provided data"
    ],
    
    apmCriteria: [
      "Exceptional talent from traditional or unconventional backgrounds",
      "Self-starter with high standards, work ethic, and creativity",
      "Insatiable curiosity and tinkerer's spirit",
      "Strong AI product user with technical understanding",
      "Excellent communication, problem definition, and planning skills",
      "Ability to collaborate effectively with top engineers and diverse teams",
      "Leadership with humility and enthusiasm"
    ],
    
    instructions: [
      "Focus more on candidate's strongest categories from scoring module",
      "Maintain a narrative that aligns naturally with Perplexity's mission and culture",
      "Conclude with a future-facing statement about contributing to Perplexity's AI products"
    ]
  }
};

/**
 * Generate essay prompt based on candidate data
 */
function generateEssayPrompt(scores, resumeContent = '') {
  // Identify strongest categories (top 3 scores)
  const categoryScores = [
    { name: 'Technical Fluency', score: scores.technicalFluency, key: 'technicalFluency' },
    { name: 'Product Thinking', score: scores.productThinking, key: 'productThinking' },
    { name: 'Curiosity & Creativity', score: scores.curiosityCreativity, key: 'curiosityCreativity' },
    { name: 'Communication Clarity', score: scores.communicationClarity, key: 'communicationClarity' },
    { name: 'Leadership & Teamwork', score: scores.leadershipTeamwork, key: 'leadershipTeamwork' }
  ];
  
  const strongestCategories = categoryScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(cat => `${cat.name} (${cat.score}/100)`)
    .join(', ');

  const prompt = `${essayConfig.prompt.systemRole}

${essayConfig.prompt.task}

The output must:
${essayConfig.prompt.requirements.map(req => `- ${req}`).join('\n')}

Perplexity APM Program Key Criteria:
${essayConfig.prompt.apmCriteria.map((criteria, index) => `${index + 1}. ${criteria}`).join('\n')}

Additional Notes:
${essayConfig.prompt.instructions.map(inst => `- ${inst}`).join('\n')}

Candidate Data:
- Overall APM Fit Score: ${scores.overall}/100
- Technical Fluency: ${scores.technicalFluency}/100
- Product Thinking: ${scores.productThinking}/100
- Curiosity & Creativity: ${scores.curiosityCreativity}/100
- Communication Clarity: ${scores.communicationClarity}/100
- Leadership & Teamwork: ${scores.leadershipTeamwork}/100

Strongest Categories: ${strongestCategories}

Resume Content: ${resumeContent || 'Resume content will be extracted and analyzed in production version'}

Generate a compelling, personalized essay based on this data.`;

  return prompt;
}

/**
 * Generate sophisticated mock essay based on scores and prompt
 */
function generateSophisticatedEssay(scores, resumeContent = '') {
  // Identify strongest categories for focus
  const categoryScores = [
    { name: 'technical fluency', score: scores.technicalFluency, key: 'technicalFluency' },
    { name: 'product thinking', score: scores.productThinking, key: 'productThinking' },
    { name: 'curiosity and creativity', score: scores.curiosityCreativity, key: 'curiosityCreativity' },
    { name: 'communication clarity', score: scores.communicationClarity, key: 'communicationClarity' },
    { name: 'leadership and teamwork', score: scores.leadershipTeamwork, key: 'leadershipTeamwork' }
  ];
  
  const strongest = categoryScores.sort((a, b) => b.score - a.score);
  const topCategory = strongest[0];
  const secondCategory = strongest[1];
  const thirdCategory = strongest[2];

  // Generate essay based on strongest categories
  let essay = '';
  
  // Opening paragraph - always strong
  essay += `As an aspiring ${essayConfig.company.position} at ${essayConfig.company.name}, I am driven by an insatiable curiosity about how AI can transform the way people discover and interact with information. My journey has been shaped by a unique blend of ${topCategory.name} and ${secondCategory.name}, positioning me to contribute meaningfully to ${essayConfig.company.name}'s mission of ${essayConfig.company.mission}.\n\n`;

  // Second paragraph - focus on strongest category
  if (topCategory.key === 'technicalFluency') {
    essay += `My technical foundation, reflected in my ${topCategory.score}/100 technical fluency score, enables me to bridge the gap between complex AI systems and user-centric product experiences. I have consistently demonstrated the ability to understand technical constraints while advocating for user needs, ensuring that innovative solutions remain accessible and intuitive. This technical grounding allows me to collaborate effectively with engineering teams and translate ambitious product visions into feasible implementations.\n\n`;
  } else if (topCategory.key === 'productThinking') {
    essay += `What distinguishes my approach is my product thinking capability, scoring ${topCategory.score}/100. I excel at identifying user pain points that others might overlook and translating them into compelling product opportunities. My methodology involves deep user research, competitive analysis, and data-driven hypothesis testing to build products that genuinely solve real problems. This systematic approach to product development has consistently led to solutions that resonate with users and drive meaningful engagement.\n\n`;
  } else if (topCategory.key === 'curiosityCreativity') {
    essay += `My curiosity and creativity, rated at ${topCategory.score}/100, fuel my passion for exploring unconventional solutions to complex problems. I am naturally drawn to the intersection of emerging technologies and user experience, constantly experimenting with new approaches to make sophisticated AI capabilities more accessible. This creative problem-solving mindset has led me to develop innovative solutions that challenge traditional assumptions about how users interact with information.\n\n`;
  } else if (topCategory.key === 'communicationClarity') {
    essay += `Communication has been one of my defining strengths, with a clarity score of ${topCategory.score}/100. I have developed the ability to distill complex technical concepts into clear, actionable insights for diverse stakeholders. Whether presenting to engineers, executives, or end users, I focus on creating shared understanding that drives alignment and accelerates decision-making. This skill has proven invaluable in cross-functional environments where clear communication is essential for success.\n\n`;
  } else {
    essay += `My leadership and teamwork abilities, scoring ${topCategory.score}/100, have been cultivated through collaborative projects where I have successfully coordinated diverse teams toward common goals. I believe in leading with humility and enthusiasm, creating environments where every team member feels empowered to contribute their best work. This collaborative approach has consistently resulted in stronger solutions and more cohesive team dynamics.\n\n`;
  }

  // Third paragraph - second strongest category
  if (secondCategory.key === 'technicalFluency') {
    essay += `My technical understanding, demonstrated by my ${secondCategory.score}/100 score in this area, allows me to engage meaningfully with engineering teams and understand the implications of technical decisions on user experience. I am comfortable navigating technical discussions while maintaining focus on user outcomes and business objectives.\n\n`;
  } else if (secondCategory.key === 'productThinking') {
    essay += `My product thinking skills, reflected in my ${secondCategory.score}/100 score, enable me to see beyond immediate features to understand broader user journeys and market opportunities. I approach product challenges with a systematic methodology that balances user needs, technical feasibility, and business impact.\n\n`;
  } else if (secondCategory.key === 'curiosityCreativity') {
    essay += `The creativity that earned me a ${secondCategory.score}/100 score drives me to explore innovative approaches to traditional problems. I am particularly excited about the potential for AI to create entirely new categories of user experiences that we haven't yet imagined.\n\n`;
  } else if (secondCategory.key === 'communicationClarity') {
    essay += `My communication skills, scoring ${secondCategory.score}/100, enable me to build bridges between technical and non-technical stakeholders. I excel at creating clarity in complex situations and ensuring that all team members are aligned on objectives and priorities.\n\n`;
  } else {
    essay += `The collaborative leadership that earned me a ${secondCategory.score}/100 score has taught me the importance of building consensus while maintaining momentum toward ambitious goals. I thrive in environments where diverse perspectives come together to solve challenging problems.\n\n`;
  }

  // Closing paragraph - future-focused
  essay += `Looking ahead, I am particularly excited about the opportunity to contribute to ${essayConfig.company.name}'s evolution as the definitive AI-powered answer engine. The intersection of conversational AI, real-time information retrieval, and user experience design represents exactly the kind of complex, impactful challenge that energizes me. I am eager to bring my unique perspective and collaborative approach to help ${essayConfig.company.name} continue pushing the boundaries of what's possible in AI-powered information discovery.`;

  return essay;
}

module.exports = {
  generateEssayPrompt,
  generateSophisticatedEssay,
  essayConfig
};
