"use client";

import Link from "next/link";
import { useLanguage } from '../../lib/i18n/useLanguage';

export default function FAQPage() {
  const { t } = useLanguage();
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f2",
        color: "#111111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: 760,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 28,
          paddingRight: 28,
          paddingTop: 56,
          paddingBottom: 90,
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            style={{
              color: "#444",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            ← {t.staticPage.backToHome}
          </Link>
        </div>

        <h1
          style={{
            fontSize: 34,
            lineHeight: 1.28,
            letterSpacing: "-0.01em",
            fontWeight: 500,
            color: "#1c1c1c",
            marginBottom: 38,
            maxWidth: 680,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {t.faq.heroTitle}
        </h1>

        <h2
          style={{
            fontSize: 18,
            lineHeight: 1.5,
            color: "#4b4b4b",
            fontWeight: 400,
            marginBottom: 36,
            maxWidth: 620,
          }}
        >
          {t.faq.subtitle}
        </h2>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.whatIsVirekaSpace.question}
          </h2>

          {t.faq.questions.whatIsVirekaSpace.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.whyClarify.question}
          </h2>

          {t.faq.questions.whyClarify.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.promptEngineering.question}
          </h2>

          {t.faq.questions.promptEngineering.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere"
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.providesAnswers.question}
          </h2>

          {t.faq.questions.providesAnswers.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.decisionTool.question}
          </h2>

          {t.faq.questions.decisionTool.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.alignment.question}
          </h2>

          {t.faq.questions.alignment.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.aiAgents.question}
          </h2>

          {t.faq.questions.aiAgents.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.aiImprovement.question}
          </h2>

          {t.faq.questions.aiImprovement.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.isCoaching.question}
          </h2>

          {t.faq.questions.isCoaching.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>

        <section style={{ marginTop: 38 }}>
          <h2
            style={{
              fontSize: 18,
              lineHeight: 1.45,
              fontWeight: 500,
              color: "#1f1f1f",
              marginTop: 38,
              marginBottom: 10,
              maxWidth: 640,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {t.faq.questions.whoIsFor.question}
          </h2>

          {t.faq.questions.whoIsFor.answer.map((paragraph, index) => (
            <p key={index} style={{ 
              marginBottom: 18,
              fontSize: 16,
              lineHeight: 1.72,
              color: "#2b2b2b",
              fontWeight: 400,
              maxWidth: 640,
              wordBreak: "break-word", 
              overflowWrap: "anywhere" 
            }}>
              {paragraph}
            </p>
          ))}
        </section>
      </main>
    </div>
  );
}
