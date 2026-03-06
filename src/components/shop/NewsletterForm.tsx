import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Aanmelding mislukt");
      }

      toast({
        title: "Aangemeld!",
        description: data.message || "Je bent aangemeld voor de nieuwsbrief.",
      });

      setEmail("");
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Fout",
        description: e instanceof Error ? e.message : "Er is iets misgegaan. Probeer het later opnieuw.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="E-mailadres"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        required
        className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSubmitting || !email.trim()}
        className="h-11 px-4 bg-accent text-accent-foreground text-xs tracking-wider uppercase font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "..." : "Aanmelden"}
      </button>
    </form>
  );
}
