async function loadNotes(){
  try{
    const res = await fetch('data/notes.json');
    if(!res.ok) throw new Error('Notlar yüklenemedi');
    const notes = await res.json();
    window._notes = notes;
    populateSubjects(notes);
    renderNotes(notes);
  }catch(e){
    const container = document.getElementById('notes-list');
    container.innerHTML = '<p style="color:#b91c1c">Notlar yüklenirken hata oluştu.</p>';
    console.error(e);
  }
}

function populateSubjects(notes){
  const sel = document.getElementById('filter-subject');
  sel.innerHTML = '<option value="">Tüm dersler</option>';
  const subjects = Array.from(new Set(notes.map(n=>n.subject))).sort();
  for(const s of subjects){
    const opt = document.createElement('option'); opt.value = s; opt.textContent = s; sel.appendChild(opt);
  }
  return subjects;
}

function renderNotes(notes){
  const list = document.getElementById('notes-list');
  list.innerHTML = '';
  if(!notes || !notes.length){ list.innerHTML = '<p>Gösterilecek not bulunamadı.</p>'; return; }

  // Group by subject
  const groups = {};
  for(const n of notes){ groups[n.subject] = groups[n.subject] || []; groups[n.subject].push(n); }
  const subjects = Object.keys(groups).sort();
  const maxCols = Math.max(...subjects.map(s=>groups[s].length));

  // Build table
  const wrap = document.createElement('div'); wrap.className='notes-table-wrap container-scroll';
  const table = document.createElement('table'); table.className='notes-table';
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const th0 = document.createElement('th'); th0.textContent = 'Ders / Not'; headRow.appendChild(th0);
  for(let i=0;i<maxCols;i++){ const th = document.createElement('th'); th.textContent = `Not ${i+1}`; headRow.appendChild(th); }
  thead.appendChild(headRow); table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for(const subj of subjects){
    const tr = document.createElement('tr');
    const tdSub = document.createElement('td'); tdSub.textContent = subj; tr.appendChild(tdSub);
    for(let i=0;i<maxCols;i++){
      const td = document.createElement('td');
      const note = groups[subj][i];
      if(note){
        const card = document.createElement('div'); card.className='note-card';
        card.innerHTML = `
          <h4 class="note-title">${escapeHtml(note.title)}</h4>
          <p class="note-meta">${escapeHtml(note.teacher)}</p>
          <p class="excerpt">${escapeHtml(note.excerpt)}</p>
          <div style="margin-top:8px"><button class="btn" data-id="${note.id}">Görüntüle</button></div>
        `;
        td.appendChild(card);
      }else{
        const ph = document.createElement('div'); ph.className='placeholder'; ph.textContent = '-'; td.appendChild(ph);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);
  list.appendChild(wrap);

  // attach handlers
  document.querySelectorAll('.btn').forEach(b=>b.addEventListener('click',e=>openModal(e.target.dataset.id)));
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

function openModal(id){
  const note = window._notes.find(n=>String(n.id)===String(id));
  if(!note) return;
  document.getElementById('modal-title').textContent = note.title;
  document.getElementById('modal-teacher').textContent = note.teacher;
  document.getElementById('modal-subject').textContent = note.subject;
  document.getElementById('modal-date').textContent = note.date;
  document.getElementById('modal-body').innerHTML = note.content;
  const modal = document.getElementById('note-modal');
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  const modal = document.getElementById('note-modal');
  modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true');
}

function applyFilters(){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const subj = document.getElementById('filter-subject').value;
  let notes = window._notes || [];
  if(subj) notes = notes.filter(n=>n.subject===subj);
  if(q) notes = notes.filter(n=> (n.title+n.teacher+n.subject+n.excerpt).toLowerCase().includes(q) );
  renderNotes(notes);
}

document.getElementById && (function(){
  document.getElementById('close-modal').addEventListener('click',closeModal);
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('filter-subject').addEventListener('change', applyFilters);
  // click outside to close
  document.getElementById('note-modal').addEventListener('click', (e)=>{ if(e.target.id==='note-modal') closeModal(); });
  loadNotes();
})();
