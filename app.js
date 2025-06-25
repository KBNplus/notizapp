const APP_VERSION = '1.0';
const STORAGE_KEY = 'notes';

function loadNotes() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
    const list = document.getElementById('note-list');
    list.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.className = note.done ? 'done' : '';
        const span = document.createElement('span');
        span.textContent = note.text;
        li.appendChild(span);

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = note.done ? 'Offen' : 'Erledigt';
        toggleBtn.addEventListener('click', () => {
            note.done = !note.done;
            saveNotes(notes);
            renderNotes();
        });
        li.appendChild(toggleBtn);

        const upBtn = document.createElement('button');
        upBtn.textContent = 'Hoch';
        upBtn.addEventListener('click', () => moveNote(index, -1));
        li.appendChild(upBtn);

        const downBtn = document.createElement('button');
        downBtn.textContent = 'Runter';
        downBtn.addEventListener('click', () => moveNote(index, 1));
        li.appendChild(downBtn);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Löschen';
        delBtn.addEventListener('click', () => {
            notes.splice(index, 1);
            saveNotes(notes);
            renderNotes();
        });
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

function moveNote(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= notes.length) return;
    [notes[index], notes[newIndex]] = [notes[newIndex], notes[index]];
    saveNotes(notes);
    renderNotes();
}

const notes = loadNotes();

window.addEventListener('load', () => {
    document.getElementById('version').textContent = `v${APP_VERSION}`;
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }, 2000);

    renderNotes();

    document.getElementById('note-form').addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('note-input');
        const text = input.value.trim();
        if (!text) return;
        notes.push({ text, done: false });
        saveNotes(notes);
        renderNotes();
        input.value = '';
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
});
