"use client";
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "¡Hola! ¿Necesitas ayuda para evitar el abandono del carrito? 😉 Es broma. ¡Estoy aquí para ayudarte a comprar!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        try {
            const res = await fetch(`${apiUrl}/api/chatbot/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Lo siento, tengo problemas para conectarme con mi cerebro.", sender: 'bot' }]);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
                style={{
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X color="white" size={28} /> : <MessageCircle color="white" size={28} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 glass rounded-2xl flex flex-col overflow-hidden z-50"
                    style={{ display: 'flex', flexDirection: 'column' }}>

                    <div className="p-4 bg-opacity-20 bg-black border-b border-gray-700">
                        <h3 className="text-white font-bold">Asistente IA</h3>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto" style={{ flex: 1, overflowY: 'auto' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                marginBottom: '0.75rem',
                                textAlign: msg.sender === 'user' ? 'right' : 'left'
                            }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '1rem',
                                    maxWidth: '80%',
                                    background: msg.sender === 'user' ? '#8b5cf6' : 'rgba(0,0,0,0.05)',
                                    color: msg.sender === 'user' ? 'white' : '#334155',
                                    borderBottomRightRadius: msg.sender === 'user' ? '0.25rem' : '1rem',
                                    borderBottomLeftRadius: msg.sender === 'bot' ? '0.25rem' : '1rem'
                                }}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                        {loading && <div className="text-gray-400 text-sm">Pensando...</div>}
                    </div>

                    <div className="p-3 border-t border-gray-700 flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Pregunta sobre envíos..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(0,0,0,0.1)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem',
                                color: '#334155'
                            }}
                        />
                        <button onClick={sendMessage} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <Send size={20} color="#8b5cf6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
