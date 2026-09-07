import { FormEvent, useEffect, useRef, useState } from 'react';
import { Check, CircleHelp, Heart, Paperclip, Send, User } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'bot' | 'user';
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: 'Pozdrav! Kako vam mogu pomoći danas?',
    sender: 'bot',
    time: 'Upravo sada',
  },
  {
    id: 2,
    content: 'Mogu vam pomoći da saznate više o našim uslugama, kao što su BH Konver i Papir Finder.',
    sender: 'bot',
    time: 'Upravo sada',
  },
];

const suggestions = ['Šta je BH Konver?', 'Kako radi Papir Finder?', 'Želim kontaktirati tim'];

function GummiAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  };

  return (
    <div className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f0e8] ring-2 ring-[#c9a84c] ring-offset-2 ring-offset-[#0a1628]`}>
      <img
        src="/images/AssistantBot.png"
        alt="Gummi, AssistantBot pomoćnik"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep the latest conversation visible whenever a message is added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const messageId = Date.now();
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: messageId, content: trimmedInput, sender: 'user', time: 'Upravo sada' },
    ]);
    setInput('');

    // Provide a clear next step until the assistant is connected to its live API.
    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: messageId + 1,
          content: 'Hvala na poruci! Naš tim će vam uskoro pomoći. Možete me pitati o BH Konveru, Papir Finderu ili našim drugim uslugama.',
          sender: 'bot',
          time: 'Upravo sada',
        },
      ]);
    }, 650);
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-[#f5f0e8] text-[#0a1628]">
      {/* Header: a compact, credible brand bar based on B&H Assistant's navy system. */}
      <header className="z-10 border-b border-[#1a3152] bg-[#0a1628] px-4 py-3 text-[#f5f0e8] shadow-[0_2px_18px_rgba(8,17,32,0.16)] sm:px-8">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <GummiAvatar size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight">AssistantBot</h1>
                <span className="hidden h-1 w-1 rounded-full bg-[#00c9a7] sm:block" />
                <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#a0aec0] sm:block">B&amp;H Assistant</span>
              </div>
              <p className="text-xs text-[#a0aec0]">Digitalni asistent za građane i poslovanje</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#24506a] bg-[#0f2038] px-3 py-1.5 text-xs font-bold text-[#7de6d2]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Tu sam
          </div>
        </div>
      </header>

      {/* Chat area: generous spacing and a calm cream canvas keep the conversation focused. */}
      <section className="min-h-0 flex-1 overflow-y-auto bg-[#f5f0e8] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          <div className="relative mb-2 overflow-hidden rounded-2xl border border-[#1a3152] bg-[#0f2038] px-5 py-6 text-[#f5f0e8] shadow-[0_12px_35px_rgba(8,17,32,0.16)] sm:px-8">
            <div className="absolute right-0 top-0 h-full w-1 bg-[#00c9a7]" />
            <div className="relative flex items-center gap-4">
              <GummiAvatar size="lg" />
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded-sm bg-[#00c9a7] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#06151d]">Digitalni asistent</span>
                  <span className="rounded-sm border border-[#c9a84c]/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#e5c365]">Bosna i Hercegovina</span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">AssistantBot - Vaš pametni digitalni vodič</h2>
                <p className="mt-1 text-sm leading-5 text-[#a0aec0]">Brz i jasan pristup informacijama o B&amp;H Assistant ekosistemu.</p>
              </div>
            </div>
          </div>

          {messages.map((message) => {
            const isUserMessage = message.sender === 'user';
            return (
              <div key={message.id} className={`flex items-end gap-3 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                {!isUserMessage && (
                  <GummiAvatar size="sm" />
                )}
                <div className={`max-w-[85%] sm:max-w-[70%] ${isUserMessage ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-sm ${isUserMessage ? 'rounded-br-md bg-[#00aF98] font-medium text-white shadow-[#008f7d]/20' : 'rounded-bl-md border border-[#d9d1c4] border-l-4 border-l-[#c9a84c] bg-[#fffdf8] text-[#263449]'}`}>
                    {message.content}
                  </div>
                  <div className={`mt-1.5 flex items-center gap-1.5 px-1 text-[11px] text-slate-400 ${isUserMessage ? 'justify-end' : ''}`}>
                    {message.time}
                    {isUserMessage && <Check size={13} className="text-blue-500" />}
                  </div>
                </div>
                {isUserMessage && (
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcefe9] text-[#007d70] sm:flex">
                    <User size={17} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Composer: suggestions and a large, keyboard-friendly pill input. */}
      <footer className="border-t border-[#d9d1c4] bg-[#fffdf8] px-4 pb-4 pt-3 shadow-[0_-4px_20px_rgba(8,17,32,0.08)] sm:px-8 sm:pb-5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => useSuggestion(suggestion)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#c9a84c]/60 bg-[#f8f1df] px-3 py-2 text-xs font-bold text-[#66501f] transition hover:border-[#00c9a7] hover:bg-[#dcefe9] hover:text-[#007d70]"
              >
                <CircleHelp size={14} />
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex items-center gap-2 rounded-xl border border-[#c9a84c]/70 bg-white p-2 shadow-[0_5px_18px_rgba(8,17,32,0.08)] focus-within:border-[#00c9a7] focus-within:ring-4 focus-within:ring-[#dcefe9]">
            <button type="button" aria-label="Dodaj prilog" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#a0aec0] transition hover:bg-[#f5f0e8] hover:text-[#007d70] sm:flex">
              <Paperclip size={19} />
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pitajte me bilo šta... Tu sam da pomognem! 😊"
              aria-label="Vaša poruka"
              className="min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#263449] outline-none placeholder:text-[#8994a3]"
            />
            <button type="submit" aria-label="Pošalji poruku" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0088ff] text-white shadow-md shadow-[#0088ff]/20 transition hover:bg-[#0074db] disabled:cursor-not-allowed disabled:bg-[#d9dfe7] disabled:text-[#8994a3] disabled:shadow-none" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
          <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-[#8994a3]"><Heart size={11} className="text-[#00aF98]" /> AssistantBot može napraviti grešku. Provjerite važne informacije.</p>
        </div>
      </footer>
    </main>
  );
}
