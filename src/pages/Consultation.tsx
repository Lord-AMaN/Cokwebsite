import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Brain, Clock, X, Check, Loader } from 'lucide-react';

type Consultation = {
  id: string; service_name: string; description: string;
  price: number; duration_minutes: number; category: string; is_featured: boolean;
};

export default function Consultation() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Consultation | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('consultations').select('*').order('sort_order');
      if (data) setItems(data as Consultation[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Loader className="w-8 h-8 text-crimson-500 animate-spin" /></div>;

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="text-center mb-16 mt-8">
          <span className="text-sm font-semibold text-crimson-400 tracking-wider uppercase">Pro Services</span>
          <h1 className="heading-display text-4xl md:text-6xl font-bold text-white mt-2 mb-4">Strategy Consultations</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Learn from the best. Book a 1-on-1 session with top-tier Clash of Kings players.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((con) => (
            <div key={con.id} className={`card-game p-6 flex flex-col ${con.is_featured ? 'border-crimson-700/50' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-crimson-900/20 border border-crimson-700/30 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gold-400" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-crimson-900/15 border border-crimson-700/30 text-crimson-300">{con.category}</span>
              </div>
              <h3 className="heading-display text-lg font-bold text-white mb-2">{con.service_name}</h3>
              <p className="text-sm text-gray-400 mb-4 flex-1">{con.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4" /> {con.duration_minutes} minutes
              </div>
              <div className="flex items-center justify-between">
                <span className="heading-display text-2xl font-bold text-gold-300">${con.price}</span>
                <button onClick={() => setSelected(con)} className="btn-primary text-sm py-2.5 px-5">Book Session</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="card-game max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
            <h3 className="heading-display text-2xl font-bold text-white mb-2">{selected.service_name}</h3>
            <p className="text-gray-400 text-sm mb-6">{selected.description}</p>
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="flex items-center gap-1.5 text-gray-400"><Clock className="w-4 h-4" /> {selected.duration_minutes} min</span>
              <span className="text-gold-300 font-bold text-lg">${selected.price}</span>
            </div>
            <BookingForm consultation={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

function BookingForm({ consultation, onClose }: { consultation: Consultation; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', notes: '' });

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-crimson-900/20 border border-crimson-700/40 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-gold-400" />
        </div>
        <h4 className="heading-display text-xl font-bold text-white mb-2">Booking Confirmed!</h4>
        <p className="text-sm text-gray-400 mb-6">We'll send a confirmation email with your session details shortly.</p>
        <button onClick={onClose} className="btn-primary w-full">Close</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
      <div>
        <label className="label-game">Your Name</label>
        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-game" placeholder="Lord Commander" />
      </div>
      <div>
        <label className="label-game">Email</label>
        <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-game" placeholder="you@example.com" />
      </div>
      <div>
        <label className="label-game">Preferred Date</label>
        <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-game" />
      </div>
      <div>
        <label className="label-game">Notes (optional)</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-game min-h-[80px] resize-none" placeholder="What do you want to focus on?" />
      </div>
      <button type="submit" className="btn-primary w-full">Confirm Booking — ${consultation.price}</button>
    </form>
  );
}
