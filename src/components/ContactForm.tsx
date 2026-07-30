"use client";

import { useId, useRef, useState, type FormEvent } from "react";

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "sending" | "sent";

interface Fields {
  name: string;
  email: string;
  message: string;
}

const emptyFields: Fields = { name: "", email: "", message: "" };

const labelStyle = {
  display: "block",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "var(--color-fg-secondary)",
  marginBottom: 8,
};

const errorStyle = {
  fontSize: 12,
  color: "var(--color-accent)",
  marginTop: 6,
};

function validate(fields: Fields): Partial<Record<keyof Fields, string>> {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_PATTERN.test(fields.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!fields.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

export default function ContactForm() {
  const id = useId();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot — hidden from real users, so anything in it came from a bot.
  const honeypotRef = useRef<HTMLInputElement>(null);

  const fieldId = (field: keyof Fields) => `${id}-${field}`;
  const errorId = (field: keyof Fields) => `${id}-${field}-error`;

  function update(field: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [field]: value }));
    // Clear an error as soon as the visitor starts fixing it.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (formError) setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const nextErrors = validate(fields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById(fieldId(Object.keys(nextErrors)[0] as keyof Fields))?.focus();
      return;
    }

    setStatus("sending");
    setFormError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          company: honeypotRef.current?.value ?? "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(
          data.error ??
            (data.fieldErrors
              ? "Please check the highlighted fields."
              : "Something went wrong. Please try again.")
        );
        setStatus("idle");
        return;
      }

      setFields(emptyFields);
      setStatus("sent");
    } catch {
      setFormError(
        "Couldn’t reach the server. Please try again, or email justinparra206@gmail.com directly."
      );
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="contact-form"
        role="status"
        style={{
          background: "var(--color-card-bg)",
          border: "1px solid var(--color-border)",
          padding: "clamp(32px, 5vw, 48px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: 12,
          }}
        >
          Message Sent
        </div>
        <p style={{ fontSize: 16, marginBottom: 24 }}>
          Thanks for reaching out — I&rsquo;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="contact-form-reset"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "none",
            border: "none",
            padding: "4px 0",
            cursor: "pointer",
            borderBottom: "1px solid var(--color-accent)",
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      style={{ textAlign: "left" }}
    >
      {/* Honeypot — visually hidden and skipped by assistive tech + tabbing. */}
      <div aria-hidden="true" className="contact-form-honeypot">
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          ref={honeypotRef}
          id={`${id}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor={fieldId("name")} style={labelStyle}>
          Name
        </label>
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={NAME_MAX}
          value={fields.name}
          onChange={(e) => update("name", e.target.value)}
          disabled={sending}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? errorId("name") : undefined}
          className="contact-input"
        />
        {errors.name && (
          <p id={errorId("name")} style={errorStyle}>
            {errors.name}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor={fieldId("email")} style={labelStyle}>
          Email
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={EMAIL_MAX}
          value={fields.email}
          onChange={(e) => update("email", e.target.value)}
          disabled={sending}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? errorId("email") : undefined}
          className="contact-input"
        />
        {errors.email && (
          <p id={errorId("email")} style={errorStyle}>
            {errors.email}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 32 }}>
        <label htmlFor={fieldId("message")} style={labelStyle}>
          Message
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          maxLength={MESSAGE_MAX}
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          disabled={sending}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className="contact-input"
          style={{ resize: "vertical", minHeight: 120 }}
        />
        {errors.message && (
          <p id={errorId("message")} style={errorStyle}>
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="contact-submit-btn"
        style={{
          width: "100%",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 40px",
          cursor: sending ? "wait" : "pointer",
        }}
      >
        {sending ? "Sending…" : "Send Message"}
      </button>

      {/* Live region so screen readers hear failures without moving focus. */}
      <p
        role="alert"
        aria-live="polite"
        style={{
          ...errorStyle,
          marginTop: formError ? 16 : 0,
          textAlign: "center",
          minHeight: formError ? undefined : 0,
        }}
      >
        {formError}
      </p>
    </form>
  );
}
