/* ──────────────────────────────────────────────
   Login Page
   ────────────────────────────────────────────── */
const LoginPage = (() => {

    function render() {
        if (Auth.isLoggedIn()) {
            const role = Auth.getRole();
            if (role === 'admin') return Router.navigate('/admin');
            if (role === 'provider') return Router.navigate('/provider/dashboard');
            return Router.navigate('/dashboard');
        }

        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="auth-page">
        <div class="card auth-card">
          <div class="card-body">
            <h2>Welcome Back</h2>
            <p class="auth-subtitle">Sign in to your LocalLink account</p>

            <div id="loginAlert"></div>

            <form id="loginForm">
              <div class="form-group">
                <label class="form-label" for="loginEmail">Email Address</label>
                <input type="email" id="loginEmail" class="form-control" placeholder="you@example.com" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label" for="loginPassword">Password</label>
                <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                <div class="form-error"></div>
              </div>
              <div class="flex justify-between items-center mb-6">
                <label class="flex items-center gap-2 text-sm" style="cursor:pointer">
                  <input type="checkbox" id="rememberMe"> Remember me
                </label>
                <a href="#" class="text-sm" id="forgotPasswordLink">Forgot password?</a>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="loginBtn">
                Sign In
              </button>
            </form>

            <div class="auth-divider">or</div>

            <p class="text-center text-sm">
              Don't have an account? <a href="#/register" onclick="Router.navigate('/register')">Create one</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div class="modal-backdrop" id="forgotModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Reset Password</h3>
            <button class="modal-close" onclick="document.getElementById('forgotModal').classList.remove('active')">&times;</button>
          </div>
          <div class="modal-body">
            <p>Enter your email address and we'll send you a password reset link.</p>
            <div class="form-group">
              <input type="email" id="resetEmail" class="form-control" placeholder="you@example.com">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('forgotModal').classList.remove('active')">Cancel</button>
            <button class="btn btn-primary" id="resetBtn">Send Reset Link</button>
          </div>
        </div>
      </div>
    `;

        // Forgot password modal
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('forgotModal').classList.add('active');
        });

        // Reset password
        document.getElementById('resetBtn').addEventListener('click', async () => {
            const email = document.getElementById('resetEmail').value.trim();
            if (!email) return UI.showToast('Please enter your email', 'error');
            try {
                await Auth.resetPassword(email);
                UI.showToast('Password reset email sent!', 'success');
                document.getElementById('forgotModal').classList.remove('active');
            } catch (e) {
                UI.showToast(e.message, 'error');
            }
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const btn = document.getElementById('loginBtn');
            const alert = document.getElementById('loginAlert');

            if (!email || !password) {
                alert.innerHTML = '<div class="alert alert-danger">Please fill in all fields</div>';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Signing in...';
            alert.innerHTML = '';

            try {
                await Auth.login(email, password);
                UI.showToast('Welcome back!', 'success');
                // Auth listener will redirect
                await new Promise(r => setTimeout(r, 500));
                const role = Auth.getRole();
                if (role === 'admin') Router.navigate('/admin');
                else if (role === 'provider') Router.navigate('/provider/dashboard');
                else Router.navigate('/dashboard');
            } catch (err) {
                let msg = 'Login failed. Please check your credentials.';
                if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
                if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
                if (err.code === 'auth/too-many-requests') msg = 'Too many attempts. Please try later.';
                alert.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
                btn.disabled = false;
                btn.textContent = 'Sign In';
            }
        });
    }

    return { render };
})();
