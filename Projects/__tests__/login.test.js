/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

// Stub only necessary Firebase functions on global scope
window.signInWithEmailAndPassword = jest.fn();
window.getAuth = jest.fn();
window.initializeApp = jest.fn();

// Load login.js into JSDOM context
beforeAll(() => {
  const scriptContent = fs.readFileSync(path.resolve(__dirname, '../js/login.js'), 'utf8');
  const moduleFunc = new Function('exports', 'require', 'window', scriptContent);
  moduleFunc({}, require, window);
});

describe('Login Page (Selected Tests)', () => {
  let html;

  beforeAll(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../html/login.html'), 'utf8');
  });

  beforeEach(() => {
    document.documentElement.innerHTML = html;
    window.alert = jest.fn();
    window.location.replace = jest.fn();
  });

  // 1. Validasi input kosong
  test('alerts when email or password empty', async () => {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    await window.login();

    expect(window.alert).toHaveBeenCalledWith('Email dan password harus diisi!');
    expect(window.signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  // 4. Error user-not-found
  test('user-not-found shows appropriate alert', async () => {
    document.getElementById('email').value = 'nouser@example.com';
    document.getElementById('password').value = 'pass';
    const error = { code: 'auth/user-not-found', message: 'No user' };
    window.signInWithEmailAndPassword.mockRejectedValue(error);

    await window.login();
    expect(window.alert).toHaveBeenCalledWith('User tidak ditemukan! Silakan daftar terlebih dahulu.');
  });

  // 6. goToSignUp navigasi
  test('goToSignUp changes location', () => {
    window.goToSignUp();
    expect(window.location.href).toContain('signup.html');
  });
});
