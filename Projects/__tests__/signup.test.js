/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

// Stub Firebase functions on window
window.createUserWithEmailAndPassword = jest.fn();
window.updateProfile = jest.fn();
window.setDoc = jest.fn();
window.doc = jest.fn();
window.getFirestore = jest.fn();
window.getAuth = jest.fn();
window.initializeApp = jest.fn();
window.GoogleAuthProvider = jest.fn();
window.signInWithPopup = jest.fn();

// Load signup.js into JSDOM context
beforeAll(() => {
  const code = fs.readFileSync(path.resolve(__dirname, '../js/signup.js'), 'utf8');
  const func = new Function('exports', 'require', 'window', 'getFirestore', 'doc', 'setDoc', 'createUserWithEmailAndPassword', 'updateProfile', 'GoogleAuthProvider', 'signInWithPopup', code);
  func({}, require, window, window.getFirestore, window.doc, window.setDoc, window.createUserWithEmailAndPassword, window.updateProfile, window.GoogleAuthProvider, window.signInWithPopup);
});

describe('Sign Up Page (Selected Tests)', () => {
  let html;
  beforeAll(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../html/signup.html'), 'utf8');
  });
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    window.alert = jest.fn();
    window.location.href = '';
  });

  // 1. Field kosong → alert
  test('alerts when any field is empty', async () => {
    document.getElementById('name').value = '';
    document.getElementById('email').value = 'a@b.com';
    document.getElementById('password').value = 'pass';
    await window.signUp();
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields!');
  });

  // 3. Error saat sign up → alert
  test('error during sign up shows alert', async () => {
    document.getElementById('name').value = 'Test';
    document.getElementById('email').value = 'err@user.com';
    document.getElementById('password').value = 'pwd';
    const err = new Error('fail');
    window.createUserWithEmailAndPassword.mockRejectedValueOnce(err);

    await window.signUp();
    expect(window.alert).toHaveBeenCalledWith('Sign Up Failed: ' + err.message);
  });

  // 4. goToLogin navigasi
  test('goToLogin navigates to login.html', () => {
    window.goToLogin();
    expect(window.location.href).toContain('login.html');
  });

  // 6. Google sign up failure shows alert
  test('google sign up failure shows alert', async () => {
    const err = new Error('gfail');
    window.signInWithPopup.mockRejectedValueOnce(err);
    await window.signUpWithGoogle();
    expect(window.alert).toHaveBeenCalledWith('Google Sign Up Failed: ' + err.message);
  });
});
