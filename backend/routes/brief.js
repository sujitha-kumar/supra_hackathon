import express from 'express';
import supabase from '../lib/supabase.js';
import { generate } from '../lib/gemini.js';
import { formatINR, returnPct } from '../lib/format.js';

const router = express.Router();

router.post('/:clientId', async (req, res) => {
  const { clientId } = req.params;
  try {
    const [{ data: client }, { data: portfolio }, { data: activities }] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('portfolios').select('*').eq('client_id', clientId),
      supabase.from('activities').select('*').eq('client_id', clientId)
        .order('created_at', { ascending: false }).limit(5)
    ]);

    if (!client) return res.status(404).json({ error: 'Client not found' });

    const totalInvested = (portfolio || []).reduce((s, p) => s + Number(p.invested_amount), 0);
    const totalCurrent = (portfolio || []).reduce((s, p) => s + Number(p.current_value), 0);
    const overallReturn = returnPct(totalInvested, totalCurrent);
    const sipFunds = (portfolio || []).filter(p => p.sip_amount > 0);

    const daysSince = client.last_contacted
      ? Math.floor((Date.now() - new Date(client.last_contacted).getTime()) / 86400000) : 'unknown';

    const prompt = `You are an expert RM advisor for FundsIndia mutual fund platform.
Generate a structured pre-call brief. Respond with ONLY raw JSON — no markdown fences.

CLIENT: ${client.name} | Risk: ${client.risk_profile} | Goals: ${JSON.stringify(client.goals)}
Last contacted: ${daysSince} days ago

PORTFOLIO (Total invested: ${formatINR(totalInvested)}, Current: ${formatINR(totalCurrent)}, Return: ${overallReturn}%):
${(portfolio || []).map(p => `- ${p.fund_name} (${p.category}): invested ${formatINR(p.invested_amount)}, current ${formatINR(p.current_value)}, return ${returnPct(p.invested_amount, p.current_value)}%${p.sip_amount > 0 ? `, SIP ${formatINR(p.sip_amount)}/mo` : ''}`).join('\n')}

RECENT ACTIVITY:
${(activities || []).map(a => `- [${a.type}] ${a.description}`).join('\n') || 'None'}

Return this exact JSON structure:
{
  "snapshot": "2-3 sentence summary of client portfolio health",
  "concerns": [{ "label": "short title", "severity": "high|medium|low", "detail": "one line" }],
  "talking_points": ["specific actionable point 1", "point 2", "point 3"],
  "opportunities": ["upsell/cross-sell opportunity"],
  "suggested_opening": "Warm personal opening line using client first name"
}

Rules: concerns 2-4 items, high only if negative return or >60 days no contact, talking_points exactly 3-4.`;

    const rawText = await generate(prompt);
    const clean = rawText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    const brief = JSON.parse(clean);

    await supabase.from('activities').insert({
      client_id: clientId,
      type: 'brief_generated',
      description: 'RM generated AI pre-call brief'
    });

    res.json({
      client: {
        id: client.id,
        name: client.name,
        phone: client.phone,
        risk_profile: client.risk_profile,
        goals: client.goals,
        days_since_contact: daysSince
      },
      summary: {
        total_invested_fmt: formatINR(totalInvested),
        total_current_fmt: formatINR(totalCurrent),
        return_pct: overallReturn,
        fund_count: (portfolio || []).length,
        sip_count: sipFunds.length
      },
      brief
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
