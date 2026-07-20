import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Star, Loader, X, Edit2, ArrowUp, ArrowDown } from 'lucide-react';

type Package = { id?: string; name: string; description: string; price: number; original_price: number | null; contents: string[]; badge: string | null; is_featured: boolean; sort_order: number };
type Skin = { id?: string; name: string; hero_name: string; description: string; price: number; rarity: string; image_url: string | null; is_featured: boolean; sort_order: number };
type Consultation = { id?: string; service_name: string; description: string; price: number; duration_minutes: number; category: string; is_featured: boolean; sort_order: number };

type Tab = 'packages' | 'skins' | 'consultations';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('packages');
  const [packages, setPackages] = useState<Package[]>([]);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: p }, { data: s }, { data: c }] = await Promise.all([
      supabase.from('packages').select('*').order('sort_order'),
      supabase.from('skins').select('*').order('sort_order'),
      supabase.from('consultations').select('*').order('sort_order'),
    ]);
    if (p) setPackages(p as Package[]);
    if (s) setSkins(s as Skin[]);
    if (c) setConsultations(c as Consultation[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const savePackage = async (pkg: Package) => {
    if (pkg.id) {
      await supabase.from('packages').update(pkg).eq('id', pkg.id);
    } else {
      await supabase.from('packages').insert({ ...pkg, contents: pkg.contents || [] });
    }
    setEditing(null); load();
  };

  const saveSkin = async (skin: Skin) => {
    if (skin.id) {
      await supabase.from('skins').update(skin).eq('id', skin.id);
    } else {
      await supabase.from('skins').insert(skin);
    }
    setEditing(null); load();
  };

  const saveConsultation = async (con: Consultation) => {
    if (con.id) {
      await supabase.from('consultations').update(con).eq('id', con.id);
    } else {
      await supabase.from('consultations').insert(con);
    }
    setEditing(null); load();
  };

  const deleteItem = async (tab: Tab, id: string) => {
    await supabase.from(tab).delete().eq('id', id);
    load();
  };

  const toggleFeatured = async (tab: Tab, item: any) => {
    await supabase.from(tab).update({ is_featured: !item.is_featured }).eq('id', item.id);
    load();
  };

  const moveItem = async (tab: Tab, item: any, dir: 'up' | 'down', all: any[]) => {
    const idx = all.findIndex((i: any) => i.id === item.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= all.length) return;
    const other = all[swapIdx];
    await Promise.all([
      supabase.from(tab).update({ sort_order: other.sort_order }).eq('id', item.id),
      supabase.from(tab).update({ sort_order: item.sort_order }).eq('id', other.id),
    ]);
    load();
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'packages', label: 'Packages', count: packages.length },
    { key: 'skins', label: 'Skins', count: skins.length },
    { key: 'consultations', label: 'Consultations', count: consultations.length },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Loader className="w-8 h-8 text-crimson-500 animate-spin" /></div>;

  return (
    <div className="pt-20 pb-24 min-h-screen">
      <div className="container-game">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 mt-4">
          <div>
            <h1 className="heading-display text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your store items</p>
          </div>
          <button onClick={() => {
            if (tab === 'packages') setEditing({ name: '', description: '', price: 0, original_price: null, contents: [], badge: null, is_featured: false, sort_order: packages.length });
            else if (tab === 'skins') setEditing({ name: '', hero_name: '', description: '', price: 0, rarity: 'Common', image_url: null, is_featured: false, sort_order: skins.length });
            else setEditing({ service_name: '', description: '', price: 0, duration_minutes: 60, category: 'Strategy', is_featured: false, sort_order: consultations.length });
          }} className="btn-primary text-sm py-2.5"><Plus className="w-4 h-4" /> Add New</button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-night-700">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${tab === t.key ? 'border-crimson-500 text-gold-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
              {t.label} <span className="text-xs text-gray-600">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tab === 'packages' && packages.map((item, _i, arr) => (
            <ItemRow key={item.id}
              onEdit={() => setEditing({ ...item })}
              onDelete={() => deleteItem('packages', item.id!)}
              onToggle={() => toggleFeatured('packages', item)}
              onMove={(d) => moveItem('packages', item, d, arr)}
              title={item.name} subtitle={item.description} price={item.price} featured={item.is_featured}
            />
          ))}
          {tab === 'skins' && skins.map((item, _i, arr) => (
            <ItemRow key={item.id}
              onEdit={() => setEditing({ ...item })}
              onDelete={() => deleteItem('skins', item.id!)}
              onToggle={() => toggleFeatured('skins', item)}
              onMove={(d) => moveItem('skins', item, d, arr)}
              title={item.name} subtitle={`${item.hero_name} — ${item.rarity}`} price={item.price} featured={item.is_featured}
            />
          ))}
          {tab === 'consultations' && consultations.map((item, _i, arr) => (
            <ItemRow key={item.id}
              onEdit={() => setEditing({ ...item })}
              onDelete={() => deleteItem('consultations', item.id!)}
              onToggle={() => toggleFeatured('consultations', item)}
              onMove={(d) => moveItem('consultations', item, d, arr)}
              title={item.service_name} subtitle={`${item.category} — ${item.duration_minutes} min`} price={item.price} featured={item.is_featured}
            />
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setEditing(null)}>
          <div className="card-game max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="heading-display text-xl font-bold text-white">{editing.id ? 'Edit' : 'Add'} {tab.slice(0, -1)}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X /></button>
            </div>
            {tab === 'packages' && <PackageForm item={editing} onSave={savePackage} />}
            {tab === 'skins' && <SkinForm item={editing} onSave={saveSkin} />}
            {tab === 'consultations' && <ConsultationForm item={editing} onSave={saveConsultation} />}
          </div>
        </div>
      )}
    </div>
  );
}

function ItemRow({ title, subtitle, price, featured, onEdit, onDelete, onToggle, onMove }: {
  title: string; subtitle: string; price: number; featured: boolean;
  onEdit: () => void; onDelete: () => void; onToggle: () => void; onMove: (d: 'up' | 'down') => void;
}) {
  return (
    <div className="card-game p-4 flex items-center gap-4">
      <div className="flex flex-col gap-1">
        <button onClick={() => onMove('up')} className="text-gray-500 hover:text-gold-300 transition-colors"><ArrowUp className="w-4 h-4" /></button>
        <button onClick={() => onMove('down')} className="text-gray-500 hover:text-gold-300 transition-colors"><ArrowDown className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-white truncate">{title}</h4>
          {featured && <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400 flex-shrink-0" />}
        </div>
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
      </div>
      <span className="heading-display text-lg font-bold text-gold-300 hidden sm:block">${price}</span>
      <div className="flex items-center gap-2">
        <button onClick={onToggle} className={`p-2 rounded-lg transition-colors ${featured ? 'text-gold-300 bg-gold-500/10' : 'text-gray-500 hover:text-gold-300 hover:bg-gold-500/10'}`}><Star className={`w-4 h-4 ${featured ? 'fill-gold-400' : ''}`} /></button>
        <button onClick={onEdit} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-night-700 transition-colors"><Edit2 className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function PackageForm({ item, onSave }: { item: Package; onSave: (p: Package) => void }) {
  const [form, setForm] = useState<Package>(item);
  const [contentsStr, setContentsStr] = useState((item.contents || []).join(', '));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, contents: contentsStr.split(',').map(s => s.trim()).filter(Boolean) }); }} className="space-y-4">
      <div><label className="label-game">Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-game" /></div>
      <div><label className="label-game">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-game min-h-[60px] resize-none" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label-game">Price ($)</label><input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="input-game" /></div>
        <div><label className="label-game">Original Price ($)</label><input type="number" step="0.01" value={form.original_price || ''} onChange={e => setForm({ ...form, original_price: e.target.value ? parseFloat(e.target.value) : null })} className="input-game" /></div>
      </div>
      <div><label className="label-game">Contents (comma-separated)</label><input value={contentsStr} onChange={e => setContentsStr(e.target.value)} className="input-game" placeholder="1,000 Gold, 5,000 Food" /></div>
      <div><label className="label-game">Badge (optional)</label><input value={form.badge || ''} onChange={e => setForm({ ...form, badge: e.target.value || null })} className="input-game" placeholder="Best Value" /></div>
      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" /> <span className="text-sm text-gray-300">Featured</span></label>
      <button type="submit" className="btn-primary w-full">Save Package</button>
    </form>
  );
}

function SkinForm({ item, onSave }: { item: Skin; onSave: (s: Skin) => void }) {
  const [form, setForm] = useState<Skin>(item);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div><label className="label-game">Skin Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-game" /></div>
      <div><label className="label-game">Hero Name</label><input value={form.hero_name} onChange={e => setForm({ ...form, hero_name: e.target.value })} className="input-game" /></div>
      <div><label className="label-game">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-game min-h-[60px] resize-none" /></div>
      <div><label className="label-game">Image URL (optional)</label><input value={form.image_url || ''} onChange={e => setForm({ ...form, image_url: e.target.value || null })} className="input-game" placeholder="/image.png (defaults to /image.png)" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label-game">Price ($)</label><input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="input-game" /></div>
        <div><label className="label-game">Rarity</label>
          <select value={form.rarity} onChange={e => setForm({ ...form, rarity: e.target.value })} className="input-game">
            <option>Common</option><option>Rare</option><option>Epic</option><option>Legendary</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" /> <span className="text-sm text-gray-300">Featured</span></label>
      <button type="submit" className="btn-primary w-full">Save Skin</button>
    </form>
  );
}

function ConsultationForm({ item, onSave }: { item: Consultation; onSave: (c: Consultation) => void }) {
  const [form, setForm] = useState<Consultation>(item);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div><label className="label-game">Service Name</label><input required value={form.service_name} onChange={e => setForm({ ...form, service_name: e.target.value })} className="input-game" /></div>
      <div><label className="label-game">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-game min-h-[60px] resize-none" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label-game">Price ($)</label><input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="input-game" /></div>
        <div><label className="label-game">Duration (min)</label><input required type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) })} className="input-game" /></div>
      </div>
      <div><label className="label-game">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-game" /></div>
      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" /> <span className="text-sm text-gray-300">Featured</span></label>
      <button type="submit" className="btn-primary w-full">Save Consultation</button>
    </form>
  );
}
