interface ClassificationResult {
  category: string;
  priority: 'Low' | 'Medium' | 'High';
}

export async function classifyLead(requirement: string): Promise<ClassificationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `You are an expert lead generation classifier. Analyze the following user requirement and classify it into a business category (e.g. "AI Automation", "Web Development", "Mobile App", "UI/UX Design", "Marketing", "Consulting", "General Inquiry") and assign a priority level ("Low", "Medium", "High").
              
              Respond ONLY with a JSON object. No markdown, no triple backticks, just raw JSON.
              Example Response:
              {"category": "AI Automation", "priority": "High"}
              
              User Requirement: "${requirement}"`
            }
          ],
          response_format: { type: 'json_object' }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const parsed = JSON.parse(text.trim());
          if (parsed.category && (parsed.priority === 'Low' || parsed.priority === 'Medium' || parsed.priority === 'High')) {
            return {
              category: parsed.category,
              priority: parsed.priority
            };
          }
        }
      } else {
        console.error('OpenAI API returned non-OK status:', response.status, await response.text());
      }
    } catch (e) {
      console.error('OpenAI API classification failed, falling back to rule-based classifier:', e);
    }
  }

  // Fallback Rule-based Classifier (Matches keywords)
  const reqLower = requirement.toLowerCase();

  // 1. AI Automation
  if (
    reqLower.includes('chatbot') ||
    reqLower.includes('ai') ||
    reqLower.includes('gpt') ||
    reqLower.includes('llm') ||
    reqLower.includes('bot') ||
    reqLower.includes('machine learning') ||
    reqLower.includes('automation') ||
    reqLower.includes('openai') ||
    reqLower.includes('agent') ||
    reqLower.includes('model')
  ) {
    return { category: 'AI Automation', priority: 'High' };
  }

  // 2. Web Development
  if (
    reqLower.includes('website') ||
    reqLower.includes('web') ||
    reqLower.includes('nextjs') ||
    reqLower.includes('react') ||
    reqLower.includes('frontend') ||
    reqLower.includes('backend') ||
    reqLower.includes('fullstack') ||
    reqLower.includes('html') ||
    reqLower.includes('portal') ||
    reqLower.includes('e-commerce') ||
    reqLower.includes('shopify')
  ) {
    return { category: 'Web Development', priority: 'Medium' };
  }

  // 3. Mobile App Development
  if (
    reqLower.includes('app') ||
    reqLower.includes('ios') ||
    reqLower.includes('android') ||
    reqLower.includes('mobile') ||
    reqLower.includes('flutter') ||
    reqLower.includes('react native') ||
    reqLower.includes('phone')
  ) {
    return { category: 'Mobile App', priority: 'High' };
  }

  // 4. UI/UX Design
  if (
    reqLower.includes('design') ||
    reqLower.includes('ui') ||
    reqLower.includes('ux') ||
    reqLower.includes('figma') ||
    reqLower.includes('logo') ||
    reqLower.includes('redesign') ||
    reqLower.includes('wireframe')
  ) {
    return { category: 'UI/UX Design', priority: 'Low' };
  }

  // 5. Consulting / Strategy
  if (
    reqLower.includes('consult') ||
    reqLower.includes('strategy') ||
    reqLower.includes('advice') ||
    reqLower.includes('audit') ||
    reqLower.includes('seo') ||
    reqLower.includes('marketing')
  ) {
    return { category: 'Consulting', priority: 'Medium' };
  }

  // Default Fallback
  return { category: 'General Inquiry', priority: 'Low' };
}
