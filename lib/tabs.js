// lib/tabs.js — LLM-Tab-Komponente mit optionaler Synchronisation
export function initTabs(root) {
  initUsecaseTabs(root);

  root.querySelectorAll('[data-llm-tabs]').forEach(group => {
    group.querySelector('.llm-tabs-nav')?.setAttribute('role', 'tablist');
    group.querySelectorAll('[data-tab]').forEach(btn => {
      const tabName = btn.dataset.tab;
      const panel = group.querySelector(`[data-tab-panel="${tabName}"]`);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
      btn.tabIndex = btn.classList.contains('active') ? 0 : -1;
      if (panel) {
        const panelId = panel.id || `panel-${tabName}-${Math.random().toString(36).slice(2, 8)}`;
        const tabId = btn.id || `tab-${tabName}-${Math.random().toString(36).slice(2, 8)}`;
        panel.id = panelId;
        btn.id = tabId;
        btn.setAttribute('aria-controls', panelId);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tabId);
      }
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab, group.dataset.syncGroup, group);
      });
      btn.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const tabs = Array.from(group.querySelectorAll('[data-tab]'));
        const current = tabs.indexOf(btn);
        if (event.key === 'ArrowRight' && current === tabs.length - 1) return;
        if (event.key === 'ArrowLeft' && current === 0) return;
        const nextIndex = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : current + (event.key === 'ArrowRight' ? 1 : -1);
        event.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex].dataset.tab, group.dataset.syncGroup, group);
      });
    });
  });
}

function initUsecaseTabs(root) {
  root.querySelectorAll('[data-uc-tabs]').forEach(group => {
    const tabs = Array.from(group.querySelectorAll('[data-uc-tab]'));
    const panels = Array.from(group.querySelectorAll('[data-uc-panel]'));
    const activate = (name) => {
      tabs.forEach(tab => {
        const active = tab.dataset.ucTab === name;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => {
        panel.hidden = panel.dataset.ucPanel !== name;
      });
    };

    group.querySelector('.uc-tabs-header')?.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      tab.tabIndex = tab.classList.contains('active') ? 0 : -1;
      tab.addEventListener('click', () => activate(tab.dataset.ucTab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const nextIndex = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        event.preventDefault();
        tabs[nextIndex].focus();
        activate(tabs[nextIndex].dataset.ucTab);
      });
    });
  });
}

function activateTab(tabName, syncGroup, originGroup) {
  const targets = syncGroup
    ? document.querySelectorAll(`[data-llm-tabs][data-sync-group="${syncGroup}"]`)
    : [originGroup];

  for (const group of targets) {
    group.querySelectorAll('[data-tab]').forEach(b => {
      const active = b.dataset.tab === tabName;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      b.tabIndex = active ? 0 : -1;
    });
    group.querySelectorAll('[data-tab-panel]').forEach(p => {
      p.hidden = p.dataset.tabPanel !== tabName;
    });
  }
}
