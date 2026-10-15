// Client-side interactivity for Second Brain

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Type Toggle in Create/Edit forms
  const typeSelect = document.getElementById('memory-type-select');
  if (typeSelect) {
    const toggleFields = () => {
      const selectedType = typeSelect.value;

      const codeGroup = document.getElementById('code-fields-group');
      const taskGroup = document.getElementById('task-fields-group');
      const bookmarkGroup = document.getElementById('bookmark-fields-group');

      if (codeGroup) codeGroup.style.display = selectedType === 'Code' ? 'block' : 'none';
      if (taskGroup) taskGroup.style.display = selectedType === 'Task' ? 'block' : 'none';
      if (bookmarkGroup) bookmarkGroup.style.display = selectedType === 'Bookmark' ? 'block' : 'none';

      // Update content textarea placeholder based on type
      const contentTextarea = document.getElementById('content-textarea');
      if (contentTextarea) {
        if (selectedType === 'Code') {
          contentTextarea.placeholder = '// Paste your code snippet here...\nfunction example() {\n  return "Hello World";\n}';
          contentTextarea.style.fontFamily = "var(--font-code)";
        } else if (selectedType === 'Task') {
          contentTextarea.placeholder = 'List sub-tasks, notes, or acceptance criteria...';
          contentTextarea.style.fontFamily = "var(--font-main)";
        } else if (selectedType === 'Idea') {
          contentTextarea.placeholder = 'Describe your idea or concept...';
          contentTextarea.style.fontFamily = "var(--font-main)";
        } else if (selectedType === 'Bookmark') {
          contentTextarea.placeholder = 'Add a quick description or summary of this link...';
          contentTextarea.style.fontFamily = "var(--font-main)";
        } else {
          contentTextarea.placeholder = 'Type your note content here...';
          contentTextarea.style.fontFamily = "var(--font-main)";
        }
      }
    };

    typeSelect.addEventListener('change', toggleFields);
    // Initial call to set state on load
    toggleFields();
  }

  // 2. Copy Code snippet to clipboard
  const copyBtn = document.getElementById('copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeElement = document.getElementById('code-content-block');
      if (codeElement) {
        const textToCopy = codeElement.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const origText = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓ Copied!';
          copyBtn.style.color = '#10b981';
          setTimeout(() => {
            copyBtn.innerHTML = origText;
            copyBtn.style.color = '#cccccc';
          }, 2000);
        }).catch((err) => {
          console.error('Failed to copy code: ', err);
        });
      }
    });
  }

  // 3. Global Search Shortcut (Ctrl+K or /)
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // 4. Live percentage sync for task range input if present
  const rangeInput = document.getElementById('task-percentage-input');
  const rangeValDisplay = document.getElementById('task-percentage-display');
  if (rangeInput && rangeValDisplay) {
    rangeInput.addEventListener('input', (e) => {
      rangeValDisplay.textContent = `${e.target.value}%`;
    });
  }
});
