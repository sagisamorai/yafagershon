import { MessageCircle, Mail } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";
import { getWhatsAppLink } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "צרו קשר עם יפה מהמטבח של יפה דרך WhatsApp או הרשתות החברתיות.",
};

export default function ContactPage() {
  return (
    <div className="container-page max-w-3xl">
      <h1 className="text-3xl font-bold text-stone-800 mb-6 text-center">צור קשר</h1>

      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">דברו איתי בוואטסאפ</h2>
          <p className="text-stone-600 mb-4">
            רוצים לשאול שאלה על מתכון? יש לכם רעיון? אשמח לשמוע!
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            שליחת הודעה בוואטסאפ
          </a>
        </div>

        <hr className="border-stone-200" />

        <div>
          <h2 className="text-lg font-bold text-stone-800 mb-3">עקבו אחרי ברשתות</h2>
          <div className="flex justify-center">
            <SocialLinks size="lg" showLabels />
          </div>
        </div>
      </div>
    </div>
  );
}
