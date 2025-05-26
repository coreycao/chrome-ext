function addButtonIfMermaid(codeBlock) {
  const pre = codeBlock.closest('pre');
  if (!pre || pre.dataset.mermaidEnhanced) return;

  const button = document.createElement('button');
  button.innerText = "🪄 Mermaid Live";
  button.className = 'mermaid-btn';

  button.addEventListener('click', () => {
    const code = codeBlock.innerText;
    console.log(code)
    const url = compressToMermaidLiveUrl(code)
    window.open(url, '_blank');
  });

  pre.appendChild(button);
  pre.dataset.mermaidEnhanced = "true";
}

function observeMermaidBlocks() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        const mermaidBlocks = node.querySelectorAll?.('code.language-mermaid') ?? [];
        mermaidBlocks.forEach(addButtonIfMermaid);

        if (node.matches?.('code.language-mermaid')) {
          addButtonIfMermaid(node);
        }
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function compressToMermaidLiveUrl(code) {
  const json = {
    code: code,
    mermaid: {
      theme: "default"
    },
    updateEditor: true
  };

  const jsonStr = JSON.stringify(json);
  const compressed = pako.deflate(jsonStr); // Uint8Array

  // 转 binary string
  let binary = '';
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }

  // base64 encode
  const base64 = btoa(binary);

  // Base64URL
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  // 返回完整 URL
  return `https://mermaid.live/edit#pako:${base64url}`;
}

observeMermaidBlocks();