/**
 * @jest-environment jsdom
 */
import { login } from '../js/login.js';
import * as fb from '../src/firebaseAuth.js';

jest.mock('../src/firebaseAuth.js', () => ({
  auth: {},
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn()
}));

describe('login()', () => {
  let emailInput, passwordInput, dialog, dialogMsg, form;

  beforeAll(() => {
    jest.useFakeTimers();
    // Stub navigation
    delete window.location;
    window.location = { replace: jest.fn() };
  });

  afterAll(() => jest.useRealTimers());

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="email" />
      <input id="password" />
      <button id="submitButton">Submit</button>
      <div id="loginForm"></div>
      <dialog id="notify-dialog">
        <p id="notify-message"></p>
        <button id="notify-ok">OK</button>
      </dialog>
    `;

    emailInput    = document.getElementById('email');
    passwordInput = document.getElementById('password');
    dialog        = document.getElementById('notify-dialog');
    dialogMsg     = document.getElementById('notify-message');
    form          = document.getElementById('loginForm');

    // Stub showModal
    dialog.showModal = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('empty fields shows validation error', async () => {
    emailInput.value    = '';
    passwordInput.value = '';
    await login();

    expect(dialogMsg.textContent).toBe('Email dan password harus diisi!');
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('successful login flow', async () => {
    emailInput.value    = 'a@b.com';
    passwordInput.value = '123';
    fb.signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });

    await login();

    expect(fb.signInWithEmailAndPassword)
      .toHaveBeenCalledWith(fb.auth, 'a@b.com', '123');

    expect(dialogMsg.textContent).toBe('Login berhasil!');
    expect(dialog.showModal).toHaveBeenCalled();
    expect(window.location.replace).toHaveBeenCalledWith('dashboard.html');
  });

  test('wrong password shakes form', async () => {
    emailInput.value    = 'u@u.com';
    passwordInput.value = 'bad';
    fb.signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });

    const addSpy    = jest.spyOn(form.classList, 'add');
    const removeSpy = jest.spyOn(form.classList, 'remove');

    await login();

    expect(dialogMsg.textContent).toBe('Password salah!');
    expect(dialog.showModal).toHaveBeenCalled();
    expect(passwordInput.style.borderColor).toBe('red');
    expect(addSpy).toHaveBeenCalledWith('shake');

    jest.advanceTimersByTime(500);
    expect(removeSpy).toHaveBeenCalledWith('shake');
  });
});
