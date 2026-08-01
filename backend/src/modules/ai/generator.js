const { OpenAI } = require('openai');

// Initialize OpenAI client. 
// Requires OPENAI_API_KEY environment variable to be set.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates Kubernetes YAML manifests based on a natural language prompt.
 * 
 * @param {string} prompt - The natural language description of the desired deployment (e.g., "Deploy an nginx web server with a load balancer on port 80")
 * @param {Array<string>} resourceTypes - The types of resources to generate (e.g., ['Deployment', 'Service', 'Ingress', 'ConfigMap', 'Secrets'])
 * @returns {Promise<string>} - The generated YAML as a string
 */
async function generateK8sYaml(prompt, resourceTypes = ['Deployment', 'Service']) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const systemMessage = `
You are an expert Kubernetes AI assistant. 
Your task is to generate valid Kubernetes YAML manifests based on the user's prompt.
You should generate the following resource types if applicable to the prompt: ${resourceTypes.join(', ')}.
Output ONLY the raw YAML. Do not include markdown formatting like \`\`\`yaml.
Separate multiple resources with '---'.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Defaulting to 3.5 turbo for cost efficiency, can be configurable
      messages: [
        { role: 'system', content: systemMessage.trim() },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1, // Low temperature for deterministic, reliable infrastructure code
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating Kubernetes YAML:', error);
    throw new Error('Failed to generate Kubernetes YAML');
  }
}

module.exports = {
  generateK8sYaml
};
