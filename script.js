// Small enhancements. The site still reads fine without JavaScript.
const cards = [...document.querySelectorAll('.card')];
const chips = [...document.querySelectorAll('.chip')];
const empty = document.getElementById('no-results');
let cat = 'all', dest = 'all';

function applyFilters() {
  let shown = 0;
  cards.forEach(c => {
    const ok = (cat === 'all' || c.dataset.cat.includes(cat)) &&
               (dest === 'all' || c.dataset.name === dest);
    c.hidden = !ok;
    if (ok) shown++;
  });
  empty.hidden = shown > 0;
}

chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  cat = chip.dataset.filter;
  applyFilters();
}));

// Hero finder: filter destinations and scroll to them
document.getElementById('finder').addEventListener('submit', e => {
  e.preventDefault();
  dest = document.getElementById('f-dest').value;
  cat = 'all';
  chips.forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
  applyFilters();
  document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
});

// "Book this trip" pre-selects the destination
document.querySelectorAll('[data-pick]').forEach(a => a.addEventListener('click', () => {
  document.getElementById('b-dest').value = a.dataset.pick;
  updateQuote();
}));

// Booking: min date = today, live price estimate
const date = document.getElementById('b-date');
date.min = new Date().toISOString().split('T')[0];
const quote = document.getElementById('quote');
const pack = document.getElementById('b-pack');
const guests = document.getElementById('b-guests');

function updateQuote() {
  const price = Number(pack.value), n = Number(guests.value);
  if (!price || !n) { quote.textContent = 'Pick a package and group size to see an estimate.'; quote.classList.remove('ok'); return; }
  const total = price * n;
  quote.textContent = `Estimated total for ${n} traveller${n > 1 ? 's' : ''}: $${total.toLocaleString()}. Deposit to confirm (20%): $${Math.round(total * 0.2).toLocaleString()}.`;
  quote.classList.add('ok');
}
[pack, guests].forEach(el => el.addEventListener('input', updateQuote));

// Newsletter confirmation (demo: connect to your email service)
document.getElementById('news').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('news-msg').textContent = 'Thanks for subscribing. Check your inbox to confirm.';
  e.target.reset();
});
