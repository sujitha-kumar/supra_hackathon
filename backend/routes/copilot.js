import express from 'express';
import supabase from '../lib/supabase.js';
import { generate } from '../lib/gemini.js';

const router = express.Router();

const LANGS = ['english', 'hindi', 'tamil', 'telugu', 'kannada'];

router.post('/chat', async (req, res) => {
  const { clientId, question, language = 'english' } = req.body;

  if (!clientId || !question)
    return res.status(400).json({ error: 'clientId and question required' });

  const lang = LANGS.includes(language.toLowerCase()) ? language.toLowerCase() : 'english';

  const [{ data: client }, { data: portfolio }, { data: history }] = await Promise.all([
    supabase.from('clients').select('name,risk_profile,goals').eq('id', clientId).single(),
    supabase.from('portfolios').select('fund_name,category,invested_amount,current_value,sip_amount').eq('client_id', clientId),
    supabase.from('chat_history').select('question,answer').eq('client_id', clientId)
      .order('created_at', { ascending: false }).limit(5)
  ]);

  const portfolioText = (portfolio || []).map(p =>
    `${p.fund_name}(${p.category}): invested Rs.${p.invested_amount}, current Rs.${p.current_value}` +
    (p.sip_amount > 0 ? `, SIP Rs.${p.sip_amount}/mo` : '')).join('\n');

  const historyText = (history || []).reverse()
    .map(h => `RM: "${h.question}"\nCopilot: "${h.answer}"`).join('\n\n');

  const langInstr = lang === 'english' ? 'Respond in English.' :
    `Respond in ${lang.charAt(0).toUpperCase() + lang.slice(1)}. Use natural conversational tone.`;

  const prompt = `You are an expert RM advisor for FundsIndia.

CLIENT: ${client?.name} | Risk: ${client?.risk_profile} | Goals: ${JSON.stringify(client?.goals)}

PORTFOLIO:
${portfolioText}

${historyText ? 'RECENT CHAT:\n' + historyText : ''}

RM QUESTION: "${question}"

${langInstr}

Rules:
- Give a confident suggested response the RM can say to the client
- Be factual about the portfolio data
- If topic is sensitive (guaranteed returns, past performance promises), prepend [COMPLIANCE NOTE]
- Max 120 words. Start with empathy, give the answer, end with a next step.`;

  try {
    const answer = await generate(prompt);

    await supabase.from('chat_history').insert({
      client_id: clientId,
      question,
      answer,
      language: lang
    });

    res.json({ answer, language: lang, question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
