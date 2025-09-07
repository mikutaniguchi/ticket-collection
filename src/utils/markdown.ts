export const renderMarkdown = (text: string): string => {
  return (
    text
      // HTTP/HTTPS リンク自動変換
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // 箇条書き
      .replace(/^- (.+)$/gm, '• $1')
      // 改行をbrタグに変換
      .replace(/\n/g, '<br>')
  );
};
