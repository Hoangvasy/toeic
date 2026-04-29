const Part7Passage = ({ passage, renderClickableText }) => {
  // không có dữ liệu
  if (!passage) return null;

  // tách block theo dạng bài
  const blocks = passage.split(
    /\n(?=Email|Memo|Form|Notice|Article|Chart|Advertisement|Letter)/i,
  );

  // render text (có hoặc không clickable)
  const renderText = (text) => {
    if (!text) return null;

    // nếu có truyền function thì dùng
    if (renderClickableText) {
      return renderClickableText(text);
    }

    // fallback text thường
    return text;
  };

  return (
    <div className="space-y-6 font-serif text-[15px] leading-7">
      {blocks.map((block, index) => {
        const lines = block.split("\n").filter(Boolean);

        const title = lines[0];
        const body = lines.slice(1);

        return (
          <div
            key={index}
            className="
              border
              rounded-lg
              p-6
              bg-white
              dark:bg-gray-800
              shadow-sm
            "
          >
            {/* tiêu đề */}

            <div
              className="
                text-xs
                tracking-wider
                font-semibold
                text-gray-500
                mb-3
                uppercase
              "
            >
              {renderText(title)}
            </div>

            {/* nội dung */}

            <div className="space-y-2 text-gray-800 dark:text-gray-200">
              {body.map((line, i) => (
                <p key={i}>{renderText(line)}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Part7Passage;
