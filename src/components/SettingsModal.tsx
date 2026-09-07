import { FormEvent, ReactNode, useState } from 'react';
import { BriefcaseBusiness, Building2, Clock3, MapPin, Phone, Plus, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import { BusinessService, BusinessSettings } from '../utils/aiContext';

interface SettingsModalProps {
  settings: BusinessSettings;
  onClose: () => void;
  onSave: (settings: BusinessSettings) => void;
}

export function SettingsModal({ settings, onClose, onSave }: SettingsModalProps) {
  const [draft, setDraft] = useState<BusinessSettings>(settings);

  const updateField = (field: keyof BusinessSettings, value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const updateService = (index: number, field: keyof BusinessService, value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      services: currentDraft.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service,
      ),
    }));
  };

  const addService = () => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      services: [...currentDraft.services, { name: '', description: '', price: '' }],
    }));
  };

  const removeService = (index: number) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      services: currentDraft.services.filter((_, serviceIndex) => serviceIndex !== index),
    }));
  };

  const submitSettings = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      ...draft,
      services: draft.services.filter((service) => service.name.trim()),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#06101dcc] p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-[#1a3152] bg-[#fffdf8] shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#d9d1c4] bg-[#fffdf8]/95 px-5 py-5 backdrop-blur sm:px-7">
          <div>
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#008f7d]">Business control center</p>
            <h2 id="settings-title" className="text-xl font-extrabold text-[#0a1628]">Podešavanja poslovanja</h2>
            <p className="mt-1 max-w-xl text-sm text-[#69778a]">Ovi podaci oblikuju odgovore AssistantBota i ostaju sačuvani samo u ovom browseru.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Zatvori podešavanja" className="rounded-lg p-2 text-[#69778a] transition hover:bg-[#f5f0e8] hover:text-[#0a1628]"><X size={20} /></button>
        </div>

        <form onSubmit={submitSettings} className="space-y-7 px-5 py-6 sm:px-7">
          <section>
            <div className="mb-4 flex items-center gap-2 text-[#0a1628]"><Building2 size={18} className="text-[#008f7d]" /><h3 className="font-bold">Osnovni podaci</h3></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Naziv poslovanja" value={draft.businessName} onChange={(value) => updateField('businessName', value)} placeholder="npr. Studio Mimoza" />
              <Field label="Industrija" value={draft.industry} onChange={(value) => updateField('industry', value)} placeholder="npr. Računovodstvo" />
              <Field label="Kontakt telefon" value={draft.contactPhone} onChange={(value) => updateField('contactPhone', value)} placeholder="+387 32 000 000" icon={<Phone size={15} />} />
              <Field label="Adresa" value={draft.address} onChange={(value) => updateField('address', value)} placeholder="Ulica i grad" icon={<MapPin size={15} />} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2 text-[#0a1628]"><Clock3 size={18} className="text-[#008f7d]" /><h3 className="font-bold">Radno vrijeme</h3></div>
            <textarea value={draft.workingHours} onChange={(event) => updateField('workingHours', event.target.value)} rows={2} placeholder="Pon-Pet: 08:00 - 16:00" className="w-full resize-y rounded-xl border border-[#c9a84c]/70 bg-white px-3 py-3 text-sm text-[#263449] outline-none transition focus:border-[#00aF98] focus:ring-4 focus:ring-[#dcefe9]" />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#0a1628]"><BriefcaseBusiness size={18} className="text-[#008f7d]" /><h3 className="font-bold">Usluge i cijene</h3></div>
              <button type="button" onClick={addService} className="flex items-center gap-1.5 rounded-lg bg-[#dcefe9] px-3 py-2 text-xs font-bold text-[#007d70] transition hover:bg-[#bfe5dc]"><Plus size={15} /> Dodaj uslugu</button>
            </div>
            <div className="space-y-3">
              {draft.services.map((service, index) => (
                <div key={`${index}-${service.name}`} className="grid gap-3 rounded-xl border border-[#d9d1c4] bg-[#f8f5ef] p-3 sm:grid-cols-[1fr_1.5fr_0.8fr_auto] sm:items-end">
                  <Field label="Naziv" value={service.name} onChange={(value) => updateService(index, 'name', value)} placeholder="Usluga" />
                  <Field label="Opis" value={service.description} onChange={(value) => updateService(index, 'description', value)} placeholder="Kratak opis" />
                  <Field label="Cijena" value={service.price} onChange={(value) => updateService(index, 'price', value)} placeholder="100 KM" />
                  <button type="button" onClick={() => removeService(index)} aria-label={`Obriši uslugu ${service.name || index + 1}`} className="flex h-10 items-center justify-center rounded-lg px-3 text-[#b4495c] transition hover:bg-[#ffe7eb]"><Trash2 size={17} /></button>
                </div>
              ))}
              {!draft.services.length && <p className="rounded-xl border border-dashed border-[#c9a84c] bg-[#f8f1df] px-4 py-4 text-sm text-[#66501f]">Dodajte usluge i cijene koje AssistantBot smije koristiti u odgovorima.</p>}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2 text-[#0a1628]"><ShieldCheck size={18} className="text-[#008f7d]" /><h3 className="font-bold">Poruke i pravila</h3></div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[#263449]">Prilagođeni pozdrav<textarea value={draft.customGreeting} onChange={(event) => updateField('customGreeting', event.target.value)} rows={2} className="mt-1.5 w-full resize-y rounded-xl border border-[#d9d1c4] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#00aF98] focus:ring-4 focus:ring-[#dcefe9]" /></label>
              <label className="block text-sm font-bold text-[#263449]">Lokalna pravila usklađenosti<textarea value={draft.legalRules} onChange={(event) => updateField('legalRules', event.target.value)} rows={3} className="mt-1.5 w-full resize-y rounded-xl border border-[#d9d1c4] bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#00aF98] focus:ring-4 focus:ring-[#dcefe9]" /></label>
            </div>
          </section>

          <section className="rounded-xl border border-[#1a3152] bg-[#0f2038] p-4 text-[#f5f0e8]">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#e5c365]">Tri-party ecosystem</p>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <Role title="B&H Assistant" text="Proizvod, AI infrastruktura i tehničko održavanje." />
              <Role title="Vlasnik poslovanja" text="Unosi podatke, cijene i aktivna pravila." />
              <Role title="Korisnik / klijent" text="Postavlja pitanja i dobija provjerene odgovore." />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-[#d9d1c4] pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-3 text-sm font-bold text-[#69778a] transition hover:bg-[#f5f0e8]">Odustani</button>
            <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-[#0088ff] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#0088ff]/20 transition hover:bg-[#0074db]"><Save size={17} /> Sačuvaj podešavanja</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, icon }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; icon?: ReactNode }) {
  return <label className="block text-sm font-bold text-[#263449]">{label}<span className="relative mt-1.5 block">{icon && <span className="pointer-events-none absolute left-3 top-3 text-[#8994a3]">{icon}</span>}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`w-full rounded-xl border border-[#d9d1c4] bg-white px-3 py-2.5 text-sm font-normal text-[#263449] outline-none transition focus:border-[#00aF98] focus:ring-4 focus:ring-[#dcefe9] ${icon ? 'pl-9' : ''}`} /></span></label>;
}

function Role({ title, text }: { title: string; text: string }) {
  return <div><p className="font-bold text-[#7de6d2]">{title}</p><p className="mt-1 leading-5 text-[#a0aec0]">{text}</p></div>;
}
