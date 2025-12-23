import './globals.css';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';

export const metadata = {
  title: 'JourneyPersuade - Smart E-commerce',
  description: 'AI-driven shopping experience',
};

export default function RootLayout({ children }) {
  // Mock cart count state could be managed here or context, but for MVP we might keep it simple.
  // We'll pass a static count or implement simple context later if needed.

  return (
    <html lang="en">
      <body className="antialiased text-slate-800 bg-slate-50 selection:bg-pink-500 selection:text-white">
        <Navbar /> {/* Dynamic count */}
        <main className="container mx-auto py-8 min-h-screen">
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  );
}
