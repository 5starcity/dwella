import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import "./global.css";

export const metadata = {
  title: "Dwella",
  description: "Find verified student housing across Nigeria — no agents, no stress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}