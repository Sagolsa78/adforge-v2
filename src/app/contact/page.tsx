import { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Plug and Play Agent",
  description: "Get in touch with the Plug and Play Agent team for support, feedback, or inquiries about Instagram growth.",
};

export default function ContactPage() {
  return (
    <Box minH="100vh" bg="white" display="flex" flexDirection="column">
      <Navbar />
      <ContactPageClient />
      <Footer />
    </Box>
  );
}
