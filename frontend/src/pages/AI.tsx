import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export default function AI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Assuming 'guiji' is the default service as per backend code
            const response = await api.post("/ai/chat", {
                service: "guiji",
                messages: [...messages, userMessage],
                model: "gpt-3.5-turbo", // Default or selectable
                temperature: 0.7,
            });

            const assistantMessage: Message = {
                role: "assistant",
                content: response.data.content || response.data.message || "No response",
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I encountered an error." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
            </div>

            <div className="flex flex-1 flex-col rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <Bot className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                <p>Start a conversation with the AI.</p>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex w-full gap-2",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex max-w-[80%] items-start gap-2 rounded-lg px-4 py-3",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {msg.role === "assistant" && <Bot className="mt-1 h-4 w-4 shrink-0" />}
                                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                                {msg.role === "user" && <User className="mt-1 h-4 w-4 shrink-0" />}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex w-full justify-start">
                            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4 bg-background">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
