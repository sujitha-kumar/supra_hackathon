import express from 'express';
import supabase from '../lib/supabase.js';
import { formatINR, returnPct } from '../lib/format.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data: clients, error } = await supabase.from('clients').select('*').order('name');
    if (error) throw error;

    const enriched = await Promise.all(clients.map(async (client) => {
      const { data: portfolio } = await supabase.from('portfolios')
        .select('invested_amount,current_value').eq('client_id', client.id);

      const totalInvested = (portfolio || []).reduce((s, p) => s + Number(p.invested_amount), 0);
      const totalCurrent = (portfolio || []).reduce((s, p) => s + Number(p.current_value), 0);

      const daysSince = client.last_contacted
        ? Math.floor((Date.now() - new Date(client.last_contacted).getTime()) / (86400000)) : null;

      return {
        ...client,
        total_invested_fmt: formatINR(totalInvested),
        total_current_fmt: formatINR(totalCurrent),
        return_pct: returnPct(totalInvested, totalCurrent),
        days_since_contact: daysSince,
        needs_attention: daysSince > 30
      };
    }));

    const { data: allSips } = await supabase.from('portfolios')
      .select('sip_amount,sip_date').not('sip_date', 'is', null).gt('sip_amount', 0);

    const today = new Date().getDate();
    const stats = {
      total_clients: enriched.length,
      need_attention: enriched.filter(c => c.needs_attention).length,
      sips_this_week: (allSips || []).filter(s => s.sip_date >= today && s.sip_date <= today + 7).length
    };

    res.json({ stats, clients: enriched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  const { data, error } = await supabase.from('clients')
    .select('id,name,phone,risk_profile').ilike('name', `%${req.query.q || ''}%`).limit(10);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  try {
    const { data: client } = await supabase.from('clients').select('*').eq('id', req.params.id).single();
    const { data: portfolio } = await supabase.from('portfolios').select('*').eq('client_id', req.params.id);
    const { data: activities } = await supabase.from('activities').select('*')
      .eq('client_id', req.params.id).order('created_at', { ascending: false }).limit(10);

    const totalInvested = (portfolio || []).reduce((s, p) => s + Number(p.invested_amount), 0);
    const totalCurrent = (portfolio || []).reduce((s, p) => s + Number(p.current_value), 0);

    res.json({
      client,
      portfolio,
      activities,
      summary: {
        total_invested_fmt: formatINR(totalInvested),
        total_current_fmt: formatINR(totalCurrent),
        total_return_pct: returnPct(totalInvested, totalCurrent),
        fund_count: (portfolio || []).length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
