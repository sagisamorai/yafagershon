import { ChefHat, Heart } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות",
  description: "הכירו את יפה - הלב והנשמה מאחורי המטבח של יפה.",
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-3">אודות המטבח של יפה</h1>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-8 space-y-6">
        <p className="text-stone-600 leading-relaxed text-lg">
          שלום לכולם! אני יפה, ואני מזמינה אתכם להיכנס למטבח שלי.
        </p>
        <p className="text-stone-600 leading-relaxed">
          כבר שנים רבות אני מבשלת ואופה עם אהבה לכל המשפחה. החלטתי לשתף את
          המתכונים שלי עם כולם, כדי שתוכלו גם אתם ליהנות מהטעמים הביתיים.
        </p>
        <p className="text-stone-600 leading-relaxed">
          המתכונים שלי פשוטים, ברורים ומתאימים לכל רמה. בין אם אתם טבחים
          מתחילים או מנוסים - תמצאו פה משהו שיתאים לכם.
        </p>

        <div className="flex items-center gap-2 text-primary-700 bg-primary-50 rounded-lg p-4">
          <Heart className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">מבשלים עם אהבה, תמיד.</span>
        </div>

        <div className="pt-4">
          <h2 className="font-bold text-stone-800 mb-3">עקבו אחרי ברשתות</h2>
          <SocialLinks size="md" showLabels />
        </div>
      </div>
    </div>
  );
}
