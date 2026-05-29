(function () {
  const AUTH_STORAGE_KEY = "math-grade2-auth";

  function expectedToken() {
    const code = ACCESS_CONFIG.code.trim().toLowerCase();
    let h = 0;
    const s = code + "|math-grade2|";
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return "t_" + (h >>> 0).toString(36);
  }

  function isAuthenticated() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (Date.now() > data.expires) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return false;
      }
      return data.token === expectedToken();
    } catch (_) {
      return false;
    }
  }

  function saveAuth(remember) {
    const days = remember ? ACCESS_CONFIG.rememberDays : 0;
    const ms = days > 0 ? days * 86400000 : 12 * 3600000;
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: expectedToken(),
        expires: Date.now() + ms,
      })
    );
  }

  function verifyCode(input) {
    return input.trim().toLowerCase() === ACCESS_CONFIG.code.trim().toLowerCase();
  }

  function showApp() {
    document.getElementById("authGate").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("app--locked");
    document.body.classList.remove("body-locked");
  }

  function showGate() {
    document.getElementById("authGate").classList.remove("hidden");
    document.getElementById("mainApp").classList.add("app--locked");
    document.body.classList.add("body-locked");
  }

  function setError(msg) {
    const el = document.getElementById("authError");
    el.textContent = msg || "";
    el.classList.toggle("visible", Boolean(msg));
  }

  function shakeCard() {
    const card = document.querySelector(".auth-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }

  function bindGate() {
    document.getElementById("authHint").textContent = ACCESS_CONFIG.hint;

    const lockBtn = document.getElementById("lockBtn");
    if (lockBtn) {
      lockBtn.addEventListener("click", () => {
        if (confirm("确定退出吗？下次打开需要重新输入验证码。")) {
          lockApp();
        }
      });
    }

    const input = document.getElementById("authCode");
    const remember = document.getElementById("authRemember");
    const submit = document.getElementById("authSubmit");

    function tryEnter() {
      const value = input.value;
      if (!value.trim()) {
        setError("请输入验证码");
        shakeCard();
        input.focus();
        return;
      }
      if (!verifyCode(value)) {
        setError("验证码不正确，请重试");
        shakeCard();
        input.value = "";
        input.focus();
        return;
      }
      saveAuth(remember.checked);
      setError("");
      showApp();
      if (typeof window.startApp === "function") {
        window.startApp();
      }
    }

    submit.addEventListener("click", tryEnter);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") tryEnter();
    });
    input.focus();
  }

  window.lockApp = function lockApp() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    location.reload();
  };

  function initAuth() {
    bindGate();
    if (isAuthenticated()) {
      showApp();
      if (typeof window.startApp === "function") {
        window.startApp();
      }
    } else {
      showGate();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
  } else {
    initAuth();
  }
})();
