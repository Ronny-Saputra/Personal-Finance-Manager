/**
 * @jest-environment jsdom
 */
import { forgotPassword } from '../js/login.js';
import * as fb from '../src/firebaseAuth.js';

// Mock the adapter
jest.mock('../src/firebaseAuth.js', () => ({
  auth: {},
  sendPasswordResetEmail: jest.fn()
}));

describe('forgotPassword()', () => {
  let dialog, msgEl, promptSpy;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <dialog id="notify-dialog">
        <p id="notify-message"></p>
        <button id="notify-ok">OK</button>
      </dialog>
    `;
    dialog = document.getElementById('notify-dialog');
    msgEl  = document.getElementById('notify-message');
    // Stub showModal
    dialog.showModal = jest.fn();
    // Stub prompt
    promptSpy = jest.spyOn(window, 'prompt');
  });

  afterEach(() => {
    jest.resetAllMocks();
    promptSpy.mockRestore();
  });

  test('does nothing if prompt is cancelled', async () => {
    promptSpy.mockReturnValueOnce(null);
    await forgotPassword();
    expect(fb.sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(msgEl.textContent).toBe('');
    expect(dialog.showModal).not.toHaveBeenCalled();
  });

  test('successful reset email shows success popup', async () => {
    promptSpy.mockReturnValueOnce('user@example.com');
    fb.sendPasswordResetEmail.mockResolvedValueOnce();

    await forgotPassword();

    expect(fb.sendPasswordResetEmail)
      .toHaveBeenCalledWith(fb.auth, 'user@example.com');
    expect(msgEl.textContent)
      .toBe('Link reset password sudah dikirim ke email kamu!');
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('unregistered email shows user-not-found error popup', async () => {
    promptSpy.mockReturnValueOnce('notfound@example.com');
    const err = { code: 'auth/user-not-found' };
    fb.sendPasswordResetEmail.mockRejectedValueOnce(err);

    await forgotPassword();

    expect(fb.sendPasswordResetEmail)
      .toHaveBeenCalledWith(fb.auth, 'notfound@example.com');
    expect(msgEl.textContent).toBe('Gagal mengirim link reset password: ' + err.message);
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('other errors show generic error popup', async () => {
    promptSpy.mockReturnValueOnce('user@example.com');
    const err = { code: 'auth/other-error', message: 'Oops!' };
    fb.sendPasswordResetEmail.mockRejectedValueOnce(err);

    await forgotPassword();

    expect(msgEl.textContent).toBe('Gagal mengirim link reset password: Oops!');
    expect(dialog.showModal).toHaveBeenCalled();
  });
});
