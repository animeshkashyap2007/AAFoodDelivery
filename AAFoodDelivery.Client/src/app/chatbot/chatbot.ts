import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot {

  private chatService = inject(ChatService);

  isOpen = false;

  message = '';

  loading = false;

  messages: { sender: string; text: string }[] = [
    {
      sender: 'bot',
      text: '👋 Hello! I am your AA Food AI Assistant. Ask me anything about food, offers or your order.'
    }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {

    if (!this.message.trim()) return;

    const userMessage = this.message;

    this.messages.push({
      sender: 'user',
      text: userMessage
    });

    this.message = '';

    this.loading = true;

    this.chatService.sendMessage(userMessage).subscribe({

      next: (res) => {

        this.messages.push({
          sender: 'bot',
          text: res.reply
        });

        this.loading = false;
      },

      error: () => {

        this.messages.push({
          sender: 'bot',
          text: '❌ Sorry, AI is currently unavailable.'
        });

        this.loading = false;
      }

    });

  }

}
