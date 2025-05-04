/**
 * @jest-environment jsdom
 */
import { signUp } from '../js/signup.js';
import * as fb from '../src/firebaseAuth.js';

jest.mock('../src/firebaseAuth.js', () => ({
  auth: {},
  db: {},
  createUserWithEmailAndPassword: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn()
}));

describe('signUp()', () => {
  let nameI, emailI, pwI, dialog, msgEl;

  beforeAll(() => {
    jest.useFakeTimers();
    delete window.location;
    window.location = { replace: jest.fn() };
  });
  afterAll(() => jest.useRealTimers());

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="name" />
      <input id="email" />
      <input id="password" />
      <dialog id="notify-dialog"><p id="notify-message"></p><button id="notify-ok">OK</button></dialog>
    `;
    nameI  = document.getElementById('name');
    emailI = document.getElementById('email');
    pwI    = document.getElementById('password');
    dialog = document.getElementById('notify-dialog');
    msgEl  = document.getElementById('notify-message');
    dialog.showModal = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  test('empty fields validation', async () => {
    nameI.value = '';
    emailI.value = '';
    pwI.value = '';
    await signUp();
    expect(msgEl.textContent).toBe('Please fill in all fields!');
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('invalid email format', async () => {
    nameI.value = 'User';
    emailI.value = 'bademail';
    pwI.value = 'pass123';
    await signUp();
    expect(msgEl.textContent).toBe('Invalid email format!');
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('email already registered', async () => {
    nameI.value = 'User';
    emailI.value = 'u@ex.com';
    pwI.value = 'pass123';
    const err = { code: 'auth/email-already-in-use' };
    fb.createUserWithEmailAndPassword.mockRejectedValueOnce(err);

    await signUp();
    expect(msgEl.textContent).toBe('Email sudah terdaftar!');
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('successful sign up', async () => {
    nameI.value = 'User';
    emailI.value = 'u@ex.com';
    pwI.value = 'pass123';
    const fakeUser = { uid: 'uid123', email: 'u@ex.com' };
    fb.createUserWithEmailAndPassword.mockResolvedValueOnce({ user: fakeUser });

    await signUp();

    // Firestore writes
    expect(fb.doc).toHaveBeenCalledWith(fb.db, 'Users', 'uid123');
    expect(fb.setDoc).toHaveBeenCalled();

    expect(fb.updateProfile).toHaveBeenCalledWith(fakeUser, { displayName: 'User' });
    expect(msgEl.textContent).toBe('Sign Up Successful! Welcome, User');
    expect(dialog.showModal).toHaveBeenCalled();
    expect(window.location.replace).toHaveBeenCalledWith('dashboard.html');
  });
});
