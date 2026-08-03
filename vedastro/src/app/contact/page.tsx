"use client";

import React, { useState } from "react";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import Input from "../../components/common/Input";
import Button from "./../../components/common/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "" as "success" | "error" | "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      await new Promise((res) => setTimeout(res, 1200));
      setStatus({ 
        type: "success", 
        text: "Support request dispatched cleanly. Code token: VA-TKT-" + Math.floor(Math.random() * 9000) 
      });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus({ type: "error", text: "Failed to anchor request pipeline." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-white dark:text-white light:text-slate-900 pt-24 pb-12 select-none">
      <Container>
        <SectionHeading 
          title="Support Terminal" 
          subtitle="Encountered integration anomalies? Open an immediate communication pipe with our infrastructure engineers." 
        />

        <Card hoverEffect={false} className="max-w-md mx-auto bg-slate-900/10 backdrop-blur-md shadow-2xl p-6 rounded-2xl border border-slate-900 dark:border-slate-900 light:border-slate-200">
          
          {status.text && (
            <div className="mb-4 w-full text-center">
              <Badge variant={status.type === "success" ? "success" : "error"} className="w-full justify-center py-2 rounded-xl text-[10px] lowercase first-letter:uppercase">
                {status.text}
              </Badge>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <Input 
              label="Your Identity" 
              placeholder="Enter Your Name" 
              value={formData.name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
            
            <Input 
              label="Communication Email Address" 
              type="email" 
              placeholder="Enter E-mail" 
              value={formData.email} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
            
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-500 dark:text-slate-500 light:text-slate-600 tracking-wider mb-1.5">
                Elaborate Context
              </label>
              <textarea 
                rows={4}
                placeholder="Describe your active transaction or socket stream mismatch..."
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-950 dark:bg-slate-950 light:bg-white px-4 py-2.5 text-xs text-white dark:text-white light:text-slate-900 placeholder-slate-700 font-medium focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition duration-200 resize-none"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full text-[10px] py-3 uppercase tracking-widest font-black" loading={loading}>
              Submit 
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}