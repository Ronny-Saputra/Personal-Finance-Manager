/**
 * @jest-environment jsdom
 */

let authCallback;
const fakeDocs = [
  { type:'expense', category:'Food', amount:100, createdAt:{ toDate:()=>new Date('2025-01-05T09:00:00') } },
  { type:'expense', category:'Food', amount:200, createdAt:{ toDate:()=>new Date('2025-01-05T12:00:00') } },
  { type:'expense', category:'Rent', amount:300, createdAt:{ toDate:()=>new Date('2025-01-10T15:00:00') } },
  { type:'income',  category:'',     amount:500, createdAt:{ toDate:()=>new Date('2025-01-05T10:00:00') } }
];

// 1) Mock firebaseAuth before loading the module
jest.mock('../src/firebaseAuth.js', () => ({
  auth: {},
  onAuthStateChanged: (auth, cb) => { authCallback = cb; },
  collection: () => {},
  getDocs: async () => ({ docs: fakeDocs.map(d => ({ data: () => d })) }),
  query: () => {},
  orderBy: () => {}
}));

// 2) Set up the DOM, including duration-display and selects
beforeAll(() => {
  document.body.innerHTML = `
    <div class="welcome-message"></div>
    <select id="duration-select"><option>January</option><option>February</option></select>
    <div id="duration-display"></div>
    <select id="category-filter">
      <option value="all">All</option>
      <option value="Food">Food</option>
      <option value="Rent">Rent</option>
    </select>
    <div id="transaction-data"></div>
    <dialog id="notify-dialog">
      <p id="notify-message"></p>
      <button id="notify-ok">OK</button>
    </dialog>
  `;
  require('../js/transactions.js');
});

describe('Transactions page', () => {
  test('renders grouped expense records correctly', async () => {
    // Initial render
    await authCallback({ uid:'user1', displayName:'Tester' });
    const content = document.getElementById('transaction-data').textContent;

    expect(content).toMatch(/Day 5/);
    expect(content).toMatch(/Total: Rp 300/);
    expect(content).toMatch(/Food/);
    expect(content).toMatch(/Rp 100/);
    expect(content).toMatch(/Rp 200/);

    expect(content).toMatch(/Day 10/);
    expect(content).toMatch(/Rent/);
    expect(content).toMatch(/Rp 300/);
  });

  test('filters by category', async () => {
    await authCallback({ uid:'user1' });  // initial render

    const catSelect = document.getElementById('category-filter');
    catSelect.value = 'Rent';
    catSelect.dispatchEvent(new Event('change'));

    const content = document.getElementById('transaction-data').textContent;
    expect(content).not.toMatch(/Food/);
    expect(content).toMatch(/Rent/);
    expect(content).toMatch(/Day 10/);
  });

  test('changes month selection', async () => {
    await authCallback({ uid:'user1' });  // initial render

    const monthSelect = document.getElementById('duration-select');
    monthSelect.value = 'February';
    monthSelect.dispatchEvent(new Event('change'));

    const content = document.getElementById('transaction-data').textContent;
    expect(content).toMatch(/No transactions for February/);
  });
});