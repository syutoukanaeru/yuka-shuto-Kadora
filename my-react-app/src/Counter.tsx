import { useState, useEffect } from "react";
export function Counter() {
  const [count, setCount] = useState<number>(10);

  const handleDecrement = () => {
    setCount((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCount(10);
  };

  // カウントが変わるたびにタイトルを更新
  useEffect(() => {
    document.title = `残り：${count}回`;
  }, [count]);

  // カウントが0になったらボタンを非活性にする
  const isDisabled = count === 0;

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleDecrement} disabled={isDisabled}>
        Decrement
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
