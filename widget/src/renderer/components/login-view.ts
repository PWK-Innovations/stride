export function buildLoginView(errorMessage?: string): string {
  const errorHtml = errorMessage
    ? `<div class="login-error">${errorMessage}</div>`
    : "";

  return `
    <div class="login-container">
      <div class="login-card">
        <div class="login-brand">Stride</div>
        <div class="login-subtitle">Sign in to connect your widget</div>
        ${errorHtml}
        <form id="login-form" class="login-form">
          <input
            type="email"
            id="login-email"
            class="login-input"
            placeholder="Email"
            required
            autocomplete="email"
          />
          <input
            type="password"
            id="login-password"
            class="login-input"
            placeholder="Password"
            required
            autocomplete="current-password"
          />
          <button type="submit" id="login-submit" class="login-btn">
            Sign in
          </button>
        </form>
      </div>
    </div>
  `;
}
