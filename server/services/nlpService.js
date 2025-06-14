import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const NLPService = {
  async extractTopicsFromText(text) {
    try {
      const prompt = `
Analyze the following syllabus or study material and extract the main topics and subtopics.
Return the response as a JSON object with a "topics" key containing an array. Each item should include:
- topic_name: string (the main topic)
- subtopics: array of strings (subtopics under this main topic)
- estimated_hours: number (estimated hours needed to study this topic)
- complexity: number (1-5, where 1 is easiest and 5 is hardest)

Syllabus content:
${text}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that extracts study topics from syllabi and estimates their complexity and time requirements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse JSON from OpenAI response:', content);
        throw new Error('Invalid JSON response from AI');
      }

      if (!Array.isArray(parsed.topics)) {
        console.error('Parsed object does not contain a topics array:', parsed);
        throw new Error('No topics array found in AI response');
      }

      return parsed.topics.map(topic => ({
        ...topic,
        estimated_hours: parseFloat(topic.estimated_hours),
      }));
    } catch (err) {
      console.error('Error in NLP processing:', err.message);
      throw new Error('Failed to process syllabus with AI');
    }
  },
};

export default NLPService;
