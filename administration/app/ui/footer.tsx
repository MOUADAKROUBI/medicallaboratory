"use client";

import { useState } from "react";
import { Button } from "@/app/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/ui/dialog";
import { Input } from "@/app/ui/input";
import { Textarea } from "@/app/ui/textarea";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient()

export const Footer = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([{ nome: name, message }]);

      if (error) throw error;

    //   toast({
    //     title: "Feedback submitted",
    //     description: "Thank you for your feedback!",
    //   });

      setName("");
      setMessage("");
      setIsOpen(false);
    } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Failed to submit feedback. Please try again.",
    //   });
    }
  };

  return (
    <footer className="mt-8 border-t py-4">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-2 px-4 sm:flex-row sm:space-y-0">
        <p className="text-sm text-gray-600">
          Designed and developed by{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            sehaconnect.net
          </a>
        </p>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="text-sm text-gray-600 hover:text-primary">
              Send Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send us your feedback</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your feedback"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
};