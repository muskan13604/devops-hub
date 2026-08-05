import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../services/ai.api';
import { FiMessageSquare, FiTerminal, FiBox, FiSend, FiCopy, FiCheck, FiCpu } from 'react-icons/fi';

export function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat'); // chat, logs, dockerfile

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out h-full flex flex-col">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <FiCpu className="text-indigo-600" /> AI Assistant
          </h1>
          <p className="mt-2 text-sm text-slate-500">Powered by Gemini. Ask DevOps questions, analyze logs, or generate Dockerfiles.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 shrink-0">
        <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<FiMessageSquare />} label="DevOps Chat" />
        <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<FiTerminal />} label="Log Analyzer" />
        <TabButton active={activeTab === 'dockerfile'} onClick={() => setActiveTab('dockerfile')} icon={<FiBox />} label="Dockerfile Generator" />
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'logs' && <LogsTab />}
        {activeTab === 'dockerfile' && <DockerfileTab />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
        active 
          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      {icon} {label}
    </button>
  );
}

// --- Chat Tab ---
function ChatTab() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your DevOpsHub AI. Need help with Jenkins, Docker, or Kubernetes?" }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const mutation = useMutation({
    mutationFn: aiApi.chat,
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'ai', content: data.data.reply }]);
    }
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mutation.isPending]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    mutation.mutate(userMsg);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <FiCpu />
              </div>
            )}
            
            <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
            
            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 shrink-0 font-bold uppercase">
                U
              </div>
            )}
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <FiCpu />
            </div>
            <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm p-4 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={mutation.isPending}
            placeholder="Ask a DevOps question..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-4 pr-12 py-3.5 text-sm outline-none focus:border-indigo-500 focus:bg-white shadow-sm transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || mutation.isPending}
            className="absolute right-2 top-2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <FiSend size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Logs Analyzer Tab ---
function LogsTab() {
  const [logs, setLogs] = useState('');
  
  const mutation = useMutation({
    mutationFn: aiApi.analyzeLogs
  });

  const analysis = mutation.data?.data;

  return (
    <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-slate-50">
      <div className="w-full lg:w-1/2 p-6 flex flex-col border-r border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-2">Input Application Logs</h3>
        <p className="text-xs text-slate-500 mb-4">Paste failing Jenkins logs, Docker container crashes, or K8s pod logs here.</p>
        <textarea 
          value={logs}
          onChange={(e) => setLogs(e.target.value)}
          className="flex-1 w-full rounded-xl border border-slate-300 p-4 text-xs font-mono outline-none focus:border-indigo-500 resize-none mb-4 shadow-sm"
          placeholder="Paste raw logs here..."
        />
        <button 
          onClick={() => mutation.mutate(logs)}
          disabled={!logs.trim() || mutation.isPending}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {mutation.isPending ? 'Analyzing Logs...' : 'Analyze Logs with AI'}
        </button>
      </div>

      <div className="w-full lg:w-1/2 p-6 overflow-y-auto bg-white">
        {mutation.isPending ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <FiTerminal className="animate-pulse text-indigo-500" size={48} />
            <p className="animate-pulse">AI is reading your logs...</p>
          </div>
        ) : !analysis ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Analysis output will appear here.
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Summary</h4>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-slate-800 shadow-sm">{analysis.summary}</div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">Root Cause</h4>
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-sm text-rose-800 font-medium shadow-sm">{analysis.cause}</div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Suggested Fix</h4>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-sm text-emerald-800 shadow-sm">{analysis.fix}</div>
            </div>

            {analysis.commands?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Commands to Run</h4>
                <div className="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
                  {analysis.commands.map((cmd, i) => (
                    <div key={i} className="font-mono text-xs text-sky-400 mb-2 last:mb-0 flex items-center gap-2">
                      <span className="text-slate-500">$</span> {cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Dockerfile Generator Tab ---
function DockerfileTab() {
  const [projectType, setProjectType] = useState('');
  const [copied, setCopied] = useState(false);
  
  const mutation = useMutation({
    mutationFn: aiApi.generateDockerfile
  });

  const dockerfile = mutation.data?.data?.dockerfile;

  const handleCopy = () => {
    if (dockerfile) {
      navigator.clipboard.writeText(dockerfile);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-slate-50">
      <div className="w-full lg:w-1/3 p-6 flex flex-col border-r border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-2">Describe Your Project</h3>
        <p className="text-xs text-slate-500 mb-4">E.g., "Next.js frontend with Tailwind", "Node.js Express API", "Python Django app with Postgres".</p>
        <textarea 
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="flex-1 w-full rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-indigo-500 resize-none mb-4 shadow-sm"
          placeholder="I have a React application using Vite and..."
        />
        <button 
          onClick={() => mutation.mutate(projectType)}
          disabled={!projectType.trim() || mutation.isPending}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {mutation.isPending ? 'Generating...' : 'Generate Dockerfile'}
        </button>
      </div>

      <div className="w-full lg:w-2/3 p-6 bg-[#1e1e1e] relative flex flex-col">
        {mutation.isPending ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
            <FiBox className="animate-spin text-sky-500" size={48} />
            <p className="animate-pulse text-sm font-mono text-slate-400">Crafting multi-stage Dockerfile...</p>
          </div>
        ) : !dockerfile ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-sm font-mono">
            Generated Dockerfile will appear here.
          </div>
        ) : (
          <div className="relative h-full flex flex-col animate-in fade-in">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-mono text-slate-400">Dockerfile</span>
              <button 
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded"
              >
                {copied ? <><FiCheck className="text-emerald-400"/> Copied!</> : <><FiCopy /> Copy code</>}
              </button>
            </div>
            <pre className="flex-1 overflow-auto text-sm font-mono text-slate-300 p-4 bg-black/30 rounded-xl border border-white/10 leading-relaxed whitespace-pre-wrap selection:bg-sky-500/30">
              {dockerfile}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
