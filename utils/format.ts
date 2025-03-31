// utils/format.ts

export function formatMessage(raw: string): string {
    let formatted = raw.trim();
  
    // ⭐️ 在 ***標題：** 類型前加換行
    formatted = formatted.replace(/(\*{2,3}[^*：:]{1,30}[：:]\*{2})/g, '\n$1');
  
    // ⭐️ 標題後補換行（若未換）
    formatted = formatted.replace(/(\*{3}[^*]+?\*{3})(?!\n)/g, '$1\n');
    formatted = formatted.replace(/(\*{2}[^*]+?\*{2})(?!\n)/g, '$1\n');
  
    // ⭐️ 在數字項目前補換行（1. 2. 3.）
    formatted = formatted.replace(/(?<!\n)(\d+\.)/g, '\n$1');
  
    // ⭐️ 中文標點後加換行
    formatted = formatted.replace(/([。！？])(?=[^\n])/g, '$1\n');
  
    // ⭐️ 星號處理 - 改進版本，處理更多星號格式
    formatted = formatted.replace(/\*(.*?)：/g, '• $1：');
    formatted = formatted.replace(/(?<!\*)\*(?!\*)([^*\n]+)(?<!\*)\*(?!\*)/g, '• $1');
    formatted = formatted.replace(/(?<!\*)\*\s+/g, '• ');
  
    // ⭐️ 移除過多空行
    formatted = formatted.replace(/\n{2,}/g, '\n');
  
    // ⭐️ 處理 markdown 標記
    formatted = formatted.replace(/^### (.*?)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>');
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>');
    formatted = formatted.replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3">$1</h1>');
    formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-pink-300/50 pl-4 italic text-gray-300 my-3">$1</blockquote>');
  
    // 條列點處理
    const lines = formatted.split('\n');
    let inList = false;
    let listType = '';
    const output: string[] = [];
  
    for (let line of lines) {
      line = line.trim();
      const bulletMatch = line.match(/^(\s*)[\-\•]\s+(.+)$/);
      const numberMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
  
      if (bulletMatch) {
        const indent = bulletMatch[1].length;
        const content = bulletMatch[2];
        const level = Math.floor(indent / 2);
  
        if (!inList || listType !== 'ul') {
          if (inList) output.push(`</${listType}>`);
          output.push(`<ul class="list-disc pl-${level * 4 || 4} ml-3 my-2">`);
          inList = true;
          listType = 'ul';
        }
        output.push(`<li class="my-1">${content}</li>`);
      } else if (numberMatch) {
        const indent = numberMatch[1].length;
        const content = numberMatch[2];
        const level = Math.floor(indent / 2);
  
        if (!inList || listType !== 'ol') {
          if (inList) output.push(`</${listType}>`);
          output.push(`<ol class="list-decimal pl-${level * 4 || 4} ml-3 my-2">`);
          inList = true;
          listType = 'ol';
        }
        output.push(`<li class="my-1">${content}</li>`);
      } else {
        if (inList) {
          output.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        output.push(line);
      }
    }
  
    if (inList) output.push(`</${listType}>`);
    formatted = output.join('\n');
  
    // 包 <p>，段落間距正常
    const paragraphs = formatted.split(/\n/);
    formatted = paragraphs.map((p, idx, arr) => {
      const trimmed = p.trim();
      const prev = arr[idx - 1]?.trim() || '';
      if (trimmed !== '' &&
        !trimmed.startsWith('<h') &&
        !trimmed.startsWith('<ul') &&
        !trimmed.startsWith('<ol') &&
        !trimmed.startsWith('<li') &&
        !trimmed.startsWith('<blockquote') &&
        !trimmed.startsWith('</') &&
        !prev.startsWith('<li')) {
        return `<p class="mb-2 leading-relaxed">${trimmed}</p>`;
      }
      return trimmed;
    }).join('\n');
  
    return formatted;
  }

/**
 * 格式化聊天內容，處理 Gemini AI 回傳的文字內容
 * 將標點符號、列表項目、粗體文字等進行格式化處理
 */
export function formatChatContent(content: string): string {
  // Format text with ** for bold styling and * for italic styling
  let formatted = content
    // Replace **text** with bold text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Replace *text* with italic text
    .replace(/\*(.*?)\*/g, '$1');

  return formatted;
}
