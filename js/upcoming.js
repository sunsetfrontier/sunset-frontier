// =============================================
// Camp On Golf: upcoming events on the home page
// Shows entries marked .upcoming-event in events.html; stays hidden when there are none.
// =============================================

async function showUpcomingEvents() {
  const target = document.getElementById('home-upcoming');
  if (!target) return;

  let entries;
  try {
    const res = await fetch('events.html');
    if (!res.ok) throw new Error(`events.html returned ${res.status}`);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    entries = doc.querySelectorAll('#upcoming-events .upcoming-event');
  } catch (err) {
    console.error('Could not load upcoming events:', err);
    return;
  }

  if (entries.length === 0) return;

  const label = document.createElement('p');
  label.className = 'doors-upcoming-label';
  label.textContent = entries.length === 1 ? 'Upcoming Event' : 'Upcoming Events';
  target.appendChild(label);

  entries.forEach((entry) => target.appendChild(document.importNode(entry, true)));
  target.hidden = false;
}

showUpcomingEvents();
