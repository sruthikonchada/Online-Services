/* ──────────────────────────────────────────────
   Register Page
   ────────────────────────────────────────────── */
const RegisterPage = (() => {

    function render(params = {}) {
        if (Auth.isLoggedIn()) return Router.navigate('/dashboard');

        const isProvider = params.role === 'provider';
        const app = document.getElementById('app');

        app.innerHTML = `
      <div class="auth-page">
        <div class="card auth-card">
          <div class="card-body">
            <h2>${isProvider ? 'Provider Registration' : 'Create Account'}</h2>
            <p class="auth-subtitle">${isProvider ? 'Join LocalLink as a service provider' : 'Sign up to find local services'}</p>

            <div id="registerAlert"></div>

            <!-- Role toggle -->
            <div class="tabs mb-6">
              <button class="tab ${!isProvider ? 'active' : ''}" onclick="Router.navigate('/register')">Customer</button>
              <button class="tab ${isProvider ? 'active' : ''}" onclick="Router.navigate('/register?role=provider')">Provider</button>
            </div>

            <form id="registerForm">
              <div class="form-group">
                <label class="form-label" for="regName">Full Name</label>
                <input type="text" id="regName" class="form-control" placeholder="John Doe" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label" for="regEmail">Email Address</label>
                <input type="email" id="regEmail" class="form-control" placeholder="you@example.com" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label" for="regPhone">Phone Number</label>
                <input type="tel" id="regPhone" class="form-control" placeholder="+91 9876543210" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label" for="regPassword">Password</label>
                <input type="password" id="regPassword" class="form-control" placeholder="Min. 6 characters" required minlength="6">
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label" for="regConfirmPassword">Confirm Password</label>
                <input type="password" id="regConfirmPassword" class="form-control" placeholder="Re-enter password" required>
                <div class="form-error"></div>
              </div>

              <input type="hidden" id="regRole" value="${isProvider ? 'provider' : 'customer'}">

              <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="registerBtn">
                ${isProvider ? 'Register as Provider' : 'Create Account'}
              </button>
            </form>

            <div class="auth-divider">or</div>

            <p class="text-center text-sm">
              Already have an account? <a href="#/login" onclick="Router.navigate('/login')">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    `;

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            const role = document.getElementById('regRole').value;
            const btn = document.getElementById('registerBtn');
            const alert = document.getElementById('registerAlert');

            alert.innerHTML = '';

            if (!name || !email || !phone || !password) {
                alert.innerHTML = '<div class="alert alert-danger">All fields are required</div>';
                return;
            }
            if (password.length < 6) {
                alert.innerHTML = '<div class="alert alert-danger">Password must be at least 6 characters</div>';
                return;
            }
            if (password !== confirm) {
                alert.innerHTML = '<div class="alert alert-danger">Passwords do not match</div>';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Creating account...';

            try {
                await Auth.register(email, password, name, phone, role);
                UI.showToast('Account created successfully!', 'success');

                await new Promise(r => setTimeout(r, 800));

                if (role === 'provider') {
                    Router.navigate('/provider/register');
                } else {
                    Router.navigate('/dashboard');
                }
            } catch (err) {
                let msg = err.message;
                if (err.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
                if (err.code === 'auth/weak-password') msg = 'Password is too weak. Use at least 6 characters.';
                alert.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
                btn.disabled = false;
                btn.textContent = role === 'provider' ? 'Register as Provider' : 'Create Account';
            }
        });
    }

    return { render };
})();
