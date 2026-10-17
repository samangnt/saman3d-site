'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const dialog = $('#project-dialog');
let activeProject = null;
let imageIndex = 0;
let returnFocus = null;
let activeFilter = 'all';
let expanded = false;
let searchTimer;
const cards = $$('.project-card');
const search = $('#project-search');
const showAll = $('#show-all');
const menu = $('.menu-button');
const navigation = $('#navigation');

// Controls are enabled only after JavaScript loads. Plain links remain usable without it.
$('.portfolio-tools').hidden = false;
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
$$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menu.focus();
  }
});
function filterProjects() {
  const query = search.value.trim().toLocaleLowerCase();
  const matching = cards.filter(card => {
    const project = projects.find(p => p.id === card.dataset.project);
    return (activeFilter === 'all' || project.category === activeFilter) &&
      [project.title, project.label, project.description, ...project.roles].join(' ').toLocaleLowerCase().includes(query);
  });
  const limited = activeFilter === 'all' && !query && !expanded;
  cards.forEach(card => { card.hidden = !matching.includes(card) || (limited && matching.indexOf(card) >= 6); });
  const visible = cards.filter(card => !card.hidden).length;
  showAll.hidden = !limited || matching.length <= 6;
  $('.empty-state').hidden = matching.length !== 0;
  $('#result-count').textContent = `Showing ${visible} of ${matching.length} matching projects.`;
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  $$('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  filterProjects();
}));
search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(filterProjects, 120); });
showAll.addEventListener('click', () => {
  expanded = true; filterProjects();
  const nextCard = cards[6];
  if (nextCard) $('.project-link', nextCard).focus({preventScroll:true});
});
$('#clear-filters').addEventListener('click', () => { search.value = ''; $('[data-filter="all"]').click(); search.focus(); });
filterProjects();

function renderGallery() {
  const picture = $('#project-media img');
  picture.src = activeProject.gallery[imageIndex];
  picture.alt = `${activeProject.title} — artwork ${imageIndex + 1} of ${activeProject.gallery.length}`;
  $('#gallery-count').textContent = `${String(imageIndex + 1).padStart(2, '0')} / ${String(activeProject.gallery.length).padStart(2, '0')}`;
  $$('.gallery-thumbnails button').forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === imageIndex));
  });
}
function openProject(id, trigger = null) {
  const project = projects.find(p => p.id === id);
  if (!project || typeof dialog.showModal !== 'function') return;
  activeProject = project;
  imageIndex = 0;
  returnFocus = trigger || document.activeElement;
  $('#dialog-title').textContent = project.title;
  $('#dialog-category').textContent = project.label;
  $('#dialog-description').textContent = project.description;
  $('.share-status').textContent = '';
  $('#project-media').replaceChildren();
  $('.role-list').replaceChildren(...project.roles.map(role => {
    const item = document.createElement('li'); item.textContent = role; return item;
  }));
  const thumbnails = $('.gallery-thumbnails');
  thumbnails.replaceChildren();
  thumbnails.hidden = !project.gallery || project.gallery.length <= 1;
  $('.gallery-controls').hidden = !project.gallery || project.gallery.length <= 1;
  $('#youtube-link').hidden = !project.video;
  if (project.video) {
    // A player is created only on request; there are no third-party requests on page load.
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${project.video}?autoplay=1&rel=0`;
    frame.title = project.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
    $('#project-media').append(frame);
    $('#youtube-link').href = `https://www.youtube.com/watch?v=${project.video}`;
    $('#media-note').textContent = 'Playing this video connects to YouTube. If the embedded player is unavailable, use “Watch on YouTube”.';
  } else {
    const picture = document.createElement('img');
    $('#project-media').append(picture);
    project.gallery.forEach((source, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `View artwork ${index + 1}`);
      const thumb = document.createElement('img');
      thumb.src = source; thumb.alt = ''; thumb.loading = 'lazy'; thumb.width = 52; thumb.height = 52;
      button.append(thumb);
      button.addEventListener('click', () => { imageIndex = index; renderGallery(); });
      thumbnails.append(button);
    });
    $('#media-note').textContent = project.gallery.length > 1 ? 'Use the arrows, thumbnails or your keyboard’s left and right arrows to explore the gallery.' : 'Development preview · not a playable release.';
    renderGallery();
  }
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
  $('.close-dialog').focus({preventScroll:true});
}
$$('[data-open]').forEach(trigger => trigger.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
  if (typeof dialog.showModal !== 'function') return;
  event.preventDefault(); openProject(trigger.dataset.open, trigger);
}));
$('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  // Removing the iframe also stops audio and video immediately.
  $('#project-media').replaceChildren();
  $('.gallery-thumbnails').replaceChildren();
  activeProject = null;
  document.body.classList.remove('modal-open');
  if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
});
function moveImage(step) {
  if (!activeProject?.gallery || activeProject.gallery.length <= 1) return;
  imageIndex = (imageIndex + step + activeProject.gallery.length) % activeProject.gallery.length;
  renderGallery();
}
$('#previous-image').addEventListener('click', () => moveImage(-1));
$('#next-image').addEventListener('click', () => moveImage(1));
dialog.addEventListener('keydown', event => {
  if (!activeProject?.gallery || ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); moveImage(event.key === 'ArrowRight' ? 1 : -1);
  }
});
async function copyText(value, status, success) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    status.textContent = success;
  } catch {
    status.textContent = `Copy manually: ${value}`;
  }
}
$('.copy-email').addEventListener('click', () => copyText('saman@saman3d.com', $('.copy-status'), 'Email copied. Let’s make something great.'));
$('.share-project').addEventListener('click', () => {
  if (!activeProject) return;
  const link = new URL(location.href); link.hash = `project=${activeProject.id}`;
  copyText(link.href, $('.share-status'), 'Project link copied.');
});
function readProjectLink() {
  const match = location.hash.match(/^#project=([a-z0-9-]+)$/);
  if (match) openProject(match[1]);
  else if (dialog.open) dialog.close();
}
window.addEventListener('hashchange', readProjectLink);
readProjectLink();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('a[href^="#"]', navigation).forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, {rootMargin:'-15% 0px -65% 0px',threshold:0});
  ['work','game-dev','about','contact'].forEach(id => observer.observe(document.getElementById(id)));
}
