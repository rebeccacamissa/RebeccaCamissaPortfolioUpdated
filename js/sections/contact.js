/* 09 · Contact — email + LinkedIn channels and the "Ask Rebecca" form.
   The form posts to Formspree. Without JS it's a normal POST (Formspree shows
   its own thank-you page); with JS it submits via fetch and shows inline states. */
(function (Site) {
  "use strict";
  const { esc, icon, eyebrow, highlight, announce, sections } = Site;

  const MAX_MESSAGE = 2000;
  const isFormspree = (url) => /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(url || "");

  function field({ id, label, type = "text", autocomplete, textarea = false }) {
    const common = `id="${id}" name="${id === "cf-email" ? "email" : id === "cf-name" ? "name" : "message"}"
      class="field-input" required aria-describedby="${id}-error" data-cf-field`;
    const control = textarea
      ? `<textarea ${common} rows="6" maxlength="${MAX_MESSAGE}"></textarea>`
      : `<input ${common} type="${type}" autocomplete="${autocomplete}" ${type === "email" ? 'inputmode="email"' : ""} />`;
    return `
      <div>
        <label for="${id}" class="field-label">${esc(label)} <span class="text-accent" aria-hidden="true">*</span></label>
        ${control}
        <p id="${id}-error" class="field-error" data-cf-error hidden></p>
      </div>`;
  }

  sections.contact = {
    render(site) {
      const c = site.contact;
      const f = c.form;
      const email = site.email;
      const linkedin = (site.social || {}).linkedin;
      const endpoint = isFormspree(c.formEndpoint) ? c.formEndpoint : "";

      const channels = [
        email && `
          <li data-reveal>
            <a href="mailto:${esc(email)}" class="contact-channel">
              <span class="contact-channel-icon bg-pink text-onyx" aria-hidden="true">
                ${Site.svg('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>', "size-5")}
              </span>
              <span class="min-w-0">
                <span class="block font-display text-lg font-bold">${esc(c.channels.emailLabel)}</span>
                <span class="block break-all text-sm text-ink-soft">${esc(email)}</span>
              </span>
              <span class="contact-channel-arrow" aria-hidden="true">${icon.arrow}</span>
            </a>
          </li>`,
        linkedin && `
          <li data-reveal>
            <a href="${esc(linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-channel"
               aria-label="${esc(c.channels.linkedinLabel)}: ${esc(site.name)} (opens in a new tab)">
              <span class="contact-channel-icon bg-accent text-on-accent" aria-hidden="true">${icon.linkedin}</span>
              <span class="min-w-0">
                <span class="block font-display text-lg font-bold">${esc(c.channels.linkedinLabel)}</span>
                <span class="block break-all text-sm text-ink-soft">${esc(linkedin.replace(/^https:\/\/(www\.)?/, ""))}</span>
              </span>
              <span class="contact-channel-arrow" aria-hidden="true">${icon.external}</span>
            </a>
          </li>`,
      ].filter(Boolean).join("");

      return `
        <div class="section-shell">
          ${eyebrow(c.eyebrow)}
          <div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
            <h2 id="contact-title" class="font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
              ${highlight(c.headline, c.headlineHighlight)}
            </h2>
            <p class="max-w-xl text-lg leading-relaxed text-ink-soft">${esc(c.subtitle)}</p>
          </div>

          <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
            <ul class="grid content-start gap-4" role="list" aria-label="Contact channels">${channels}</ul>

            <form class="contact-form" ${endpoint ? `action="${esc(endpoint)}" method="POST"` : ""} novalidate data-cf
                  aria-labelledby="cf-title">
              <h3 id="cf-title" class="font-display text-2xl font-bold">${esc(f.title)}</h3>

              <div class="mt-6 grid gap-5 sm:grid-cols-2">
                ${field({ id: "cf-name", label: f.name, autocomplete: "name" })}
                ${field({ id: "cf-email", label: f.email, type: "email", autocomplete: "email" })}
              </div>
              <div class="mt-5">
                ${field({ id: "cf-message", label: f.message, textarea: true })}
                <p class="mt-1 text-right text-xs tabular-nums text-ink-soft" aria-hidden="true"><span data-cf-count>0</span> / ${MAX_MESSAGE}</p>
              </div>

              <!-- Spam honeypot: real people never see or fill this. -->
              <div class="hidden" aria-hidden="true">
                <label for="cf-gotcha">Leave this empty</label>
                <input type="text" id="cf-gotcha" name="_gotcha" tabindex="-1" autocomplete="off" />
              </div>
              <input type="hidden" name="_subject" value="Portfolio message for ${esc(site.name)}" data-cf-subject />

              <div class="mt-6 flex flex-wrap items-center gap-4">
                <button type="submit" class="btn btn-primary" data-cf-submit>
                  <span data-cf-submit-icon class="inline-flex">${icon.arrow}</span><span data-cf-submit-label>${esc(f.submit)}</span>
                </button>
                <p class="text-xs text-ink-soft">All fields are required.</p>
              </div>

              <div class="form-status" data-cf-status role="status" aria-live="polite"></div>
            </form>
          </div>
        </div>`;
    },

    init(el, site) {
      const c = site.contact;
      const form = el.querySelector("[data-cf]");
      if (!form) return;
      const endpoint = isFormspree(c.formEndpoint) ? c.formEndpoint : "";
      const status = form.querySelector("[data-cf-status]");
      const submit = form.querySelector("[data-cf-submit]");
      const submitLabel = form.querySelector("[data-cf-submit-label]");
      const submitIcon = form.querySelector("[data-cf-submit-icon]");
      const message = form.querySelector("#cf-message");
      const count = form.querySelector("[data-cf-count]");

      message.addEventListener("input", () => (count.textContent = message.value.length));

      const MESSAGES = {
        name: "Please tell me your name.",
        email: "Please enter a valid email address, like name@example.com.",
        message: "Please write a short message.",
      };

      function setError(input, msg) {
        const err = form.querySelector(`#${input.id}-error`);
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        err.textContent = msg || "";
        err.hidden = !msg;
      }

      function validate() {
        let first = null;
        form.querySelectorAll("[data-cf-field]").forEach((input) => {
          const ok = input.checkValidity() && input.value.trim() !== "";
          setError(input, ok ? "" : MESSAGES[input.name]);
          if (!ok && !first) first = input;
        });
        if (first) first.focus();
        return !first;
      }

      // Clear a field's error as soon as it becomes valid.
      form.addEventListener("input", (e) => {
        const input = e.target.closest("[data-cf-field]");
        if (input && input.getAttribute("aria-invalid") === "true" && input.checkValidity() && input.value.trim()) setError(input, "");
      });

      function showStatus(kind, text) {
        status.dataset.kind = kind;
        status.textContent = text;
      }

      function busy(on) {
        submit.disabled = on;
        submit.setAttribute("aria-busy", String(on));
        submitLabel.textContent = on ? c.form.sending : c.form.submit;
        submitIcon.innerHTML = on ? icon.spinner : icon.arrow;
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        status.textContent = "";
        if (!validate()) {
          announce("Please fix the highlighted fields.");
          return;
        }

        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        data.set("_subject", `Portfolio message from ${name}`);

        // No Formspree endpoint configured → hand off to the visitor's email app.
        if (!endpoint) {
          const body = `${data.get("message")}\n\n— ${name} (${data.get("email")})`;
          location.href = `mailto:${site.email}?subject=${encodeURIComponent(data.get("_subject"))}&body=${encodeURIComponent(body)}`;
          return;
        }

        busy(true);
        try {
          const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (res.ok) {
            form.reset();
            count.textContent = "0";
            showStatus("success", c.form.success);
            return;
          }
          // Formspree returns { errors: [{ field, message }] } on validation failures.
          const json = await res.json().catch(() => ({}));
          const errors = Array.isArray(json.errors) ? json.errors : [];
          let fieldErrors = 0;
          errors.forEach((er) => {
            const input = er.field && form.querySelector(`[data-cf-field][name="${er.field}"]`);
            if (input) { setError(input, er.message); fieldErrors++; }
          });
          showStatus("error", fieldErrors ? "Please check the highlighted fields." : (errors[0] && errors[0].message) || c.form.error);
        } catch (_) {
          showStatus("error", `${c.form.error} (${site.email})`);
        } finally {
          busy(false);
        }
      });
    },
  };
})(window.Site);
