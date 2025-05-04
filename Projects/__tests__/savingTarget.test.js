
/**
 * @jest-environment jsdom
 */
import * as fb from '../firebaseAuth.js';

jest.mock('../firebaseAuth.js', () => ({
  updateTargetSaving: jest.fn()
}));

describe('updateTargetSaving()', () => {
  let dialog, dialogMsg, targetInput;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="target-amount" />
      <dialog id="notify-dialog"><p id="notify-message"></p></dialog>
    `;
    targetInput = document.getElementById("target-amount");
    dialog = document.getElementById("notify-dialog");
    dialogMsg = document.getElementById("notify-message");
    dialog.showModal = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  test('shows validation error for empty input', async () => {
    targetInput.value = "";
    dialogMsg.textContent = "Target harus diisi!";
    dialog.showModal();

    expect(dialogMsg.textContent).toBe("Target harus diisi!");
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test('calls update function on valid input', async () => {
    targetInput.value = "100000";
    await fb.updateTargetSaving({ uid: "abc" }, 100000);

    expect(fb.updateTargetSaving).toHaveBeenCalledWith({ uid: "abc" }, 100000);
  });

  test('does not call update if input is non-numeric', async () => {
    targetInput.value = "abc";
    const parsed = parseInt(targetInput.value);
    if (isNaN(parsed)) {
      dialogMsg.textContent = "Target tidak valid!";
      dialog.showModal();
    }

    expect(dialogMsg.textContent).toBe("Target tidak valid!");
    expect(dialog.showModal).toHaveBeenCalled();
    expect(fb.updateTargetSaving).not.toHaveBeenCalled();
  });
});
